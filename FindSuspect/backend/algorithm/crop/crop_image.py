import cv2
from ultralytics import YOLO
import os
import shutil
from full_body import is_full_body
import logging
import sys

logging.getLogger("ultralytics").setLevel(logging.ERROR)
# YOLOv8 모델 로드
model = YOLO('yolov9m_35_32.pt', verbose=False)

# 비디오 파일이 있는 폴더 경로
image_name = sys.argv[1]
image_folder = f'/data/FindSuspect/backend/src/main/frontend/public/image'
image_path = os.path.join(image_folder, image_name)
output_folder = 'image_output'

# 이미지 폴더 내의 모든 파일에 대해 처리

image = cv2.imread(image_path)

image_height, image_width = image.shape[:2]
results = model(image)
person_count = 0
for r in results:
    boxes = r.boxes
    for box in boxes:
        if box.cls == 0 :  # 0은 'person' 클래스
            person_count += 1
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cropped_human = image[y1:y2, x1:x2]
            
            frame_with_rectangle = image.copy()  # 이미지 복사
            cv2.rectangle(frame_with_rectangle, (x1, y1), (x2, y2), (0, 0, 255), 2)  # 빨간 사각형(색상: BGR, 두께: 2)
            
            # 크롭된 이미지 저장
            output_filename = f'{image_name}_cropped.jpg'
            output_path = os.path.join(output_folder, output_filename)
            print(str(output_path))
            cv2.imwrite(output_path, cropped_human)

            output_path = os.path.join(image_folder, output_filename)
            print(str(output_path))
            cv2.imwrite(output_path, cropped_human)

            save_filename = f'{image_name}_rectangle.jpg'
            output_path = os.path.join(image_folder, save_filename)
            print(str(output_path))
            cv2.imwrite(output_path, frame_with_rectangle)
        