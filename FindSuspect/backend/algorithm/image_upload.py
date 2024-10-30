import subprocess
import os
import shutil
import sys

def run_python_file(file_path, *args):
    # 파일이 있는 디렉토리로 이동
    file_dir = os.path.dirname(file_path)
    original_dir = os.getcwd()
    os.chdir(file_dir)

    try:
        # Python 파일 실행
        result = subprocess.run(['python', file_path]+list(args), capture_output=True, text=True, check=True)
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error occurred: {e}")
        print(f"Error output: {e.output}")
    finally:
        # 원래 디렉토리로 돌아감
        os.chdir(original_dir)

def move_files(src_dir, dst_dir):
    # 목적지 디렉토리가 존재하면 삭제
    if os.path.exists(dst_dir):
        shutil.rmtree(dst_dir)
    
    # 목적지 디렉토리 새로 생성
    os.makedirs(dst_dir)
    
    # 소스 디렉토리의 모든 파일을 목적지 디렉토리로 이동
    for item in os.listdir(src_dir):
        s = os.path.join(src_dir, item)
        d = os.path.join(dst_dir, item)
        shutil.move(s, d)

# 현재 디렉토리 경로
current_dir = os.path.dirname(os.path.abspath(__file__))

# a.py와 b.py의 경로
a_path = os.path.join(current_dir, 'crop', 'crop_image.py')
b_path = os.path.join(current_dir, 'VTFPAR++', 'one_image_test.py')

src_folder = os.path.join(current_dir, 'crop', 'image_output')
dst_folder = os.path.join(current_dir, 'VTFPAR++', 'suspect_snapshots')

# Python 파일 실행
run_python_file(a_path, sys.argv[1])
move_files(src_folder, dst_folder)
run_python_file(b_path, sys.argv[1])
