import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { describe, expect, it } from "vitest";
import { DEVICE_ID_HEADER } from "@repo/dto";
import { createApiClient, isApiError } from "../src/client.js";

function respondWith(
  client: ReturnType<typeof createApiClient>,
  handler: (config: InternalAxiosRequestConfig) => unknown,
) {
  client.http.defaults.adapter = async (config) => {
    const result = handler(config);
    if (result instanceof Error) {
      throw result;
    }
    return {
      data: result,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
}

describe("createApiClient", () => {
  it("rejects a base url that is not absolute", () => {
    expect(() => createApiClient({ baseUrl: "/v1" })).toThrow(
      "baseUrl must be an absolute URL",
    );
  });

  it("builds media urls from the origin and keeps absolute urls", () => {
    const { mediaUrl } = createApiClient({ baseUrl: "http://host:3000/v1/" });
    expect(mediaUrl("/uploads/a.jpg")).toBe("http://host:3000/uploads/a.jpg");
    expect(mediaUrl("https://cdn.test/a.jpg")).toBe("https://cdn.test/a.jpg");
  });

  it("adds the bearer token and device id headers", async () => {
    const client = createApiClient({
      baseUrl: "http://host/v1",
      getToken: () => "token-1",
      getDeviceId: async () => "device-1",
    });
    let seen: InternalAxiosRequestConfig | undefined;
    respondWith(client, (config) => {
      seen = config;
      return {};
    });
    await client.http.get("ping");
    expect(seen?.headers.get("Authorization")).toBe("Bearer token-1");
    expect(seen?.headers.get(DEVICE_ID_HEADER)).toBe("device-1");
  });

  it("omits the authorization header without a token", async () => {
    const client = createApiClient({
      baseUrl: "http://host/v1",
      getToken: () => null,
    });
    let seen: InternalAxiosRequestConfig | undefined;
    respondWith(client, (config) => {
      seen = config;
      return {};
    });
    await client.http.get("ping");
    expect(seen?.headers.has("Authorization")).toBe(false);
  });

  it("turns http failures into ApiError with status and message", async () => {
    const client = createApiClient({ baseUrl: "http://host/v1" });
    respondWith(client, (config) => {
      return new AxiosError("failed", "ERR_BAD_REQUEST", config, null, {
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config,
        data: { message: "Token expired", details: ["a"] },
      });
    });
    const error = await client.http
      .get("me")
      .catch((caught: unknown) => caught);
    expect(isApiError(error)).toBe(true);
    expect(error).toMatchObject({
      status: 401,
      message: "Token expired",
      details: ["a"],
    });
  });

  it("reports status 0 when there is no response", async () => {
    const client = createApiClient({ baseUrl: "http://host/v1" });
    respondWith(client, (config) => {
      return new AxiosError("Network Error", "ERR_NETWORK", config);
    });
    const error = await client.http
      .get("me")
      .catch((caught: unknown) => caught);
    expect(error).toMatchObject({ status: 0, message: "Network Error" });
  });
});
