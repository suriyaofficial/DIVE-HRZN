import React, { useState, useEffect } from "react";
import { Row, Col, Card, Badge, Tag, Space, Button, Spin, message } from "antd";
import { CreditCardOutlined, LinkOutlined } from "@ant-design/icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getallENQ } from "../services/api";
import dayjs from "dayjs";
import Cookies from "js-cookie";

const STATUS_COLORS = {
  Created: "blue",
  Assigned: "geekblue",
  Discussed: "magenta",
  "Quote Sent": "orange",
  Invoiced: "purple",
  "Service Provided": "green",
  "Service Canceled": "red",
};

const PAYMENT_COLORS = {
  "Payment Pending": "orange",
  Paid: "green",
  "Refund Pending": "purple",
  "Refund Issued": "magenta",
  Null: "default",
  "": "default",
};

const tsToDate = (ts) => {
  if (!ts || !ts.seconds) return null;
  const ms = ts.seconds * 1000 + (ts.nanoseconds || 0) / 1e6;
  return new Date(ms);
};

export default function MyEnquiriesById() {
  const { enqNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = Cookies.get("token");

  const [messageApi, contextHolder] = message.useMessage();

  // 🔐 Redirect to sign-in if no access token
  useEffect(() => {
    if (!accessToken) {
      const redirectTo = encodeURIComponent(
        location.pathname + location.search
      );
      navigate(`/?auth=signin&redirect=${redirectTo}`);
    }
  }, [accessToken, location.pathname, location.search, navigate]);
  let ENQ_ID = enqNo;
  const { data, isLoading } = useQuery({
    queryKey: ["myEnquiryDetails", ENQ_ID],
    enabled: !!ENQ_ID && !!accessToken,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await getallENQ(`?id=${ENQ_ID}`, accessToken);
      return res?.enquiries?.[0];
    },
  });

  const enquiry = data;

  const createdAtDate = enquiry?.createdAt ? tsToDate(enquiry.createdAt) : null;
  const preferredDate = enquiry?.preferredDate
    ? tsToDate(enquiry.preferredDate)
    : null;

  const paymentStatus = enquiry?.paymentStatus || "Null";
  const paymentColor = PAYMENT_COLORS[paymentStatus] || "default";
  const statusColor = STATUS_COLORS[enquiry?.status || "Created"] || "default";

  const handleOpenLink = (link) => {
    if (!link) return;
    // 🚀 No more email in URL, just open the link
    // window.location.href = link;
    window.open(`${link}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {contextHolder}

      <Row justify="center" style={{ minHeight: "100vh", padding: 16 }}>
        {accessToken && (
          <Col xs={24} md={18} lg={14}>
            <Card
              style={{
                borderRadius: 16,
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
              }}
              title={<>Enquiry {enqNo}</>}
            >
              {isLoading && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <Spin />
                </div>
              )}

              {!isLoading && !enquiry && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  No enquiry details available.
                </div>
              )}

              {!isLoading && enquiry && (
                <Badge.Ribbon text={enquiry?.status} color={statusColor}>
                  <div style={{ marginTop: 16 }}>
                    <Space
                      direction="vertical"
                      size="middle"
                      style={{ width: "100%" }}
                    >
                      <Row gutter={12}>
                        <Col xs={24} sm={12} md={8}>
                          <div
                            style={{
                              fontSize: 12,
                              color: "rgba(0,0,0,0.45)",
                            }}
                          >
                            Enquiry No
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>
                            {enquiry.enqNo}
                          </div>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                          <div
                            style={{
                              fontSize: 12,
                              color: "rgba(0,0,0,0.45)",
                            }}
                          >
                            Title
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>
                            {enquiry.title}
                          </div>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                          <div
                            style={{
                              fontSize: 12,
                              color: "rgba(0,0,0,0.45)",
                            }}
                          >
                            SKU
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>
                            {enquiry.sku}
                          </div>
                        </Col>
                      </Row>

                      <Row gutter={12}>
                        <Col xs={8} sm={8} md={8}>
                          <div
                            style={{
                              fontSize: 12,
                              color: "rgba(0,0,0,0.45)",
                            }}
                          >
                            Created on
                          </div>
                          <div style={{ fontSize: 12 }}>
                            {createdAtDate
                              ? dayjs(createdAtDate).format("DD/MM/YYYY")
                              : "-"}
                          </div>
                        </Col>
                        <Col xs={8} sm={8} md={8}>
                          <div
                            style={{
                              fontSize: 12,
                              color: "rgba(0,0,0,0.45)",
                            }}
                          >
                            Preferred date
                          </div>
                          <div style={{ fontSize: 12 }}>
                            {preferredDate
                              ? dayjs(preferredDate).format("DD/MM/YYYY")
                              : "-"}
                          </div>
                        </Col>

                        <Col xs={8} sm={8} md={8}>
                          <div
                            style={{
                              fontSize: 12,
                              color: "rgba(0,0,0,0.45)",
                            }}
                          >
                            Group size
                          </div>
                          <div style={{ fontSize: 12 }}>
                            {enquiry.groupSize ?? "-"}
                          </div>
                        </Col>
                      </Row>

                      {enquiry.price && (
                        <>
                          <Row gutter={12}>
                            <Col xs={12} sm={12} md={8}>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "rgba(0,0,0,0.45)",
                                }}
                              >
                                Price
                              </div>
                              <Tag color={"green"}>{enquiry.price}</Tag>
                            </Col>

                            {paymentStatus !== "Null" && (
                              <Col xs={12} sm={12} md={8}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: "rgba(0,0,0,0.45)",
                                  }}
                                >
                                  Payment status
                                </div>
                                <Tag color={paymentColor}>{paymentStatus}</Tag>
                              </Col>
                            )}
                          </Row>

                          <Row gutter={12}>
                            <Col xs={12} sm={12} md={12}>
                              {paymentStatus === "Payment Pending" && (
                                <Button
                                  type="primary"
                                  icon={<CreditCardOutlined />}
                                  onClick={() =>
                                    handleOpenLink(enquiry?.paymentLink)
                                  }
                                >
                                  Pay
                                </Button>
                              )}
                            </Col>
                          </Row>
                        </>
                      )}

                      <Row gutter={12}>
                        <Col xs={12} sm={12} md={8}>
                          <div style={{ marginTop: 16 }}>
                            <Button
                              type="primary"
                              icon={<LinkOutlined />}
                              onClick={() =>
                                handleOpenLink(enquiry?.billingLink)
                              }
                              hidden={!enquiry.billingLink}
                            >
                              {enquiry?.status === "Invoiced" ||
                              enquiry?.status === "Service Provided" ||
                              enquiry?.status === "Service Canceled"
                                ? "View Invoice"
                                : "View Quote"}
                            </Button>
                          </div>
                        </Col>
                        <Col xs={12} sm={8} md={8}>
                          <div style={{ marginTop: 16 }}>
                            <Button
                              type="primary"
                              icon={<LinkOutlined />}
                              onClick={() =>
                                handleOpenLink(enquiry?.refundReceiptLink)
                              }
                              hidden={
                                enquiry?.paymentStatus !== "Refund Issued"
                              }
                            >
                              Refund Receipt
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Space>
                  </div>
                </Badge.Ribbon>
              )}
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
}
