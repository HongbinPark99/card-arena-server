# 🚀 Card Arena - GitHub에 바로 올리기

## 📁 이 폴더의 파일들을 GitHub에 올리세요!

```
github-deploy/
├── server.js          ← 서버 코드
├── package.json       ← 서버 설정
├── README.md         ← 이 파일
└── public/
    └── index.html    ← 게임 파일 (이미 서버 주소 수정됨!)
```

---

## 🎯 빠른 시작 (5분 완성!)

### 1단계: GitHub Repository 생성

1. https://github.com/new 접속
2. Repository name: `card-arena-server`
3. Public 선택
4. ✅ Add a README file 체크
5. `Create repository` 클릭

---

### 2단계: 파일 업로드

**방법 A: 웹에서 직접 업로드 (추천!)**

1. Repository 메인 페이지에서 `Add file` → `Upload files` 클릭

2. **루트 파일들 먼저 업로드:**
   - `server.js` 드래그
   - `package.json` 드래그
   - 하단에 "Upload files" 버튼 클릭

3. **public 폴더 만들기:**
   - 다시 `Add file` → `Create new file` 클릭
   - Name 입력란에: `public/index.html`
   - 내용에 `index.html` 파일 전체 복사 붙여넣기
   - 하단 `Commit new file` 클릭

**방법 B: Git 사용 (고급)**

```bash
git clone https://github.com/사용자명/card-arena-server.git
cd card-arena-server
# 이 폴더의 모든 파일 복사
git add .
git commit -m "Initial commit"
git push
```

---

### 3단계: Render.com 배포

1. https://dashboard.render.com 접속 (GitHub로 로그인)

2. `New +` → `Web Service` 클릭

3. `Connect a repository` 클릭
   - GitHub 연동 (처음이면 권한 승인)
   - `card-arena-server` 선택

4. **설정 입력:**
   ```
   Name: card-arena-server
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

5. `Create Web Service` 클릭

6. 배포 시작! (3-5분 소요)
   - 로그에서 "🎮 Card Arena Server running on port..." 나오면 성공!

---

### 4단계: 완료!

**서버 주소:**
```
https://card-arena-server.onrender.com
```

**게임 접속:**
```
https://card-arena-server.onrender.com
```

브라우저에서 바로 게임 실행!

---

## 🎮 사용 방법

### 혼자 플레이
1. 게임 접속
2. 계정 생성
3. VS AI 선택

### 친구와 플레이
1. 친구에게 주소 공유: `https://card-arena-server.onrender.com`
2. 양쪽에서 계정 생성 (다른 이름으로!)
3. **ONLINE VS** 선택
4. 자동 매칭!

---

## ⚠️ 주의사항

### Render 무료 플랜
- 15분 동안 접속 없으면 슬립 모드
- 첫 접속 시 20-30초 로딩 (정상!)
- 새로고침 여러 번 하면 깨어남

### 해결 방법
1. 접속 후 1분 정도 기다리기
2. 페이지 새로고침 (F5)
3. 서버 로그 확인: Render Dashboard → Logs

---

## 🔧 업데이트 방법

### 게임 수정 시:
1. GitHub에서 `public/index.html` 수정
2. Render가 자동으로 재배포!

### 서버 수정 시:
1. GitHub에서 `server.js` 수정
2. Render가 자동으로 재배포!

---

## 📊 모니터링

**Render Dashboard에서 확인:**
- Logs: 서버 로그, 에러 확인
- Metrics: 접속자 수, 메모리 사용량
- Events: 배포 히스토리

---

## 🎉 완료 체크리스트

- [ ] GitHub Repository 생성
- [ ] server.js 업로드
- [ ] package.json 업로드
- [ ] public/index.html 업로드
- [ ] Render.com 계정 생성
- [ ] Web Service 연결
- [ ] 배포 완료 (초록불!)
- [ ] 브라우저에서 접속 테스트
- [ ] 친구와 멀티플레이 테스트

---

## 💡 팁

### 빠른 테스트 (혼자서)
1. 크롬 일반 모드로 접속
2. 크롬 시크릿 모드로 접속
3. 각각 다른 계정 생성
4. 양쪽에서 ONLINE VS 클릭
5. 자동 매칭!

### 커스텀 도메인
- Render Settings → Custom Domain
- 원하는 도메인 연결 가능 (별도 구매 필요)

---

## 🐛 문제 해결

### "Application failed to respond"
→ 서버가 슬립 모드에서 깨어나는 중
→ 1분 기다리고 새로고침

### "Cannot connect to server"
→ Render 로그 확인
→ server.js에 오류 없는지 확인

### 매칭 안됨
→ F12 → Console 확인
→ "Connected to server" 메시지 확인

---

## 📞 도움이 필요하면

1. Render Logs 확인
2. Browser Console (F12) 확인
3. GitHub Issues에 질문

---

**이제 전세계 어디서나 친구들과 카드 배틀을 즐기세요! 🎮✨**
