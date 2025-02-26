"use client";

/**
 * 모든 커스텀 에러의 기본 클래스
 */
export class BaseError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly cause?: string;
  readonly metadata?: Record<string, unknown>;

  constructor(
    code: string,
    message: string,
    statusCode: number = 500,
    cause?: string,
    metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.cause = cause;
    this.metadata = metadata;

    // 프로토타입 체인 보존
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  /**
   * 에러 정보를 객체로 반환
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      cause: this.cause,
      metadata: this.metadata,
    };
  }
}
