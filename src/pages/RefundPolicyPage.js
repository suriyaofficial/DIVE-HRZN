// src/pages/RefundPolicyPage.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PolicyLayout from "../components/PolicyLayout";
import { getRefundPolicy } from "../services/api";
import { Spin } from "antd";



const RefundPolicyPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["refundPolicy"],
    queryFn: getRefundPolicy,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Failed to load Refund Policy.
      </div>
    );
  }

 const { title, updatedAt, sections, signed, companyName, logoUrl } =
     data || {};
 
   return (
     <PolicyLayout
       title={title}
       updatedAt={updatedAt}
       sections={sections}
       signed={signed}
       companyName={companyName}
       logoUrl={logoUrl}
     />
   );
};

export default RefundPolicyPage;
