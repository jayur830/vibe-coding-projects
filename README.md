# Vibe Coding Projects

> *이 프로젝트는 바이브 코딩으로 제작되었습니다.*

## 소개

이 저장소는 바이브 코딩을 통해 개발된 다양한 프로젝트들을 포함하고 있습니다. 모든 프로젝트는 테스트 주도 개발(TDD) 방식으로 작성되었으며, TypeScript를 기반으로 구현되었습니다.

## 포함된 프로젝트

### 🐎 Knights Tour (기사의 여행)
- **위치**: `./knights-tour/`
- **기술 스택**: React, TypeScript, CSS3
- **설명**: 체스의 나이트가 보드의 모든 칸을 정확히 한 번씩 방문하는 수학적 퍼즐 게임
- **특징**: 
  - 5×5부터 8×8까지 다양한 보드 크기 지원
  - Warnsdorff 알고리즘 기반 힌트 시스템
  - 반응형 디자인
  - 포괄적인 테스트 커버리지 (47개 테스트)

## 개발 원칙

이 프로젝트는 다음과 같은 핵심 원칙을 따릅니다:

### 1. 테스트 우선 개발 (TDD)
- 모든 기능은 테스트 코드를 먼저 작성한 후 구현
- Red-Green-Refactor 사이클 준수
- 높은 테스트 커버리지 유지 (90% 이상 목표)

### 2. TypeScript 사용
- 모든 새로운 프로젝트는 TypeScript로 작성
- 엄격한 타입 검사 활성화
- 적절한 인터페이스와 타입 정의

### 3. 코드 품질
- ESLint와 Prettier를 통한 일관된 코드 스타일
- 의미 있는 변수명과 함수명 사용
- 적절한 주석과 문서화

### 4. 한국어 우선
- 테스트 설명과 커밋 메시지는 한국어로 작성
- 사용자 인터페이스는 한국어 지원
- 문서화는 한국어로 제공

## 시작하기

### 전체 프로젝트 클론
```bash
git clone [repository-url]
cd vibe-coding-projects
```

### 개별 프로젝트 실행
각 프로젝트 디렉토리로 이동하여 README.md 파일의 실행 지침을 따르세요.

예시 - Knights Tour 실행:
```bash
cd knights-tour
npm install
npm start
```

### 테스트 실행
```bash
cd knights-tour
npm test
```

## 프로젝트 구조

```
vibe-coding-projects/
├── .cursorrules          # Cursor AI 개발 규칙
├── README.md             # 이 파일
├── knights-tour/         # 기사의 여행 게임
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
└── [future-projects]/    # 향후 추가될 프로젝트들
```

## 기여 가이드라인

1. `.cursorrules` 파일의 개발 원칙을 준수해주세요
2. 새로운 기능은 테스트 코드를 먼저 작성해주세요
3. TypeScript를 사용해주세요
4. 커밋 메시지와 PR 설명은 한국어로 작성해주세요
5. 모든 테스트가 통과하는지 확인해주세요

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 연락처

바이브 코딩 관련 문의사항이 있으시면 언제든지 연락해주세요.

---

**바이브 코딩으로 더 나은 코드를, 더 즐거운 개발을!** ✨ 