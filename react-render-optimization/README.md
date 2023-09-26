# React 최적화

React에서 렌더링을 최적화하는 방법은 여러가지가 있다.

그 중 대표적인 React.memo, useMemo, useCallback을 소개하려고 한다.

## React.memo

React.memo는 props가 변하지 않으면 리렌더링을 스킵한다.

memo로 감싼 컴포넌트는 메모이제이션으로 이전 props와 새로운 props를 비교하여 같은 값이라면 리렌더링을 하지 않고 기존 컴포넌트를 반환한다.

props를 비교하는 함수로는 >

## useMemo

## useCallback

## 참고

[리액트 공식문서](https://react.dev/reference/react)
