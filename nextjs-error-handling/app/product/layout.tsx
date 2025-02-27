export enum ProductErrorType {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  PRODUCT_ERROR = "PRODUCT_ERROR",
}

export class ProductError extends Error {
  readonly errorId = "ProductError"; // 식별자 추가

  constructor(type: ProductErrorType, cause: string) {
    super(type);
    this.cause = cause;
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
