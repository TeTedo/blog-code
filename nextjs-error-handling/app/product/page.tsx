"use client";

import { ProductError, ProductErrorType } from "./layout";

export default function Page() {
  throw new ProductError(ProductErrorType.PRODUCT_ERROR, "원인이야~");
}
