"use client"; // Error boundaries must be Client Components

import { ProductError, ProductErrorType } from "./layout";

export default function Error({
  error,
  reset,
}: {
  error: ProductError & { digest?: string };
  reset: () => void;
}) {
  if (!(error instanceof ProductError)) {
    throw error;
  }
  return (
    <>
      {error.type === ProductErrorType.PRODUCT_ERROR && (
        <div>
          <h2>다른에러는 안보임</h2>
          <button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </button>
        </div>
      )}
    </>
  );
}
