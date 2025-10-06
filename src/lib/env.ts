const DEFAULT_API_BASE_URL = "http://localhost:8080";
const DEFAULT_PRODUCER_ID = process.env.NEXT_PUBLIC_PRODUCER_ID ?? "cryptotrade";

const SERVER_API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/$/, "");

export function getApiBaseUrl() {
  if (typeof window === "undefined") {
    return SERVER_API_BASE_URL;
  }

  return "";
}

export function getMockMode() {
  return process.env.NEXT_PUBLIC_USE_API_MOCKS === "true";
}

export function getDefaultProducerId() {
  return DEFAULT_PRODUCER_ID;
}
