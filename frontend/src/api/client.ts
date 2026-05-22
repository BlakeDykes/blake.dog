import { ApiError, ApiParseError } from "./ApiError";
import type { ApiClientOptions, JsonBody } from "./types";

export const isJsonBody = (body: ApiClientOptions["body"]): body is JsonBody =>
  body !== undefined &&
  body !== null &&
  !(body instanceof FormData) &&
  !(body instanceof Blob) &&
  !(body instanceof ArrayBuffer) &&
  !(body instanceof URLSearchParams) &&
  !(typeof ReadableStream !== "undefined" && body instanceof ReadableStream);

export const parseResponseBody = async <T>(
  response: Response,
  path: string
): Promise<T> => {
  const text = await response.text();
  if (!text) {
    throw new ApiParseError({
      message: `Expected JSON response from ${path}, but response body is empty.`,
      status: response.status,
      path,
    });
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiParseError({
      message: `Expected JSON response from ${path}, but parsing failed.`,
      status: response.status,
      path,
    });
  }
};

export const buildRequestInit = (options: ApiClientOptions): RequestInit => {
  const { body, headers, ...rest } = options;

  const reqHeaders = new Headers(headers);
  let reqBody: BodyInit | null | undefined;

  if (isJsonBody(body)) {
    reqHeaders.set("Content-Type", "application/json");
    reqBody = JSON.stringify(body);
  } else {
    reqBody = body;
  }

  return {
    ...rest,
    headers: reqHeaders,
    body: reqBody,
    credentials: "include",
  };
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const apiFetch = async <T>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> => {
  const res = await fetch(`${API_BASE_URL}${path}`, buildRequestInit(options));

  if (!res.ok) {
    throw await ApiError.fromResponse(res);
  }

  if (res.status === 204) {
    throw new ApiParseError({
      message: `Expected JSON response from ${path}, but received 204 no Content`,
      status: res.status,
      path,
    });
  }

  return parseResponseBody<T>(res, path);
};
