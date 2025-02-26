"use client";

import { ProductError } from "./product-error";

export default function Page() {
  const throwError = () => {
    throw new ProductError(
      "에러다 이놈아",
      "이름은 ProductError",
      "이것이 원인이다"
    );
  };
  return (
    <div onClick={throwError}>
      <div>에러 버튼 확인용</div>
    </div>
  );
}
