import sys
import os

# phonebook 폴더 루트에서 실행해도 api/index.py를 올바르게 찾도록 경로 추가
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'api'))

from index import app

if __name__ == '__main__':
    print("서버 시작: http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
