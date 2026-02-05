import { UpsOAuthClient } from "../../../src/infra/carrier/ups/auth/UpsOAuthClient";
import { FakeHttpClient } from "../FakeHttpClient.test";

it("acquires, reuses, and refreshes OAuth token on expiry", async () => {
  const http = new FakeHttpClient();

  http.enqueueResponse({
    access_token: "token-1",
    expires_in: 1,
  });

  http.enqueueResponse({
    access_token: "token-2",
    expires_in: 3600,
  });

  const oauth = new UpsOAuthClient(http, "token-url", "id", "secret");

  const t1 = await oauth.getAccessToken();

  await new Promise((r) => setTimeout(r, 1100));

  const t2 = await oauth.getAccessToken();

  expect(t1).toBe("token-1");
  expect(t2).toBe("token-2");
});
