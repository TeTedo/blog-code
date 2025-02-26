"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("에러 발생 - global", error);
    console.log("cause - global : ", error.cause);
    console.log("digest - global : ", error.digest);
    console.log("name - global : ", error.name);
  }, [error]);

  return (
    <html>
      <body>
        <div>
          <h2>글로발 도착완</h2>
          <div>{error.message || "예상치 못한 에러입니다."}</div>
          <button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
