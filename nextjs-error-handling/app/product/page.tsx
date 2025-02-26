"use client";

export class ProductError extends Error {
  constructor(message: string, name: string, cause: string) {
    super(message);
    this.name = name;
    this.cause = cause;
  }
}

export default function Page() {
  throw new ProductError(
    "에러다 이놈아",
    "이름은 ProductError",
    "이것이 원인이다"
  );
}
