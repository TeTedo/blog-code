"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { ProductError } from "./product-error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("에러 발생", error);
    console.log("cause : ", error.cause);
    console.log("digest : ", error.digest);
    console.log("name : ", error.name);
  }, [error]);

  if (error instanceof ProductError) {
    throw error;
  }
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
