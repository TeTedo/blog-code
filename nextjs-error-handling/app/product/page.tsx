"use client";

import { useState } from "react";
import { ProductError, ProductErrorType } from "./layout";

export default function Page() {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    throw error;
  }

  return (
    <div
      onClick={() =>
        setError(new ProductError(ProductErrorType.PRODUCT_ERROR, "원인이야~"))
      }
    >
      <div>gg</div>
    </div>
  );
}
