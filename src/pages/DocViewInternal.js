import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Empty, message, Row, Spin } from "antd";
import { getallENQ } from "../services/api";

function DocViewInternal() {
  const { kind, enqNo, email } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const {
    data: enquiryDetail,
    isLoading,
    onError,
  } = useQuery({
    queryKey: ["myEnquiryDetails", enqNo, email],
    enabled: !!enqNo && !!email,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await getallENQ(`?id=${enqNo}&email=${email}`);
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
    } else {
      messageApi.error("Invalid document type.");
      return;
    }

    if (!rawLink) {
      messageApi.error(
        "Document link is not available yet. Please try again later."
      );
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

    window.location.href = finalLink;
  }, [isLoading, enquiryDetail, kind, messageApi]);

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

export default DocViewInternal;
