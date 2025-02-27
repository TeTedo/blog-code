export enum ProductErrorType {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  PRODUCT_ERROR = "PRODUCT_ERROR",
}

const ProductErrorMessages: Record<ProductErrorType, string> = {
  [ProductErrorType.VALIDATION_ERROR]: "유효성 검사 오류가 발생했습니다",
  [ProductErrorType.NOT_FOUND_ERROR]: "요청한 리소스를 찾을 수 없습니다",
  [ProductErrorType.SERVER_ERROR]: "서버 오류가 발생했습니다",
  [ProductErrorType.PRODUCT_ERROR]: "프로덕트 에러가 발생했습니다",
};

export class ProductError extends Error {
  type: ProductErrorType;
  cause: string;

  constructor(type: ProductErrorType, cause: string) {
    super(ProductErrorMessages[type]);
    this.type = type;
    this.cause = cause;
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
