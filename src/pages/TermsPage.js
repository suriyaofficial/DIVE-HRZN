// src/pages/TermsPage.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PolicyLayout from "../components/PolicyLayout";
import { getTerms } from "../services/api";
import { Spin } from "antd";

const TermsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["terms"],
    queryFn: getTerms,
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
        Failed to load Terms &amp; Conditions.
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

export default TermsPage;
