import axios from "axios";
import { BASE_URL } from "../common.ts";

export async function getScuba() {
  const requestUrl = `${BASE_URL}/scuba`;
  try {
    console.log("requestUrl", requestUrl);
    const response = await axios.get(requestUrl);
    console.log("api response", response.data);
    return response.data;
  } catch (err) {}
}
export async function getDetail(sku) {
  const requestUrl = `${BASE_URL}/sku/details/${sku}`;
  try {
    console.log("requestUrl", requestUrl);
    const response = await axios.get(requestUrl);
    console.log("api response", response.data);
    return response.data;
  } catch (err) {}
}
export async function postQuote(body) {
  console.log("body", body);

  const requestUrl = `${BASE_URL}/enquiries/request?type=quote`;
  try {
    const response = axios.post(requestUrl, body);
    return response;
  } catch (err) {}
}
export async function postReserve(body) {
  console.log("body", body);

  const requestUrl = `${BASE_URL}/enquiries/request?type=reserve`;
  try {
    const response = axios.post(requestUrl, body);
    return response;
  } catch (err) {}
}
export const loginWithGoogle = async (userData) => {
  try {
    let requestUrl = `${BASE_URL}/auth/google-login`;
    // userData: { email, firstName, lastName, photoURL }
    const response = await axios.post(requestUrl, userData);
    return response.data;
  } catch (err) {}
};

export const updatePhoneNumber = async (data) => {
  try {
    console.log("data", data);

    let requestUrl = `${BASE_URL}/auth/update-phone`;
    // data: { email, phone }
    const response = await axios.post(requestUrl, data);
    return response.data;
  } catch (err) {}
};

export const getallENQ = async (queryString = "") => {
  const res = await axios.get(`${BASE_URL}/all/enquiries${queryString}`);
  console.log("res in api", res);
  return res.data;
};
export const updateEnquiry = async (enqId, updates) => {
  let requestUrl = `${BASE_URL}/enquiries/update/${enqId}`;
  const res = await axios.post(requestUrl,updates);
  return res.data;
};

export async function getInvites(wandererId) {
  const requestUrl = `${BASE_URL}/wander/inivitation?wandererId=${wandererId}`;
  try {
    const options = {
      method: "GET",
    };
    const response = await fetch(requestUrl, options);
    return response;
  } catch (err) {}
}
export async function getActiveWander(wandererId) {
  const requestUrl = `${BASE_URL}/active/wander?wandererId=${wandererId}`;
  try {
    const options = {
      method: "GET",
    };
    const response = await fetch(requestUrl, options);
    return response;
  } catch (err) {}
}
export async function apiAcceptInvite(wandererId, body) {
  const requestUrl = `${BASE_URL}/accept/wander/inivitation?wanderer_id=${wandererId}`;
  try {
    const response = axios.put(requestUrl, body);
    return response;
  } catch (err) {}
}

export async function getWander(wanderId) {
  const requestUrl = `${BASE_URL}/wander?wanderId=${wanderId}`;
  try {
    const options = {
      method: "GET",
    };
    const response = await fetch(requestUrl, options);
    return response;
  } catch (err) {}
}

export async function addExpenses(wanderId, payload) {
  const requestUrl = `${BASE_URL}/add/expense?wander_id=${wanderId}`;
  try {
    const response = axios.post(requestUrl, payload);
    return response;
  } catch (err) {}
}
export async function deleteExpenses(wanderId, expId) {
  const requestUrl = `${BASE_URL}/delete/expense?wander_id=${wanderId}&exp_id=${expId}`;
  try {
    const response = axios.delete(requestUrl);
    return response;
  } catch (err) {}
}
export async function completeWander(wander, wanderId) {
  const requestUrl = `${BASE_URL}/complete/wander?wander_id=${wanderId}`;
  try {
    const response = axios.post(requestUrl, wander);
    return response;
  } catch (err) {}
}
export async function deleteWander(wander, wanderId) {
  const requestUrl = `${BASE_URL}/delete/wander?wander_id=${wanderId}`;
  try {
    const response = axios.post(requestUrl, wander);
    return response;
  } catch (err) {}
}
export async function getALLWander(wandererId) {
  const requestUrl = `${BASE_URL}/all/wander?wandererId=${wandererId}`;
  try {
    const options = {
      method: "GET",
    };
    const response = await fetch(requestUrl, options);
    return response;
  } catch (err) {}
}
