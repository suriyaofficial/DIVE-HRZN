import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import {BASE_URL} from "../common.ts"

import { getallENQ } from "../services/api.js";
import EmailVerifyCard from "../components/EmailVerifyCard";

function DocViewPublic() {
  const { kind, enqNo } = useParams();
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  // const BASE_URL = process.env.BASE_URL;

  const enquiryMutation = useMutation({
    mutationFn: async ({ enqId, email }) => {
      const res = await getallENQ(`?id=${enqId}&email=${email}`);
      return res?.enquiries?.[0];
    },
    onSuccess: (enquiryDetail) => {
      if (!enquiryDetail) {
        messageApi.error("Enquiry not found. Please contact us.");
        return;
      }

      let rawLink = null;

      if (kind === "invoice" || kind === "quote") {
        rawLink = enquiryDetail.billingLink;
      } else if (kind === "refund-receipt") {
        rawLink = enquiryDetail.refundReceiptLink;
      }

      if (!rawLink) {
        messageApi.error(
          "Document link is not available yet. Please try again later."
        );
        return;
      }

      const backendBaseUrl = BASE_URL;
      let finalLink = rawLink;

      try {
        const url = new URL(rawLink);
        const pathAndSearch = url.pathname + url.search + url.hash;
        finalLink = backendBaseUrl.replace(/\/$/, "") + pathAndSearch;
      } catch {
        if (rawLink.startsWith("http")) {
          finalLink = rawLink;
        } else {
          finalLink =
            backendBaseUrl.replace(/\/$/, "") +
            "/" +
            rawLink.replace(/^\//, "");
        }
      }

      // Open in same tab
      window.location.href = finalLink;
    },
    onError: (err) => {
      const status = err?.response?.status || err?.status;

      if (status === 401) {
        messageApi.error("Authentication failed. Email does not match.");
      } else {
        messageApi.error("Something went wrong. Please try again.");
      }
    },
  });

  const handleContinue = (valuesOrEvent) => {
    // Using antd Form onFinish → will pass no event, we just use current state
    setError("");

    const typedEmail = emailInput.trim().toLowerCase();

    if (!typedEmail) {
      setError("Please enter your email.");
      return;
    }

    if (!enqNo) {
      setError("Invalid enquiry number.");
      return;
    }

    enquiryMutation.mutate({ enqId: enqNo, email: typedEmail });
  };

  return (
    <>
      {contextHolder}
      <EmailVerifyCard
        title="Verify your email"
        subtitle={undefined}
        email={emailInput}
        error={error}
        loading={enquiryMutation.isPending}
        onChangeEmail={setEmailInput}
        onSubmit={handleContinue}
      />
    </>
  );
}

export default DocViewPublic;
