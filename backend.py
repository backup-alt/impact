from flask import Flask, jsonify
from flask_cors import CORS
import cv2
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

model = YOLO("yolov8n.pt")
VIDEO_SOURCE = "traffic_video2.mp4"

def analyze_traffic():

    cap = cv2.VideoCapture(VIDEO_SOURCE)
    ret, frame = cap.read()
    cap.release()

    if not ret:
        return {"error": "Video not readable"}

    h, w, _ = frame.shape
    frame_area = h * w

    results = model.predict(
        frame,
        conf=0.4,
        classes=[2,3,5,7],
        verbose=False
    )

    boxes = results[0].boxes.xyxy.cpu().numpy().astype(int)

    vehicle_count = len(boxes)
    total_area = 0

    for x1,y1,x2,y2 in boxes:
        total_area += (x2-x1)*(y2-y1)

    density = total_area / frame_area

    if density < 0.08:
        status = "LOW"
    elif density < 0.20:
        status = "MODERATE"
    else:
        status = "HIGH"

    return {
        "vehicles": vehicle_count,
        "density": round(density,2),
        "traffic": status
    }

@app.route("/api/traffic")
def traffic():
    return jsonify(analyze_traffic())

if __name__ == "__main__":
    app.run(debug=True)
