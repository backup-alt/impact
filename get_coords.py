import cv2

VIDEO_SOURCE = "traffic_video.mp4"

cap = cv2.VideoCapture(VIDEO_SOURCE)
ret, frame = cap.read()

if not ret:
    print("Error loading video")
    exit()

print("Click 4 points for the lane polygon")

points = []

def click_event(event, x, y, flags, params):
    if event == cv2.EVENT_LBUTTONDOWN:
        print(f"[{x}, {y}],")
        points.append((x, y))

        # Draw point
        cv2.circle(frame, (x, y), 5, (0, 0, 255), -1)

        # Draw line if more than 1 point
        if len(points) > 1:
            cv2.line(frame, points[-2], points[-1], (0, 255, 0), 2)

        cv2.imshow("Get Coordinates", frame)

cv2.imshow("Get Coordinates", frame)
cv2.setMouseCallback("Get Coordinates", click_event)

cv2.waitKey(0)
cv2.destroyAllWindows()
