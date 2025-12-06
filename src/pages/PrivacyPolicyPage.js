// src/pages/PrivacyPolicyPage.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PolicyLayout from "../components/PolicyLayout";
import { getPrivacyPolicy } from "../services/api";
import { Spin } from "antd";


const PrivacyPolicyPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["privacyPolicy"],
    queryFn: getPrivacyPolicy,
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
        Failed to load Privacy Policy.
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

export default PrivacyPolicyPage;
