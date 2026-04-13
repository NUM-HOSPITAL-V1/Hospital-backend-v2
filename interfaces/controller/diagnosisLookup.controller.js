import {
  getDiagnosisLookupHealth,
  lookupDiagnosisByCode,
  searchDiagnosisSuggestions,
} from "../../infrastructure/clients/icd10SuggestClient.js";

const MIN_QUERY_LENGTH = 2;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 20;

const sanitizeLimit = (value) => {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsed, MAX_LIMIT);
};

const normalizeDiagnosisItem = (item = {}) => ({
  id: item.id || item.code || "",
  code: item.code || "",
  name: item.name || "",
  detail: item.detail || "",
  chapterCode: item.chapterCode || "",
  chapterName: item.chapterName || "",
  categoryCode: item.categoryCode || "",
  categoryName: item.categoryName || "",
  score: item.score ?? null,
  source: item.source || "icd10",
});

export const searchDiagnosisLookup = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();
    const limit = sanitizeLimit(req.query.limit);

    if (query.length < MIN_QUERY_LENGTH) {
      return res.status(200).json({
        success: true,
        data: [],
        meta: {
          query,
          limit,
          count: 0,
        },
      });
    }

    const response = await searchDiagnosisSuggestions({
      q: query,
      limit,
    });

    const results = Array.isArray(response?.data)
      ? response.data.map(normalizeDiagnosisItem)
      : [];

    return res.status(200).json({
      success: response?.success !== false,
      data: results,
      meta: response?.meta || {
        query,
        limit,
        count: results.length,
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getDiagnosisByCodeLookup = async (req, res) => {
  try {
    const code = String(req.params.code || "").trim();

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Diagnosis code is required",
        errors: [{ field: "code", reason: "Diagnosis code is required" }],
      });
    }

    const response = await lookupDiagnosisByCode(code);

    return res.status(200).json({
      success: response?.success !== false,
      data: normalizeDiagnosisItem(response?.data || {}),
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getDiagnosisLookupStatus = async (req, res) => {
  try {
    const response = await getDiagnosisLookupHealth();

    return res.status(200).json({
      success: response?.success !== false,
      data: response?.data || "ICD-10 lookup service is running",
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const handleError = (res, error) => {
  const status = error.statusCode || 500;
  const message = error.message || "Diagnosis lookup request failed";

  return res.status(status).json({
    success: false,
    message,
    errors: Array.isArray(error.details) ? error.details : [],
  });
};
