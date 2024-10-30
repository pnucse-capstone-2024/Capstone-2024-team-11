import os
import json
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import shutil

attr_words = [
    '짧은 상의',    # 1
    '짧은 하의',    # 2
    '숄더백',       # 3
    '백팩',         # 4
    '모자',         # 5
    '손가방',       # 6
    '긴 머리',      # 7
    '여성',         # 8
    '하의 치마',     # 9
    '걷는 중',       #10
    '달리는 중',     #11
    '타고 있는 중',   #12
    '서 있는 중',    #13
    '다양한 동작',
    '상의 검정색',    #14
    '상의 보라색',    #15
    '상의 초록색',    #16
    '상의 파란색',    #17
    '상의 회색',     #18
    '상의 흰색',     #19
    '상의 노란색',   #20
    '상의 빨간색',   #21
    '상의 복잡한 색상',#22
    '하의 흰색',     #23
    '하의 보라색',    #24
    '하의 검정색',    #25
    '하의 초록색',    #26
    '하의 회색',     #27
    '하의 분홍색',    #28
    '하의 노란색',    #29
    '하의 파란색',    #30
    '하의 갈색',     #31
    '하의 복잡한 색상',#32
    '젊은',         #33
    '청소년',       #34
    '성인',         #35
    '노인'          #36
]

# 속성 가중치 벡터 수정
attribute_weights = np.array([
    1.2,  # '짧은 상의' (상의 길이)
    1.2,  # '짧은 하의' (하의 길이)
    1.5,  # '숄더백'
    1.5,  # '백팩'
    1.8,  # '모자'
    1.5,  # '손가방'
    1.3,  # '긴 머리'
    1.7,  # '여성'
    1.5,  # '하의 치마'
    1.0,  # '걷는 중'
    1.0,  # '달리는 중'
    1.0,  # '타고 있는 중'
    1.0,  # '서 있는 중'
    1.0,  # '다양한 동작'
    1.6,  # '상의 검정색'
    1.6,  # '상의 보라색'
    1.6,  # '상의 초록색'
    1.6,  # '상의 파란색'
    1.6,  # '상의 회색'
    1.6,  # '상의 흰색'
    1.6,  # '상의 노란색'
    1.6,  # '상의 빨간색'
    1.6,  # '상의 복잡한 색상'
    1.6,  # '하의 흰색'
    1.6,  # '하의 보라색'
    1.6,  # '하의 검정색'
    1.6,  # '하의 초록색'
    1.6,  # '하의 회색'
    1.6,  # '하의 분홍색'
    1.6,  # '하의 노란색'
    1.6,  # '하의 파란색'
    1.6,  # '하의 갈색'
    1.6,  # '하의 복잡한 색상'
    1.2,  # '젊은'
    1.2,  # '청소년'
    1.2,  # '성인'
    1.2   # '노인'
])

def get_similarity(feature, new_attr_words, image_name):
    # features 폴더에서 파일 목록을 가져오기
    input_folder = "features"
    output_folder = f"result/{image_name}"
    
    # 출력 폴더가 없으면 생성
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    output_path = f"/data/FindSuspect/backend/src/main/resources/data"

    # 폴더가 존재하면 삭제
    if os.path.exists(output_path):
        shutil.rmtree(output_path)

    # 폴더 생성
    os.makedirs(output_path)

    # features 폴더 내의 모든 JSON 파일에 대해 작업 수행
    for file_name in os.listdir(input_folder):
        if file_name.endswith('.json'):  # JSON 파일만 처리
            file_path = os.path.join(input_folder, file_name)
            
            with open(file_path, 'r') as f:
                data = json.load(f)  # 각 파일의 내용을 딕셔너리로 로드

            result = {}  # 최종 결과 저장
            # 딕셔너리 형태로 변환된 데이터 순회
            for key, value in data.items():
                # 벡터화 및 가중치 적용
                vec1 = np.array(feature)  * attribute_weights
                vec2 = np.array(value)  * attribute_weights
                vec1 = vec1.reshape(1, -1)
                vec2 = vec2.reshape(1, -1)
                # 코사인 유사도 계산
                similarity = cosine_similarity(vec1, vec2)
                result[key] = similarity[0][0]

            # 유사도 상위 5개의 속성 추출
            top_5_similarities = dict(sorted(result.items(), key=lambda item: item[1], reverse=True)[:5])
            detailed_result = {}

            # 결과를 저장할 파일 경로 설정
            output_file_path = os.path.join(output_path, file_name)
            for key, overall_similarity in top_5_similarities.items():
                value = data[key]
                feature_similarities = []

                # 각 feature의 유사도를 계산 (속성 이름은 동일)
                for i in range(len(feature)):
                    # 각 feature에 대해 가중치 적용
                    feature_weight = attribute_weights[i]
                    feature_vec1 = np.array([feature[i] * feature_weight]).reshape(1, -1)
                    feature_vec2 = np.array([value[i] * feature_weight]).reshape(1, -1)
                    difference = abs(feature_vec1 - feature_vec2)
                    feature_similarities.append((difference, feature[i], value[i], attr_words[i]))

                # 유사도 상위 5개의 feature와 속성 이름 추출
                top_5_features = sorted(feature_similarities, key=lambda x: x[0])[:5]
                top_5_input_values = [item[1] for item in top_5_features]  # 상위 5개의 원본 feature 값
                top_5_file_values = [item[2] for item in top_5_features]  # 상위 5개의 파일 feature 값
                top_5_names = [item[3] for item in top_5_features]        # 상위 5개의 속성 이름
                video_name_idx = key.find('mp4') + len('mp4')
                video_name = key[:video_name_idx]
                detailed_result[key] = {
                    "video_name": video_name,
                    "similarity": overall_similarity * 100,  # 백분율로 변환
                    "original_top5": top_5_input_values,
                    "file_top5": top_5_file_values,
                    "attr_words": top_5_names
                }

            # 결과 저장
            with open(output_file_path, 'w') as out_file:
                json.dump(detailed_result, out_file, indent=4)
