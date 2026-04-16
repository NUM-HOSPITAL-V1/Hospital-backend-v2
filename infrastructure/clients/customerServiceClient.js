import { createError } from "../../utils/error.js";

const CUSTOMER_REGISTRATION_BASE_URL = process.env.CUSTOMER_REGISTRATION_BASE_URL?.trim();

const buildUrl = (path) => {
  const baseUrl = CUSTOMER_REGISTRATION_BASE_URL?.replace(/\/$/, "");
  return `${baseUrl}${path}`;
};

const parseJsonSafely = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const requestJson = async (path, options = {}) => {
  if (!CUSTOMER_REGISTRATION_BASE_URL) {
    throw createError("Customer registration service is not configured", 503);
  }

  let response;
  try {
    response = await fetch(buildUrl(path), options);
  } catch {
    throw createError("Customer registration service is unavailable", 502);
  }

  const body = await parseJsonSafely(response);
  if (!response.ok) {
    const message = body?.message || body?.error || "Customer service request failed";
    throw createError(message, response.status);
  }

  return body;
};

export const isCustomerServiceEnabled = () => Boolean(CUSTOMER_REGISTRATION_BASE_URL);

// Vert.x JsonObject Spring/Jackson-аар serialize хийхэд {"map": {...}, "empty": false}
// формат болдог. Энэ функц тэр wrapper-ийг задлана.
const unwrap = (value) => (value && typeof value === "object" && "map" in value ? value.map : value);

export const listCustomers = async () => {
  const payload = await requestJson("/customer/registration/fetch", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const body = unwrap(payload);
  const inner = unwrap(body?.body);
  const list = inner?.list ?? body?.body;
  return Array.isArray(list) ? list.map(unwrap) : [];
};

export const getCustomerById = async (customerId) => {
  const result = await requestJson(`/customer/registration/fetch/${encodeURIComponent(customerId)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return unwrap(result);
};

export const searchCustomers = async (query) => {
  const payload = await requestJson("/customer/registration/search", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      Accept: "application/json",
    },
    body: query,
  });

  const body = unwrap(payload);
  const inner = unwrap(body?.body);
  const list = inner?.list ?? body?.body;
  return Array.isArray(list) ? list.map(unwrap) : [];
};

export const updateCustomerById = async (customerId, payload) => {
  return requestJson("/customer/registration/edit/customer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      customerId,
      ...payload,
    }),
  });
};

export const deleteCustomerById = async (customerId) => {
  return requestJson(`/customer/registration/delete/customer/${encodeURIComponent(customerId)}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });
};
