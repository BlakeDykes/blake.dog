export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public data: unknown;

  constructor({
    message,
    status,
    statusText,
    data,
  }: {
    message: string;
    status: number;
    statusText: string;
    data: unknown;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }

  static async fromResponse(response: Response) {
    let data: unknown = null;

    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : `Request failed with status ${response.status}`;

    return new ApiError({
      message,
      status: response.status,
      statusText: response.statusText,
      data,
    });
  }
}

export class ApiParseError extends Error {
  status: number;
  path: string;

  constructor({
    message,
    status,
    path,
  }: {
    message: string;
    status: number;
    path: string;
  }) {
    super(message);
    this.name = "ApiParseError";
    this.status = status;
    this.path = path;
  }
}

export const getApiErrorStatus = (error : unknown) => {
  if(!(error instanceof ApiError)) return undefined;
  return error.status;
}

export const isUnauthorizedError = (error: unknown) => {
  return getApiErrorStatus(error) === 401;
}