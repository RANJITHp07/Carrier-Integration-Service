export class OAuthToken {
  private expiresAt: number;

  constructor(
    public readonly value: string,
    expiresInSeconds: number,
  ) {
    this.expiresAt = Date.now() + expiresInSeconds * 1000;
  }

  isExpired(): boolean {
    return Date.now() >= this.expiresAt - 30_000;
  }
}
