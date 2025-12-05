import axios from "axios";
import { BASE_URL } from "../common.ts";
// const BASE_URL = process.env.BASE_URL;

export async function getPrivacyPolicy() {
  const requestUrl = `${BASE_URL}/privacy-policy`;
  try {
    // console.log("requestUrl", requestUrl);
    const response = await axios.get(requestUrl);
    // console.log("getMyDetails api response", rponse);
    return response.data;
  } catch (err) {}
}
export async function getRefundPolicy() {
  const requestUrl = `${BASE_URL}/refund-policy`;
  try {
    // console.log("requestUrl", requestUrl);
    const response = await axios.get(requestUrl);
    // console.log("getMyDetails api response", rponse);
    return response.data;
  } catch (err) {}
}
export async function getTerms() {
  const requestUrl = `${BASE_URL}/terms`;
  try {
    // console.log("requestUrl", requestUrl);
    const response = await axios.get(requestUrl);
    // console.log("getMyDetails api response", rponse);
    return response.data;
  } catch (err) {}
}
export async function getFooter() {
  const requestUrl = `${BASE_URL}/footer`;
  try {
    // console.log("requestUrl", requestUrl);
    const response = await axios.get(requestUrl);
    // console.log("getMyDetails api response", rponse);
    return response.data;
  } catch (err) {}
}
export async function getAbout() {
  const requestUrl = `${BASE_URL}/about`;
  try {
    // console.log("requestUrl", requestUrl);
    const response = await axios.get(requestUrl);
    // console.log("getMyDetails api response", rponse);
    return response.data;
  } catch (err) {}
}
export async function getHomepageBanner() {
  const requestUrl = `${BASE_URL}/homepagebanner`;
  try {
    // console.log("requestUrl", requestUrl);
    const response = await axios.get(requestUrl);
    // console.log("getMyDetails api response", rponse);
    return response.data.data.images || [];
  } catch (err) {}
}
export async function getMyDetails(accessToken) {
  const requestUrl = `${BASE_URL}/my/details`;
  try {
    // console.log("requestUrl", requestUrl);
    const response = await axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // console.log("getMyDetails api response", rponse);
    return response.data;
  } catch (err) {}
}
export async function getScuba() {
  const requestUrl = `${BASE_URL}/scuba`;
  try {
    // console.log("requestUrl", requestUrl);
    const response = await axios.get(requestUrl);
    // console.log("api response", response.data);
    return response.data;
  } catch (err) {}
}
export async function getDetail(sku) {
  const requestUrl = `${BASE_URL}/sku/details/${sku}`;
  try {
    // console.log("requestUrl", requestUrl);
    const response = await axios.get(requestUrl);
    // console.log("api response", response.data);
    return response.data;
  } catch (err) {}
}
export async function postQuote(body, accessToken) {
  // console.log("body", body);

  const requestUrl = `${BASE_URL}/enquiries/request?type=quote`;
  try {
    const response = axios.post(requestUrl, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (err) {}
}

export const loginWithGoogle = async (idToken) => {
  try {
    const requestUrl = `${BASE_URL}/auth/google-login`;
    const response = await axios.post(
      requestUrl,
      {},
      {
        headers: {
          Authorization: `G-Bearer ${idToken}`, // 👈 send as Bearer token
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Google login API error:", err);
    throw err;
  }
};

export const updatePhoneNumber = async ({ phoneNo, token }) => {
  try {
    // console.log("data", data);

    let requestUrl = `${BASE_URL}/auth/update-phone`;
    // data: { email, phone }
    const response = await axios.post(
      requestUrl,
      { phoneNo },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {}
};

export const getallENQ = async (queryString = "", accessToken) => {
  //  const requestUrl = `${BASE_URL}/my/details`;
  try {
    const requestUrl = `${BASE_URL}/all/enquiries${queryString}`;
    // console.log("requestUrl", requestUrl);
    const response = await axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // console.log("getMyDetails api response", rponse);
    return response.data;
  } catch {}
  // console.log("res in api", res);
};
export const getallENQAdmin = async (queryString = "", accessToken) => {
  //  const requestUrl = `${BASE_URL}/my/details`;
  try {
    const requestUrl = `${BASE_URL}/all/enquiries/admin${queryString}`;
    // console.log("requestUrl", requestUrl);
    const response = await axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // console.log("getMyDetails api response", rponse);
    return response.data;
  } catch {}
  // console.log("res in api", res);
};
export const updateEnquiry = async (enqId, updates, accessToken) => {
  let requestUrl = `${BASE_URL}/enquiries/update/${enqId}`;
  const res = await axios.post(requestUrl, updates, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
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
