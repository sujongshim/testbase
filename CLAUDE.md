# testbase 프로젝트 지침

- 저장소: https://github.com/sujongshim/testbase (public)
- 배포 주소: https://testbase-one.vercel.app
- Vercel projectId: prj_UWU0KGhraKJ5vVKC6XD7A2Bpjmpb
- Vercel orgId(팀): team_PqGD0pAGTdqT5sIEWH00Yg6w (SJ, sj-6217 — 이 계정은 "개인 계정" 스코프를 지원하지 않아 hobby 팀이 실질적 개인 작업공간)
- 구성: 로그인 없이 브라우저 localStorage만 쓰는 정적 HTML 사이트. Supabase DB는 사용하지 않음(원본 컨셉이 "회원가입 없음, 기록은 내 폰에만"이라 의도적으로 미사용).
- 내용: "소확앱" 홈(index.html) + 5개 하위 앱(fasting, move, sleep, jar, read). jar 앱은 사용자가 지정한 "jar-budget_최종" 버전을 정본으로 사용.
- GitHub 저장소와 Vercel 프로젝트 간 자동 배포 연동(vercel git connect)은 아직 안 돼 있음 — 현재는 `vercel --prod` 수동 배포로 반영.
