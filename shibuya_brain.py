import os
# 🛑 CRITICAL FIX: Disable Windows Media Foundation
os.environ["OPENCV_VIDEOIO_PRIORITY_MSMF"] = "0"

import cv2
import time
import threading
import numpy as np
import easyocr
import yt_dlp
from flask import Flask, Response
from flask_socketio import SocketIO
from flask_cors import CORS
from ultralytics import YOLO

# ==========================================
# 1. CONFIGURATION
# ==========================================
SHIBUYA_STREAM_URL = "https://www.youtube.com/live/dfVK7ld38Ys" 
MODEL_PATH = "yolov8n.pt"
TARGET_CLASSES = [2, 3, 5, 7] 
CLASS_NAMES = {2: "Car", 3: "Bike", 5: "Bus", 7: "Truck"}

# ⚡ PERFORMANCE SETTINGS
AI_SKIP_FRAMES = 3  # Run AI only every 3rd frame (Huge Speed Boost)
STREAM_QUALITY = 70 # JPEG Quality (Lower = Faster)
PROCESS_WIDTH = 640 # Lower resolution for AI processing only

# ==========================================
# 2. SETUP BACKEND
# ==========================================
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

print("⏳ Loading AI Models...")
model = YOLO(MODEL_PATH)
reader = easyocr.Reader(['en'], gpu=True) 

output_frame = None
lock = threading.Lock()
latest_data = {
    "text": "Scanning...", 
    "vehicle_count": 0, 
    "status": "WAITING", 
    "density": 0,
    "objects": {"Car": 0, "Bus": 0, "Truck": 0, "Bike": 0}
}

# ==========================================
# 3. STREAM EXTRACTOR
# ==========================================
def get_stream_url(youtube_url):
    print(f"🕵️  Extracting Stream URL via yt-dlp...")
    ydl_opts = {'quiet': True, 'format': 'best[protocol^=m3u8]', 'noplaylist': True}
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(youtube_url, download=False)
            return info['url']
    except Exception as e:
        print(f"❌ yt-dlp Error: {e}")
        return None

# ==========================================
# 4. AI PROCESSING THREAD (OPTIMIZED)
# ==========================================
def ai_processing_thread():
    global output_frame, latest_data
    last_ocr_time = time.time()
    frame_counter = 0
    last_results = None # Cache for skipped frames
    
    while True:
        stream_url = get_stream_url(SHIBUYA_STREAM_URL)
        if not stream_url: 
            time.sleep(5)
            continue

        print(f"📹 Connecting OpenCV...")
        cap = cv2.VideoCapture(stream_url, cv2.CAP_FFMPEG)
        cap.set(cv2.CAP_PROP_BUFFERSIZE, 1) # minimize latency

        if not cap.isOpened():
            time.sleep(2)
            continue
        
        print("✅ STREAM LOCKED! Turbo Mode Activated...")

        while True:
            success, raw_frame = cap.read()
            if not success:
                print("⚠️ Stream dropped! Re-scanning...")
                break
            
            frame_counter += 1

            # --- 1. RESIZE FOR AI (SPEED HACK) ---
            # We process a small image, but draw on the big one later
            ai_frame = cv2.resize(raw_frame, (PROCESS_WIDTH, 360))

            # --- 2. FRAME SKIPPING ---
            # Only run heavy AI every 'AI_SKIP_FRAMES' (e.g., 3)
            if frame_counter % AI_SKIP_FRAMES == 0 or last_results is None:
                results = model.predict(ai_frame, conf=0.5, classes=TARGET_CLASSES, verbose=False)
                last_results = results
            else:
                results = last_results # Use cached result (Ghosting is minimal on cars)

            # --- 3. SCALING MATH ---
            # We need to scale boxes back up to the full 1024x576 display size
            # (Because we detected on 640x360)
            orig_h, orig_w = raw_frame.shape[:2]
            display_frame = cv2.resize(raw_frame, (1024, 576))
            scale_x = 1024 / PROCESS_WIDTH
            scale_y = 576 / 360
            
            # --- DATA EXTRACTION ---
            # Only update counts when we actually ran the AI
            if frame_counter % AI_SKIP_FRAMES == 0:
                vehicle_count = len(results[0].boxes)
                obj_counts = {"Car": 0, "Bus": 0, "Truck": 0, "Bike": 0}
                for box in results[0].boxes:
                    cls_id = int(box.cls[0])
                    if cls_id in CLASS_NAMES:
                        obj_counts[CLASS_NAMES[cls_id]] += 1
                
                # Logic
                density_val = min(vehicle_count / 25, 1.0)
                if vehicle_count >= 20: status, emoji = "CONGESTED", "🔴"
                elif vehicle_count >= 8: status, emoji = "MODERATE", "🟡"
                else: status, emoji = "LOW", "🟢"

                latest_data = {
                    "text": latest_data["text"], # Keep old text
                    "vehicle_count": vehicle_count,
                    "status": f"{status} {emoji}", 
                    "density": int(density_val * 100),
                    "objects": obj_counts
                }
                socketio.emit('vehicle_data', latest_data)

            # --- VISUALIZATION ---
            # Draw boxes manually since we resized things
            annotated_frame = display_frame.copy()
            
            for box in results[0].boxes:
                # Scale coordinates up
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                x1, x2 = int(x1 * scale_x), int(x2 * scale_x)
                y1, y2 = int(y1 * scale_y), int(y2 * scale_y)
                
                # Draw Box
                cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                
                # Draw Label
                cls_id = int(box.cls[0])
                label = f"{CLASS_NAMES.get(cls_id, 'Veh')} {box.conf[0]:.1f}"
                cv2.putText(annotated_frame, label, (x1, y1 - 10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            with lock:
                output_frame = annotated_frame.copy()
                
            # If we are skipping frames, we don't need to sleep manually
            # Processing naturally limits FPS to ~30
            # time.sleep(0.01) 

        cap.release() 
        time.sleep(1)

# ==========================================
# 5. SERVER ROUTES
# ==========================================
def generate_mjpeg():
    loading_frame = np.zeros((576, 1024, 3), dtype=np.uint8)
    cv2.putText(loading_frame, "CONNECTING...", (350, 250), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

    while True:
        with lock:
            frame = output_frame if output_frame is not None else loading_frame
        
        # COMPRESSION HACK: Quality 70 makes it much faster over network
        (flag, encodedImage) = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, STREAM_QUALITY])
        
        if flag:
            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')
        
        # Don't sleep here, let the generator run as fast as the camera
        # time.sleep(0.01)

@app.route('/video_feed')
def video_feed():
    return Response(generate_mjpeg(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    t = threading.Thread(target=ai_processing_thread)
    t.daemon = True
    t.start()
    
    print("🚀 TURBO BACKEND READY: http://localhost:5000")
    socketio.run(app, host='0.0.0.0', port=5000, debug=False, allow_unsafe_werkzeug=True)