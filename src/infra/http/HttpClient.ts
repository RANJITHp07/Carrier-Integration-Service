import { HttpRequest } from "./HttpRequest";

export interface HttpClient {
  post<T>(request: HttpRequest): Promise<T>;
}
