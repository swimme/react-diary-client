# react-diary-client

> 21-1 전산학특강 텀프로젝트

## 프로젝트 설명

> 하루의 기분과 함께 일상을 기록할 수 있는 나만의 다이어리를 만들어보자!

## 실행

- you need `.env.development` or `.env.production` file
- https://github.com/swimme/react-diary-client/issues/12

```
$ yarn install
$ yarn build:server
$ yarn start:server

```

## 기술 스택

- boiler plate
  - NextJs
- Client
  - React
- Backend For Frontend Server
  - NodeJS, Express
- Client와 BFF 간 데이터 통신 - restful api
  - axios
- Continuous Integration
  - prettier
  - eslint
  - yarn (package manager)
- language
  - Typescript

## 구조

```
.
├─ README.md
├─ common/
├─ pages/
├─ server/
├─ share/
│      interfaces/
├─ views/
│      components/

```

- common : 클라이언트용 함수
- pages : 라우팅
- public : 이미지 파일 등 static file
- server : bff api 서버 로직
- share : 공통 모듈, 인터페이스
- views : React 컴포넌트
  - components : 공통 React 컴포넌트

## 기능

### (1) 일기 CRUD

#### ① 일기 쓰기

일기 글을 작성하고 저장할 수 있습니다. 글 내용을 에디터에서 작성하고, 오늘의 기분을 선택할 수 있습니다.

- draft.js 에디터
- 글감 검색 기능: Naver 책 검색 API 활용
  - 책 검색하기
  - 검색한 글감(책) 본문에 추가하기

#### ② 일기 보기

내가 작성한 일기 글의 내용을 확인할 수 있습니다.

#### ③ 일기 목록보기

내가 작성한 글들을 최신순으로 목록에서 확인할 수 있습니다. 항목을 클릭하면 글 보기 페이지로 이동합니다.

#### ④ 일기 삭제

내가 작성한 일기 글을 삭제할 수 있습니다.

#### ⑤ 일기 수정

내가 작성한 일기 글을 수정하고 저장할 수 있습니다.

### (2) 에디터

### (3) 일기 검색

사용자의 일기 내용을 검색할 수 있습니다. 사용자가 입력한 검색어가 내용에 포함된 일기의 목록을 보여주며, 페이지네이션을 적용하였습니다.

### (4) 기분별 일기 조회

좌측 사이드바에서 기분별로 일기를 조회할 수 있습니다.

### (5) 캘린더와 기분 통계

- 캘린더 기능과 함께 한달 간 나의 기분을 한눈에 확인할 수 있습니다.
- 한달 간 나의 기분이 어땠는지 그래프로 확인할 수 있습니다.

### (6) 로그인, 로그아웃

구글 소셜로그인을 통해 간편하게 로그인 / 로그아웃 할 수 있습니다.

### (7) 오늘의 편지

가장 최근 일기의 기분에 따라 메시지를 사이드바에 출력합니다.
