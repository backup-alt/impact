# 🏙️ Metro Pulse: AI Traffic OS v2.0

![Project Status](https://img.shields.io/badge/Status-Active-emerald?style=for-the-badge)
![Python](https://img.shields.io/badge/Backend-Python%20Flask-blue?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
![AI](https://img.shields.io/badge/AI-YOLOv8%20%2B%20EasyOCR-purple?style=for-the-badge)

> **Real-time urban traffic analytics system powered by Computer Vision.**
> *Currently monitoring: Shibuya Scramble Crossing, Tokyo.*

![Dashboard Preview](screenshot.png)
## ⚡ System Overview

**Metro Pulse** is a full-stack AI application that transforms live CCTV footage into actionable data. It uses a **Python/YOLOv8** backend to analyze video streams in real-time and streams the data via WebSockets to a **React** dashboard.

The system is designed to be **fault-tolerant** (auto-healing streams) and **performant** (Turbo Mode frame skipping).

### 🚀 Key Features

* **📡 Live Stream Injection:** Bypasses YouTube HLS protections using `yt-dlp` to analyze live streams directly.
* **🧠 Real-Time Object Detection:** Counts Cars, Buses, Trucks, and Bikes using `YOLOv8n`.
* **🚦 Smart Traffic Grading:** Calculates density dynamically (`LOW` 🟢, `MODERATE` 🟡, `CONGESTED` 🔴).
* **🏎️ Turbo Mode:** Optimized frame-skipping algorithm to triple FPS performance on local machines.
* **🛡️ Self-Healing Connection:** Automatically detects stream drops and reconnects without crashing.
* **👁️ Live OCR:** (Optional) Attempts to read text/license plates from high-res frames.

---

## 🛠️ Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Backend** | Python 3.10+, Flask | API & WebSocket Server |
| **AI Engine** | Ultralytics YOLOv8 | Object Detection |
| **Vision** | OpenCV (cv2) | Frame Processing & Overlay |
| **Streaming** | yt-dlp + FFmpeg | HLS Stream Extraction |
| **Frontend** | React (Vite) | Dashboard UI |
| **Styling** | Tailwind CSS | Styling & Layout |
| **Comms** | Socket.IO | Real-time bi-directional data |

---

## ⚙️ Installation & Setup

### 1. Backend (The Brain)

Navigate to the backend folder.

**Prerequisites:** Python 3.9+ installed.

```bash
# 1. Create a virtual environment (optional but recommended)
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# 2. Install dependencies
pip install flask flask-socketio flask-cors opencv-python ultralytics easyocr yt-dlp
