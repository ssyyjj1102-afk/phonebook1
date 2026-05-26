# 📞 전화번호부 관리 시스템

antigravity(Flask) + HTML/CSS/JS로 만든 전화번호부 관리 시스템입니다.

## 기능
- 연락처 추가 / 수정 / 삭제
- 이름, 전화번호, 이메일로 검색
- 그룹별 필터링 (가족, 친구, 직장, 기타)
- 통계 현황판

## Vercel 배포 방법

### 1단계: GitHub에 올리기

1. [github.com](https://github.com) 접속 → 로그인
2. 우상단 `+` 버튼 → **New repository** 클릭
3. Repository name 입력 (예: `phonebook`) → **Create repository**
4. 아래 명령어로 코드 올리기:

```bash
cd phonebook
git init
git add .
git commit -m "첫 커밋"
git branch -M main
git remote add origin https://github.com/[내 아이디]/phonebook.git
git push -u origin main
```

### 2단계: Vercel에 배포하기

1. [vercel.com](https://vercel.com) 접속 → **GitHub으로 로그인**
2. **Add New Project** 클릭
3. GitHub에서 `phonebook` 저장소 선택 → **Import**
4. 설정은 그대로 두고 **Deploy** 클릭
5. 1~2분 후 배포 완료! 🎉

배포된 링크: `https://phonebook-[이름].vercel.app`

## 로컬 실행 방법

```bash
pip install -r requirements.txt
cd api
python index.py
```

브라우저에서 `http://localhost:5000` 접속
