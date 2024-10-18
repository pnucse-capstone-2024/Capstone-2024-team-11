import cv2
from ultralytics import YOLO
import os
import shutil
from full_body import is_full_body
import logging
import  sys

logging.getLogger("ultralytics").setLevel(logging.ERROR)
# YOLOv8 모델 로드
model = YOLO('yolov9m_35_32.pt', verbose=False)

# 비디오 파일이 있는 폴더 경로
video_folder = '/data/FindSuspect/backend/src/main/frontend/public/video/' + sys.argv[1]

# 저장할 디렉토리 생성
output_folder = sys.argv[1]

if os.path.exists(output_folder):
    # 폴더 내의 모든 파일 삭제
    for filename in os.listdir(output_folder):
        file_path = os.path.join(output_folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}')
else:
    # 폴더가 없으면 새로 생성
    os.makedirs(output_folder)



# 비디오 폴더 내의 모든 파일에 대해 처리
for video_file in os.listdir(video_folder):
    if video_file.endswith(('.mp4', '.avi', '.mov')):  # 비디오 파일 확장자 추가 가능
        video_path = os.path.join(video_folder, video_file)

        # 비디오 파일 열기
        video = cv2.VideoCapture(video_path)

        # FPS 값을 가져오기
        fps = video.get(cv2.CAP_PROP_FPS)

        frame_count = 0
        all_person_count = 0
        target_interval = 5  # 목표 간격 (초)
        next_target_time = target_interval  # 다음 처리할 목표 시간

        while True:
            ret, frame = video.read()
            if not ret:
                break

            frame_count += 1
            current_time = frame_count / fps  # 현재 시간 (초)

            # 목표 시간에 가장 가까운 프레임 처리
            if current_time >= next_target_time:
                # YOLOv8로 객체 감지
                results = model(frame)

                frame_with_rectangles = frame.copy()  # 프레임 복사
                person_count = 0

                for r in results:
                    boxes = r.boxes
                    for box in boxes:
                        if box.cls == 0:  # 0은 'person' 클래스
                            person_count += 1
                            all_person_count += 1
                            x1, y1, x2, y2 = map(int, box.xyxy[0])

                            # 각 사람마다 사각형 그리기
                            cv2.rectangle(frame_with_rectangles, (x1, y1), (x2, y2), (0, 0, 255), 2)  # 빨간 사각형(색상: BGR, 두께: 2)

                # 모든 사각형이 그려진 이미지 저장
                os.makedirs(os.path.join(output_folder, sys.argv[1]), exist_ok=True)
                output_filename = f'{output_folder}/{sys.argv[1]}/{sys.argv[1]}_frame{int(next_target_time)}.jpg'
                cv2.imwrite(output_filename, frame_with_rectangles)

                #print(f"Processed frame at {next_target_time} seconds. Persons detected: {person_count}")
                next_target_time += target_interval  # 다음 목표 시간 설정

        #print(f"Total persons detected in {video_file}: {all_person_count}")
        video.release()