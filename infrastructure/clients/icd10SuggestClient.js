const ICD10_SUGGEST_BASE_URL =
  process.env.ICD10_SUGGEST_BASE_URL || "http://localhost:8080/api";

const DEFAULT_TIMEOUT_MS = Number(process.env.ICD10_SUGGEST_TIMEOUT_MS || 5000);

const buildUrl = (path, queryParams = {}) => {
  const baseUrl = ICD10_SUGGEST_BASE_URL.endsWith("/")
    ? ICD10_SUGGEST_BASE_URL.slice(0, -1)
    : ICD10_SUGGEST_BASE_URL;

  const url = new URL(`${baseUrl}${path}`);

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
};

const fetchJson = async (path, queryParams = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(buildUrl(path, queryParams), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(
        payload?.message || payload?.error || "ICD-10 lookup request failed"
      );
      error.statusCode = response.status;
      error.details = payload?.errors || [];
      throw error;
    }

    return payload;
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("ICD-10 lookup request timed out");
      timeoutError.statusCode = 504;
      throw timeoutError;
    }

    if (error instanceof TypeError) {
      const networkError = new Error("ICD-10 lookup service is unavailable");
      networkError.statusCode = 502;
      throw networkError;
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const searchDiagnosisSuggestions = async ({ q, limit }) => {
  return fetchJson("/diagnosis/search", { q, limit });
};

export const lookupDiagnosisByCode = async (code) => {
  return fetchJson(`/diagnosis/code/${encodeURIComponent(code)}`);
};

export const getDiagnosisLookupHealth = async () => {
  return fetchJson("/diagnosis/health");
};
