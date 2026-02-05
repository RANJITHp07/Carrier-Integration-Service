import { HttpClient } from "../../src/infra/http/HttpClient";
import { HttpRequest } from "../../src/infra/http/HttpRequest";

export class FakeHttpClient implements HttpClient {
  requests: HttpRequest[] = [];
  private responses: any[] = [];
  private errors: any[] = [];

  enqueueResponse(response: any) {
    this.responses.push(response);
  }

  enqueueError(error: any) {
    this.errors.push(error);
  }

  async post<T>(req: HttpRequest): Promise<T> {
    this.requests.push(req);

    if (this.responses.length) {
      return this.responses.shift();
    }

    if (this.errors.length) {
      throw this.errors.shift();
    }

    throw new Error("No queued response or error");
  }
}
