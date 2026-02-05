import { HttpClient } from "./HttpClient";
import { HttpRequest } from "./HttpRequest";
import { HttpError } from "./HttpError";

export class FetchHttpClient implements HttpClient {
  async post<T>(req: HttpRequest): Promise<T> {
    const res = await fetch(req.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(req.headers ?? {}),
      },
      body: JSON.stringify(req.body),
    });

    if (!res.ok) {
      throw new HttpError(res.status, res.statusText, await res.text());
    }

    return res.json() as Promise<T>;
  }
}
