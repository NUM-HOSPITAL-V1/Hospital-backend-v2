const CUSTOMER_REGISTRATION_BASE_URL = process.env.CUSTOMER_REGISTRATION_BASE_URL?.trim();

const jsonHeaders = {
  "Content-Type": "application/json",
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

const buildUrl = (path) => {
  return `${CUSTOMER_REGISTRATION_BASE_URL.replace(/\/$/, "")}${path}`;
};

export const isCustomerRegistrationEnabled = () => Boolean(CUSTOMER_REGISTRATION_BASE_URL);

export const createCustomerProfile = async (payload) => {
  if (!isCustomerRegistrationEnabled()) {
    return null;
  }

  const response = await fetch(buildUrl("/internal/customers/register-profile"), {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });

  const body = await parseJsonSafely(response);
  if (!response.ok) {
    const error = new Error(body?.message || body?.error || "Customer registration service failed");
    error.statusCode = response.status;
    throw error;
  }

  return body;
};

export const deleteCustomerProfile = async (customerId) => {
  if (!isCustomerRegistrationEnabled() || !customerId) {
    return;
  }

  const response = await fetch(buildUrl(`/internal/customers/${customerId}`), {
    method: "DELETE",
    headers: jsonHeaders,
  });

  if (!response.ok && response.status !== 404) {
    const body = await parseJsonSafely(response);
    const error = new Error(body?.message || body?.error || "Failed to rollback customer profile");
    error.statusCode = response.status;
    throw error;
  }
};
