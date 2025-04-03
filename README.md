# CryptoTrade.gg

암호화폐 거래 전적을 시각화하고 분석하는 웹 애플리케이션입니다.

## 주요 기능

- 다양한 거래소(Upbit, Binance 등) 지원
- 실시간 거래 내역 조회
- 거래 통계 및 분석
- 개인화된 대시보드
- API 키 관리

## 기술 스택

- Frontend: Next.js, React, TypeScript
- Backend: Supabase
- API: CCXT
- UI: Tailwind CSS
- 차트: Chart.js

## 시작하기

### 필수 조건

- Node.js 18.0.0 이상
- npm 또는 yarn
- Supabase 계정
- 거래소 API 키 (Upbit, Binance 등)

### 설치

1. 저장소 클론

```bash
git clone https://github.com/toris-dev/CryptoTrade.gg.git
cd CryptoTrade.gg
```

2. 의존성 설치

```bash
npm install
# or
yarn install
```

3. 환경 변수 설정
   `.env.local` 파일을 생성하고 다음 내용을 추가:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. 개발 서버 실행

```bash
npm run dev
# or
yarn dev
```

## API 키 설정

1. 거래소에서 API 키 발급
2. 로그인 후 설정 페이지에서 API 키 입력
3. API 키는 암호화되어 저장됨

## 보안

- API 키는 암호화되어 저장
- HTTPS 통신 사용
- 세션 기반 인증
- 입력 데이터 검증

## 라이선스

MIT License

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
