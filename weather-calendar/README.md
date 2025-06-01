# 날씨 캘린더 웹앱

이 프로젝트는 바이브 코딩으로 제작되었습니다.

## 📋 프로젝트 소개

날씨 정보가 통합된 아름다운 캘린더 웹앱입니다. 각 날짜별로 날씨 정보를 확인할 수 있으며, 직관적이고 현대적인 UI로 제작되었습니다.

## ✨ 주요 기능

- 📅 **월별 캘린더 뷰**: 깔끔하고 직관적인 캘린더 인터페이스
- 🌤️ **실시간 날씨 정보**: OpenWeatherMap API를 통한 정확한 날씨 데이터
- 🎨 **현대적인 UI/UX**: 글래스모피즘 효과와 그라디언트 디자인
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기 지원
- 🌡️ **날씨 아이콘**: 직관적인 이모지 기반 날씨 표시
- 📍 **위치 기반 서비스**: 기본 서울 위치 설정 (확장 가능)

## 🛠️ 기술 스택

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 (Flexbox, Grid, Animations)
- **Date Library**: date-fns
- **Testing**: Vitest + React Testing Library
- **API**: OpenWeatherMap API

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:5173`으로 접속

3. **테스트 실행**
   ```bash
   npm test
   ```

4. **프로덕션 빌드**
   ```bash
   npm run build
   ```

5. **빌드 결과 미리보기**
   ```bash
   npm run preview
   ```

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── WeatherCalendar.tsx      # 메인 캘린더 컴포넌트
│   └── WeatherCalendar.test.tsx # 컴포넌트 테스트
├── hooks/
│   └── useWeatherData.ts        # 날씨 데이터 관리 훅
├── types/
│   └── weather.ts               # 타입 정의
├── App.tsx                      # 메인 앱 컴포넌트
├── App.css                      # 스타일시트
└── main.tsx                     # 앱 진입점
```

## 🧪 테스트

이 프로젝트는 TDD(Test-Driven Development) 방식으로 개발되었습니다.

```bash
# 모든 테스트 실행
npm test

# 테스트 watch 모드
npm run test:watch

# 테스트 커버리지
npm run test:coverage
```

## 🎨 UI/UX 특징

- **글래스모피즘 효과**: 반투명 배경과 블러 효과
- **그라디언트 디자인**: 아름다운 색상 조합
- **호버 애니메이션**: 부드러운 상호작용 효과
- **반응형 레이아웃**: 모든 화면 크기에 최적화
- **접근성 고려**: 명확한 색상 대비와 직관적인 인터페이스

## 🌐 API 설정

현재는 데모 키를 사용하고 있습니다. 실제 운영을 위해서는:

1. [OpenWeatherMap](https://openweathermap.org/api)에서 API 키 발급
2. 환경변수 설정:
   ```bash
   VITE_WEATHER_API_KEY=your_api_key_here
   ```
3. `src/hooks/useWeatherData.ts`에서 API 키 업데이트

## 📱 반응형 브레이크포인트

- **Desktop**: 769px 이상
- **Tablet**: 481px - 768px
- **Mobile**: 480px 이하

## 🔧 개발 스크립트

```json
{
  "dev": "vite",                    // 개발 서버 실행
  "build": "tsc -b && vite build",  // 프로덕션 빌드
  "preview": "vite preview",        // 빌드 결과 미리보기
  "test": "vitest run",             // 테스트 실행
  "test:watch": "vitest",           // 테스트 watch 모드
  "test:coverage": "vitest --coverage" // 커버리지 리포트
}
```

## 🚀 배포

빌드된 `dist` 폴더를 정적 호스팅 서비스에 배포할 수 있습니다:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이나 버그 리포트는 이슈를 통해 남겨주세요.

---

**바이브 코딩**으로 제작된 현대적이고 아름다운 날씨 캘린더 웹앱입니다. 🌟
