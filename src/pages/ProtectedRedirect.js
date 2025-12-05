import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Empty, message, Row, Spin } from "antd";
import { getallENQ } from "../services/api.js";
import { BASE_URL } from "../common.ts";

import Cookies from "js-cookie";
function ProtectedRedirect() {
  const { kind, enqNo } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const accessToken = Cookies.get("token");
  const navigate = useNavigate();
  const location = useLocation();
  // const BASE_URL = process.env.BASE_URL;
  useEffect(() => {
    if (!accessToken) {
      const redirectTo = encodeURIComponent(
        location.pathname + location.search
      );
      navigate(`/?auth=signin&redirect=${redirectTo}`);
    }
  }, [accessToken, location.pathname, location.search, navigate]);
  const {
    data: enquiryDetail,
    isLoading,
    onError,
  } = useQuery({
    queryKey: ["myEnquiryDetails", enqNo],
    enabled: !!enqNo && !!accessToken,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await getallENQ(`?id=${enqNo}`, accessToken);
      return res?.enquiries?.[0];
    },
  });

  useEffect(() => {
    if (isLoading) return;
    if (!enquiryDetail) {
      messageApi.error("Enquiry not found or link is invalid.");
      return;
    }

    let rawLink = null;

    if (kind === "invoice" || kind === "quote") {
      rawLink = enquiryDetail.billingLink;
    } else if (kind === "refund-receipt") {
      rawLink = enquiryDetail.refundReceiptLink;
    } else if (kind === "pay") {
      rawLink = enquiryDetail.paymentLink;
    } else {
      messageApi.error("Invalid document type.");
      return;
    }

    if (!rawLink) {
      messageApi.error("link is not available yet. Please try again later.");
      return;
    }

    const backendBaseUrl = BASE_URL.replace(/\/$/, "");
    let finalLink = rawLink;

    try {
      const url = new URL(rawLink);
      const pathAndSearch = url.pathname + url.search + url.hash;
      finalLink = backendBaseUrl + pathAndSearch;
    } catch {
      if (rawLink.startsWith("http")) {
        finalLink = rawLink;
      } else {
        finalLink = backendBaseUrl + "/" + rawLink.replace(/^\//, "");
      }
    }
    console.log("finalLink", `${finalLink}?token=${accessToken}`);

    window.location.href = `${finalLink}?token=${accessToken}`;
  }, [isLoading, enquiryDetail, kind, messageApi, accessToken]);

  return (
    <>
      {contextHolder}
      <div style={{ height: "90vh", margin: "0" }}>
        <Row
          justify="center"
          align="middle"
          style={{
            padding: 16,
          }}
        >
          {isLoading && <Spin></Spin>}
          {onError && <Empty />}
        </Row>
      </div>
    </>
  );
}

export default ProtectedRedirect;
