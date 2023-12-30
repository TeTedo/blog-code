# 주변 음식점 랜덤 찾기

항상 점심시간이나 낯선 공간에 갔을때 귀차니즘으로 음식점을 찾아보지 않는 나같은 사람들을 위해 개발했다.

비슷한 기능을 하는 웹이나 앱이 널리고 널렸지만 생각을 실천으로 옮기는 첫번째 프로젝트라 나름 재밌게 개발했다.

개발하면서 나름 고민했던 부분들을 공유하기 위해 글을 쓴다.

# 1. 구글맵 구현

먼저 네이버지도, 카카오맵 등도 많은데 구글맵을 선택한 이유는 글로벌한 프로젝트를 만들어보고 싶어서이다.

구글맵은 프론트(react)에서 구현을 했다.
[GoogleMapsPlatform](https://developers.google.com/maps?hl=ko)에서는 nodejs의 예시코드가 있었기 때문에 react를 위한 라이브러리를 선택해야 했다.

react-google-maps/api와 google-map-react 두개의 선택지가 있었는데 꾸준히 커밋 기록이 있는 react-google-maps/api를 선택했다. 스타의 개수를 생각하면 후자를 선택해야 했지만 둘다 구글에서 지원하는 공식 라이브러리가 아니었기 때문에 꾸준히 커밋기록이 있는 걸로 선택했다.

구현해보면서 구글맵에서 객체가 정말 잘 나뉘어 있다는걸 느꼈고 객체지향 설계의 이점을 느꼈다.

### 이슈 사항

#### (1) 주변 랜덤 식당 표시

구글맵에서 장소를 가져오기 위해 PlacesService라는 객체를 사용했다.

여기엔 nearbySearch라는 메소드가 있는데 이 api는 한번에 20개의 결과만 처리했기 때문에 페이지네이션 기능을 제공했다.

문제는 페이지네이션을 이용해서 주변 상점을 모두 받아오는데 시간이 너무 오래걸렸다.

여기서 두가지의 해결책을 떠올렸다.

1. 페이지네이션을 이용해 페이지별로 랜덤식당 표시

   한 페이지를 받아와서 랜덤 식당 표시 -> 다음 주변 식당을 찾을때 다음 페이지에서 랜덤 식당 표시

2. 렌더링시 미리 주변 모든 식당 불러오기

나는 주변 식당을 모두 받아온 다음 랜덤 음식점을 뽑는 방향을 원했지만 구글맵 공식문서를 보고 다음 페이지 결과를 받기 위해선 2초를 기다려야 했기 때문에 1번으로 하기로 결정했다.

<img width="884" alt="image" src="https://github.com/TeTedo/practice_springboot/assets/107897812/5df20e84-0dcb-422a-a4a7-1791580f57f2">

하지만 파라미터에 page를 지정할 수 없었기 때문에 내가 원하는 페이지의 음식점을 뽑을 수 없었고 검색 결과도 최대 60개까지밖에 제공하지 않았다.

여기서 어떻게 해결해야할지 한참을 고민했다.

그러다가 한가지 추가 해결책을 떠올렸다.

바로 음식점을 뽑는게 아니라 내가 이동하는 방법이었다.

내가 설정한 주변중 랜덤의 한점으로 이동 -> 가장 가까운 음식점 선택 -> 만약 음식점이 내가 설정한 주변의 범위에 넘어갈 경우 반복

구글맵에서 검색조건에 거리순으로 검색하는게 가능하다는 것을 보고 떠올렸다.

근데 이러면 또 문제가 있었다.

랜덤으로 한점 이동 후 가장 가까운 음식점이 내가 설정한 범위 밖에 있다면 루프를 돈다.

이때 내가 설정한 범위내에 음식점이 없고 설정한 범위 밖에 음식점이 있는경우 무한루프를 돌게 된다.

그래서 한번더 생각을 해보면서 해결책을 보완했다.

처음에 내가 설정한 범위내에 음식점이 있는지 확인한다.

만약 범위내에 음식점이 없다면 주변에 음식점이 없다는 alert를 띄운다.

종합해보면 음식점이 있는 경우 아래 2가지 케이스가 나오게 된다.

**(1) 리스트가 20개 이하인 경우**

20개를 캐싱해놓고 랜덤으로 뽑아 쓴다.

**(2) 20개 이상인 경우**

내가 랜덤의 한점으로 이동해 가장 가까운 음식점을 찾은 후 그 음식점이 범위내에 있는지 확인

위 방법이 내가 생각한 최종의 최종의 최종 방법이었고 이렇게 구현했다.

랜덤 장소로 이동할때 그 장소의 위도,경도를 구해야 했다.

처음에는 원의방정식으로 아래와 같이 풀었지만

```js
function generateRandomPoint() {
  const x1 = center.lng;
  const y1 = center.lat;

  // x의 변화값 = random r * (1 or -1)
  const randR = Math.floor(Math.random() * radius);
  const signX = Math.random() > 0.5 ? 1 : -1;
  const dx = randR * signX;
  const x = x1 + dx;

  // 원의 방정식으로 (x - x1)^2 + (y - y1)^2 <= range^2
  const range = radius ** 2 - (x - x1) ** 2;

  const signY = Math.random() > 0.5 ? 1 : -1;
  const y = Math.sqrt(range) * signY + y1;

  return new google.maps.LatLng(y, x);
}
```

위도 경도는 거리가 아니라는 점을 생각하지 못했고 결국 gpt한테 풀어달라고 했다.

```js
function generateRandomPoint() {
  const y0 = center.lat;
  const x0 = center.lng;
  const rd = radius / 111300; // about 111300 meters in one degree

  const u = Math.random();
  const v = Math.random();

  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  const newlat = y + y0;
  const newlon = x + x0;

  return new google.maps.LatLng(newlat, newlon);
}
```

이 랜덤으로 생성한 점과 가장 가까운 음식점과의 거리가 처음 설정한 범위내에 있어야 하기 때문에 google에서 제공하는 거리계산을 썼다.

```ts
function isWithinRadius(placeLocation: google.maps.places.PlaceResult) {
  if (placeLocation.geometry?.location === undefined) return false;

  const location = {
    lat: placeLocation.geometry.location.lat(),
    lng: placeLocation.geometry.location.lng(),
  };

  return (
    google.maps.geometry.spherical.computeDistanceBetween(location, center) <=
    radius
  );
}
```

핵심 로직은 아래와 같다.

**(1) performSearch - 음식점 찾기 버튼클릭시**

```ts
const performSearch = (
  mapService: google.maps.places.PlacesService,
  isFirstSearch: boolean
) => {
  if (noNearPlace) {
    alert("There is no restaurant near by marker.");
    return;
  }

  if (cachePlaces[0]) {
    pickPlaceByCache(cachePlaces, mapService);
    return;
  }

  if (isFirstSearch) firstSearch(mapService);
  else randSearch(mapService);
};
```

**(2) 첫번째 검색시**

```ts
const firstSearch = (mapService: google.maps.places.PlacesService) => {
  const request = {
    location: center,
    type: "restaurant",
    openNow,
    radius,
  };

  mapService.nearbySearch(
    request,
    (
      results: google.maps.places.PlaceResult[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        alert("Failed to load random place.");
        return;
      }

      if (results === null) {
        alert("There is no restaurant near by marker.");
        setNoNearPlace(true);
        return;
      }

      const operationalPlaces = results.filter(
        (store) => store.business_status === "OPERATIONAL"
      );

      if (operationalPlaces.length === 0) {
        alert("There is no restaurant near by marker.");
        setNoNearPlace(true);
        return;
      }

      if (results.length < 20) {
        setCachePlaces(operationalPlaces);
        pickPlaceByCache(operationalPlaces, mapService);
      } else {
        performSearch(mapService, false);
      }
    }
  );
};
```

**(3) 랜덤 검색시**

```ts
const randSearch = (placesService: google.maps.places.PlacesService) => {
  const request = {
    location: MapUtils.generateRandomPoint(center.lat, center.lng, radius),
    type: "restaurant",
    openNow,
    rankBy: google.maps.places.RankBy.DISTANCE,
  };

  placesService.nearbySearch(
    request,
    (
      results: google.maps.places.PlaceResult[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        alert("Failed to load random place.");
        return;
      }

      if (results === null) {
        alert("There is no restaurant near by marker.");
        setNoNearPlace(true);
        return;
      }

      const findOne = results.find(
        (store) =>
          store.business_status === "OPERATIONAL" && isWithinRadius(store)
      );

      if (findOne) {
        setNewMarker(findOne);
        setPickedPlace(findOne);
      } else {
        randSearch(placesService);
        return;
      }
    }
  );
};
```

첫번째 검색과 랜덤 검색을 보면 겹치는 부분이 있는데 기능 구현 후 리팩토링 예정이다.

#### (2) 마커 겹침

지도에 표시되는 마커를 useState로 관리 했기 떄문에 랜덤 음식점을 뽑는 버튼을 빠르게 클릭하면 여러개의 마커가 생기는 이슈가 있었다.

처음엔 debounce를 설정해서 0.5초의 간격을 주고 버튼을 클릭할 수 있게 했지만 가끔식 마커가 여러개 생성되었다.

state 값이 바뀔때 이전 state값을 이용해 로직을 작성할 수 없을까 생각하다가 useEffect의 return을 이용해서 언마운트 될때 맵에서 제거하는 방법으로 해결했다.

```js
useEffect(() => {
  return () => {
    if (randMarker) {
      randMarker.setMap(null);
    }
  };
}, [randMarker]);
```

## 후기

사실 백엔드나 db쪽을 다뤄보고 싶어서 사이드 프로젝트를 시작했지만 막상 해보니 굳이 백엔드가 없어도 될거 같은데 일부러 넣어야 할까라는 생각을 정말 많이 했다.

자체 홈페이지 리뷰나 별점, 로그인 기능 등등 넣을려면 넣을 수 있었겠지만 이 간단한 홈페이지에서 기능이 많은건 오히려 역효과가 날 수 있을거라고 생각했다.

기능들은 추후 트래픽이 많아진다면 다시한번 고려해봐야 할 것 같다.

백엔드를 못해본건 아쉽지만 오랜만에 재밌는 고민들을 해서 만족했다.

타입스크립트도 처음 써봐서 아직 잘 적응이 안되지만 다음엔 게시판 형식의 프로젝트를 기획해서 프론트, 백 둘다 tdd로 해보려고 한다.

## 참고

[js 구글맵 공식문서](https://developers.google.com/maps/documentation/javascript?hl=ko)
