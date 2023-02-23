export class Token {
  private accessToken: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
  get() {
    return this.accessToken;
  }
}
