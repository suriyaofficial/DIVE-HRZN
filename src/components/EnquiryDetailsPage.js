// src/pages/EnquiryDetailsPage.jsx
import React from "react";
import { Row, Col, Card, Badge, Tag, Space, Button, Spin } from "antd";
import {
  CreditCardOutlined,
  LeftOutlined,
  LinkOutlined,
  StepBackwardOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getallENQ } from "../services/api";
import dayjs from "dayjs";

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

const DEAL_COLORS = {
  open: "orange",
  closed: "green",
};

const tsToDate = (ts) => {
  if (!ts || !ts.seconds) return null;
  const ms = ts.seconds * 1000 + (ts.nanoseconds || 0) / 1e6;
  return new Date(ms);
};

export default function EnquiryDetailsPage() {
  const { enqNo } = useParams();
  console.log("enqNo", enqNo);
  let ENQ_ID = enqNo;
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["myEnquiryDetails", ENQ_ID],
    enabled: !!ENQ_ID,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await getallENQ(`?id=${ENQ_ID}`);
      return res?.enquiries?.[0];
    },
  });

  const enquiry = data;

  const createdAtDate = enquiry?.createdAt ? tsToDate(enquiry.createdAt) : null;
  const preferredDate = enquiry?.preferredDate
    ? tsToDate(enquiry.preferredDate)
    : null;

  const deal = enquiry?.deal || "open";
  const dealColor = DEAL_COLORS[deal] || "orange";
  const dealLabel = deal === "closed" ? "Deal Closed" : "Deal Open";

  const paymentStatus = enquiry?.paymentStatus || "Null";
  const paymentColor = PAYMENT_COLORS[paymentStatus] || "default";
  const statusColor = STATUS_COLORS[enquiry?.status || "Created"] || "default";

  const handleOpenLink = (link) => {
    console.log("link", link);

    if (!link) return;
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Row justify="center" style={{ minHeight: "100vh", padding: 16 }}>
        <Col xs={24} md={18} lg={14}>
          <Badge.Ribbon text={enquiry?.status} color={statusColor}>
            <Card
              title={
                <>
                  <Button
                    size="small"
                    onClick={() => navigate(-1)}
                    style={{ marginRight: 10 }}
                  >
                    <LeftOutlined />
                  </Button>

                  {enquiry?.enqNo}
                </>
                //   extra={
              }
              style={{
                borderRadius: 16,
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
              }}
            >
              {isLoading && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <Spin />
                </div>
              )}

              {!isLoading && !enquiry && (
                <div style={{ color: "red" }}>
                  Could not load enquiry details.
                </div>
              )}

              {!isLoading && enquiry && (
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Row gutter={12}>
                    <Col xs={24} sm={12} md={8}>
                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
                        Enquiry No
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {enquiry.enqNo}
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
                        Title
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {enquiry.title}
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
                        SKU
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {enquiry.sku}
                      </div>
                    </Col>
                  </Row>

                  <Row gutter={12}>
                    <Col xs={8} sm={8} md={8}>
                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
                        Created on
                      </div>
                      <div style={{ fontSize: 12 }}>
                        {createdAtDate
                          ? dayjs(createdAtDate).format("DD/MM/YYYY")
                          : "-"}
                      </div>
                    </Col>
                    <Col xs={8} sm={8} md={8}>
                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
                        Preferred date
                      </div>
                      <div style={{ fontSize: 12 }}>
                        {preferredDate
                          ? dayjs(preferredDate).format("DD/MM/YYYY")
                          : "-"}
                      </div>
                    </Col>

                    <Col xs={8} sm={8} md={8}>
                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
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
                            style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}
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
                            <>
                              <Button
                                type="primary"
                                icon={<CreditCardOutlined />}
                                onClick={() =>
                                  handleOpenLink(enquiry?.paymentLink)
                                }
                              >
                                "Pay"
                              </Button>
                            </>
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
                          onClick={() => handleOpenLink(enquiry?.billingLink)}
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
                          hidden={enquiry?.paymentStatus !== "Refund Issued"}
                        >
                          Refund Receipt
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Space>
              )}
            </Card>
          </Badge.Ribbon>
        </Col>
      </Row>
    </>
  );
}
