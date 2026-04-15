import { createError } from "../../utils/error.js";
import {
  deleteCustomerById,
  getCustomerById,
  isCustomerServiceEnabled,
  listCustomers,
  searchCustomers,
  updateCustomerById,
} from "../../infrastructure/clients/customerServiceClient.js";
import { syncPatientShadowByCustomerId } from "../../application/services/customerOwnership.service.js";

const buildAddress = (customer = {}) => {
  const parts = [
    customer.province,
    customer.district,
    customer.subdistrict,
    customer.addressDetail,
  ]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);

  return parts.join(", ");
};

const parseAddress = (address, fallback = {}) => {
  if (typeof address !== "string" || !address.trim()) {
    return {
      province: fallback.province || "UNSPECIFIED",
      district: fallback.district || "UNSPECIFIED",
      subdistrict: fallback.subdistrict || "UNSPECIFIED",
      addressDetail: fallback.addressDetail || "UNSPECIFIED",
    };
  }

  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    province: parts[0] || fallback.province || "UNSPECIFIED",
    district: parts[1] || fallback.district || "UNSPECIFIED",
    subdistrict: parts[2] || fallback.subdistrict || "UNSPECIFIED",
    addressDetail: parts.length > 3 ? parts.slice(3).join(", ") : address.trim(),
  };
};

const normalizeCustomer = (customer = {}) => ({
  id: customer.customerId || customer.customerid || "",
  customerId: customer.customerId || customer.customerid || "",
  userId: customer.userId || "",
  firstName: customer.firstName || "",
  surname: customer.surname || "",
  phoneNumber: customer.phoneNumber || "",
  email: customer.email || "",
  dateOfBirth: customer.dateOfBirth || "",
  age: customer.age || "",
  gender: customer.gender || "",
  profession: customer.profession || "",
  province: customer.province || "",
  district: customer.district || "",
  subdistrict: customer.subdistrict || "",
  addressDetail: customer.addressDetail || "",
  address: buildAddress(customer),
  sisiId: customer.sisiId || "",
  nationalId: customer.nationalId || "",
});

const ensureCustomerService = () => {
  if (!isCustomerServiceEnabled()) {
    throw createError("Customer service integration is disabled", 503);
  }
};

export const listCustomerProfiles = async (req, res) => {
  try {
    ensureCustomerService();

    const query = String(req.query.q || "").trim();
    let customers;

    if (query) {
      customers = await searchCustomers(query);
    } else {
      const summaries = await listCustomers();
      customers = await Promise.all(
        summaries.map(async (summary) => {
          const customerId = summary.customerId || summary.customerid;
          if (!customerId) {
            return summary;
          }

          try {
            return await getCustomerById(customerId);
          } catch {
            return summary;
          }
        })
      );
    }

    return res.status(200).json({
      success: true,
      count: customers.length,
      customers: customers.map(normalizeCustomer),
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: error.message || "Failed to fetch customer profiles",
    });
  }
};

export const getCustomerProfileById = async (req, res) => {
  try {
    ensureCustomerService();
    const customer = await getCustomerById(req.params.id);

    return res.status(200).json({
      success: true,
      customer: normalizeCustomer(customer),
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: error.message || "Failed to fetch customer profile",
    });
  }
};

export const updateCustomerProfileById = async (req, res) => {
  try {
    ensureCustomerService();

    const customerId = String(req.params.id || "").trim();
    if (!customerId) {
      throw createError("Customer ID is required", 400);
    }

    const currentCustomer = await getCustomerById(customerId);
    const addressParts = parseAddress(req.body.address, currentCustomer);

    const mergedPayload = {
      customerId,
      nationalId: req.body.nationalId ?? currentCustomer.nationalId ?? "",
      surname: req.body.surname ?? req.body.lastname ?? currentCustomer.surname ?? "",
      firstName: req.body.firstName ?? req.body.firstname ?? currentCustomer.firstName ?? "",
      dateOfBirth: req.body.dateOfBirth ?? req.body.birthDate ?? currentCustomer.dateOfBirth ?? "",
      age:
        req.body.age !== undefined && req.body.age !== null
          ? String(req.body.age)
          : currentCustomer.age ?? "",
      gender: req.body.gender ?? currentCustomer.gender ?? "OTHER",
      phoneNumber: req.body.phoneNumber ?? req.body.phone ?? currentCustomer.phoneNumber ?? "",
      email: req.body.email ?? currentCustomer.email ?? "",
      province: req.body.province ?? addressParts.province,
      district: req.body.district ?? addressParts.district,
      subdistrict: req.body.subdistrict ?? addressParts.subdistrict,
      addressDetail: req.body.addressDetail ?? addressParts.addressDetail,
      profession: req.body.profession ?? req.body.type ?? currentCustomer.profession ?? "EMPLOYEE",
      sisiId: req.body.sisiId ?? currentCustomer.sisiId ?? "",
      userId: req.body.userId ?? currentCustomer.userId ?? "",
    };

    await updateCustomerById(customerId, mergedPayload);
    const refreshedCustomer = await getCustomerById(customerId);
    await syncPatientShadowByCustomerId(refreshedCustomer);

    return res.status(200).json({
      success: true,
      message: "Customer updated",
      customer: normalizeCustomer(refreshedCustomer),
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: error.message || "Failed to update customer profile",
    });
  }
};

export const deleteCustomerProfileById = async (req, res) => {
  try {
    ensureCustomerService();
    await deleteCustomerById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Customer deleted",
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: error.message || "Failed to delete customer profile",
    });
  }
};
