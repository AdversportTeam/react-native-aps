export class AdError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
    this.name = 'AdError';
  }

  static fromNativeError(error: any): AdError {
    const { code, message } = error.userInfo;
    return new AdError(code, message);
  }
}

export function isAdError(error: unknown): error is AdError {
  return !!error && (error as Error).name === 'AdError';
}
