def is_full_body(box, image_height, image_width):
    x1, y1, x2, y2 = map(int, box.xyxy[0])
    box_height = y2 - y1
    box_width = x2 - x1
    
    # 전신 기준: 박스의 높이가 이미지 높이의 70% 이상
    height_ratio = box_height / image_height
    return height_ratio > 0.7 