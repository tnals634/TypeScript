# TypeScript
내일배움캠프 TypeScript

### api 명세서(초반에 작성함/수정x)
- 작업결과와 다를 수 있음
[https://www.notion.so/typescript-project-API-1efebd80196d4111861bf75a40460bec?pvs=4]

### erd 다이어그램
![image](https://github.com/tnals634/TypeScript/assets/50979515/32cc26fd-f9a9-4e6c-8168-13d607bc7546)

typeORM 사용
[https://typeorm.io/]

-----
### 기능
- 회원가입
- 로그인
- 이메일 인증
- 유저 정보 조회
- 로그아웃
- 공연 등록
- 공연 목록 조회
- 공연 타이틀순 조회
- 공연 상세 조회
- 공연 검색
- 좌석없이 공연예매
- 공연 예매 조회
----
#### - 회원가입
- email, password, confirmPWD, name, nickname, phone, is_admin, authCode 를 필수로 입력
- validation 적용
- 테이블을 user와 userInfo로 나눈 이유는 user는 로그인만 관여해두고 싶어서입니다.

-----
### - 로그인
- email, password 필수 입력
- validation 적용
- refreshToken, accessToken 적용

----
### - 이메일 인증
- email 필수 입력
- nodemailer 사용
- 구글의 앱 비밀번호 사용
  - 구글 계정 - 보안 - 2단계 인증 - 앱 비밀번호 생성
- validation 적용

-----
### - 유저 정보 조회
- 로그인한 user_id를 사용
- user_id, isAdmin, name, nickname, phone, point 조회

-----
### - 로그아웃
- 로그인한 user_id를 사용

-----
### - 공연 등록
- user_id, title, content, date, time, place, seatCount, category 필수 입력
- image는 필수입력이  아님
  - multer-s3를 사용
  - html을 만들어놓진 않아 잘 되는지는 몰라요.
- date와 time을 따로 입력받은 후 dateAndTime이라는 변수에 JSON.stringinfy로 배열을 변환한 값을 넣음
- validation 적용

-----
### - 공연 목록 조회 / 공연 이름순(타이틀순) 조회
- 로그인하지 않아도 조회 가능
- performanceId, userId, image, category, director, title, place, price, date 값을 보내줌

-----
### - 공연 상세 조회
- 로그인하지 않아도 조회 가능
- performanceId, userId, image, category, director, title, content, seat, reservationAvailability, price, date 값을 보내줌

-----
### - 공연 검색
- search, searchType 필수 입력
- searchType(0: title, 1: content, 2: category)
- validation 적용
- performanceId, userId, image, category, director, title, place, price, date 값을 보내줌

-----
### - 좌석없이 공연 예매
- reserveCount 필수 입력
  - 몇개의 좌석을 예매할껀지 숫자 입력
- performance_id는 param에서, user_id는 로그인한 정보에서 가져옴
- validation 적용

-----
### - 예매 정보 조회
- 예매한 정보 최신순으로 조회
- performance_id, title, director, point, seat, date 값을 보내줌줌
