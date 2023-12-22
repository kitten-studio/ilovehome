![](https://ilovehome-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile_banners/profile_banners_1500x500.jpg)

# 🌈️ Ilovehome

제가 진행한 사이드 프로젝트는 지금까지 배운 지식과 자신만의 도메인 지식을 활용하여, 사람들에게 도움이 되는 서비스를 개발하는 것이었습니다. 이 서비스는 기부의 즐거움을 더 많은 사람들과 공유하고자 하는 목적으로 개발되었습니다.

📲️ [Android available on the Google Play Store](https://play.google.com/store/apps/details?id=com.ilovehomeapp)

# 구현된 피처

-   yarn workspace를 이용해서 monorepo로 프로젝트 환경 구성
-   azure pipelines를 이용해서 앱 배포 자동화 구현
-   react-native를 이용해서 react로 android / ios 에서 동시 개발 환경 구성
-   app updated 팝업 구현
-   jwt 기반 로그인 인증 시스템 구현
-   kakao provider를 이용해서 로그인 연동 구현
-   zustand로 전역 상태 구현
-   image-picker를 사용해서 google firebase store에 이미지 업로드 구현
-   styled-components를 이용해서 component 스타일의 css 구현
-   ErrorBoundary로 error catch 구현
-   서비스에 필요한 각종 UI 구현

# 개발 환경

-   node : v16.16.0
-   react : v18.1.0
-   react-native : v0.70.2
-   react-navigation : v6.0.13
-   react-native-webview : v11.26.1
-   styled-components : v5.3.6
-   zustand : v4.1.2

# 프로젝트 구조

yarn의 workspace 환경을 이용해서 monorepo 환경을 구축 하였습니다.

```
node_modules
packages/ilovehomeApp
src
├── @types     - 정의 된 타입의 모임
├── navigator  - 스크린 화면을 네비게이션에 등록
├── screens    - 각종 화면에 필요한 구성의 모임
├   ├── components - 공통 컴포넌트 모임
├   ├── lib        - 서비스에 공통으로 필요한 라이브러리 모임
├   ├── login      - 로그인 관련 로직 모임
├── static     - 이미지 파일의 모임
patches
```

# 실행 방법

```
yarn 으로 modules 업데이트 후
packages/ilovehomeApp 폴더에서 yarn dev으로 metro 기동
yarn android 으로 앱 기동
```

# 배포 방법

git의 branch를 환경별로 tigger를 세팅하고 azure pipelines으로 빌드 하고 App Center에 파일 배포 및 fastlane을 사용해서 google play console 에도 자동으로 배포 할수 있도록 환경을 구축 했습니다.

![](https://learn.microsoft.com/ja-jp/azure/devops/pipelines/get-started/media/key-concepts-overview.svg?view=azure-devops)

-   deploy/app-dev, deploy/app-preview deploy/app-real 브랜치 tigger 방식
-   azure 파이프라인이 실행되면서 각 브랜치에 맞는 환경으로 배포

# etc.

-   Ilovehome은 AWS S3 + EC2 + CF의 조합으로 운영하고 있습니다.
-   외부에서 참조한 일부 환경변수와 코드는 삭제 되어 기동은 되지 않습니다.
