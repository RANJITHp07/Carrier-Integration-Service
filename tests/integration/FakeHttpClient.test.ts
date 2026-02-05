import { HttpClient } from "../../src/infra/http/HttpClient";
import { HttpRequest } from "../../src/infra/http/HttpRequest";

export class FakeHttpClient implements HttpClient {
  requests: HttpRequest[] = [];
  private responses: unknown[] = [];
  private errors: Error[] = [];

  enqueueResponse<T>(response: T) {
    this.responses.push(response);
  }

  enqueueError(error: Error) {
    this.errors.push(error);
  }

  async post<T>(req: HttpRequest): Promise<T> {
    this.requests.push(req);

    if (this.responses.length > 0) {
      return this.responses.shift() as T;
    }

    if (this.errors.length > 0) {
      throw this.errors.shift();
    }

    throw new Error("No queued response or error");
  }
}
