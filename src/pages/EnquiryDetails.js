// EnquiryDetails.jsx
import React, { useEffect, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Tag,
  Checkbox,
  Space,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  LinkOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getallENQ, updateEnquiry } from "../services/api";

const STATUS_OPTIONS = [
  "Created",
  "Assigned",
  "Discussed",
  "Quote Sent",
  "Invoiced",
  "Service Provided",
  "Service Canceled",
];

const PAYMENT_OPTIONS = [
  "Payment Pending",
  "Paid",
  "Refund Pending",
  "Refund Issued",
  "",
];

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
  "": "default",
  Null: "default",
};

const DEAL_COLORS = {
  open: "orange",
  closed: "green",
};

// Firestore TS -> dayjs
const tsToDayjs = (ts) => {
  if (!ts || !ts.seconds) return null;
  const ms = ts.seconds * 1000 + (ts.nanoseconds || 0) / 1e6;
  return dayjs(ms);
};

// dayjs -> Firestore TS
const dayjsToTs = (d) => {
  if (!d) return null;
  const ms = d.valueOf();
  return {
    seconds: Math.floor(ms / 1000),
    nanoseconds: (ms % 1000) * 1e6,
  };
};

export default function EnquiryDetails() {
  const { enqNo } = useParams(); // e.g. ENQ-001
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const FRONTEND_URL = process.env.REACT_APP_BASE_URL;

  // Fetch single enquiry by enqNo
  const { data, isLoading } = useQuery({
    queryKey: ["enquiryDetails", enqNo],
    enabled: !!enqNo,
    queryFn: async () => {
      const res = await getallENQ(`?id=${enqNo}`);
      return res?.enquiries?.[0] || null;
    },
  });

  const enquiry = data;

  // Populate form when enquiry loads
  useEffect(() => {
    if (!enquiry) return;

    form.setFieldsValue({
      deal: enquiry.deal || "open",
      status: enquiry.status || "Created",
      paymentStatus: enquiry.paymentStatus || "",
      groupSize: enquiry.groupSize ?? 0,
      preferredDate: enquiry.preferredDate
        ? tsToDayjs(enquiry.preferredDate)
        : null,
      billingLink: enquiry.billingLink || "",
      paymentLink: enquiry.paymentLink || "",
      refundReceiptLink: enquiry.refundReceiptLink || "",
      price: enquiry.price || "",
      knowSwimming:
        enquiry.knowSwimming === true || enquiry.knowSwimming === "Yes",
      notes: enquiry.notes || "",
    });
  }, [enquiry, form]);
  const handleWhatsApp = (type) => {
    const rawPhone = enquiry.phoneNo || "";
    const cleanPhone = rawPhone.replace(/[^\d]/g, "");

    if (!cleanPhone) {
      messageApi.error("No valid phone number found for this enquiry.");
      return;
    }

    const firstName = (enquiry.name || "").split(" ")[0] || "there";

    let link = "";
    let messageText = "";

    // Helper: classify link by URL
    const detectLinkKind = (url) => {
      const l = (url || "").toLowerCase();
      if (l.includes("/view/refund") || l.includes("refund-receipt")) {
        return "refundReceipt";
      }
      if (l.includes("/pay/") || l.includes("/payment")) {
        return "payment";
      }
      if (l.includes("/view/quote") || l.includes("quote")) {
        return "quote";
      }
      if (l.includes("/view/invoice") || l.includes("invoice")) {
        return "invoice";
      }
      return "generic";
    };

    if (type === "billing") {
      link = form.getFieldValue("billingLink") || enquiry.billingLink || "";
      if (!link) {
        messageApi.error("Billing link is empty.");
        return;
      }

      const kind = detectLinkKind(link);

      if (kind === "quote") {
        messageText = `Hi ${firstName}, here is your quote for ${enquiry.title}:\n${link}\n\nIf you have any questions, feel free to reply to this message.`;
      } else if (kind === "invoice") {
        messageText = `Hi ${firstName}, here is your invoice for ${enquiry.title}:\n${link}\n\nPlease review it and let us know if everything looks good.`;
      } else {
        messageText = `Hi ${firstName}, here is the link for your enquiry ${enquiry.enqNo}:\n${link}`;
      }
    }

    if (type === "payment") {
      link = form.getFieldValue("paymentLink") || enquiry.paymentLink || "";
      if (!link) {
        messageApi.error("Payment link is empty.");
        return;
      }

      // URL like: http://localhost:3100/pay/ENQ-020
      messageText = `Hi ${firstName}, you can complete your booking payment for ${enquiry.title} using this link:\n${link}\n\nOnce paid, we’ll confirm your booking.`;
    }

    if (type === "refund") {
      link =
        form.getFieldValue("refundReceiptLink") ||
        enquiry.refundReceiptLink ||
        "";
      if (!link) {
        messageApi.error("Refund receipt link is empty.");
        return;
      }

      // URL like: http://localhost:3100/view/refund-receipt/ENQ-020
      messageText = `Hi ${firstName}, your refund for ${enquiry.title} has been processed.\nYou can view your refund receipt here:\n${link}`;
    }

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
      messageText
    )}`;

    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => updateEnquiry(id, updates),
    onSuccess: () => {
      messageApi.success("Enquiry updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["allENQ"] });
      queryClient.invalidateQueries({ queryKey: ["enquiryDetails", enqNo] });
    },
    onError: (err) => {
      messageApi.error(
        err?.message || "Failed to update enquiry. Please try again."
      );
    },
  });

  const handleOpenLink = (url) => {
    if (!url) return;

    // If URL contains /pay → replace base URL
    if (url.includes("/pay")) {
      url = url.replace(FRONTEND_URL, BASE_URL);
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  // helper: compare Firestore timestamps
  const isSameTs = (a, b) => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.seconds === b.seconds && a.nanoseconds === b.nanoseconds;
  };

  const normalizeKnowSwimming = (val) =>
    val === true || val === "Yes" ? "Yes" : "";

  // ... inside EnquiryDetails component ...

  const handleUpdate = () => {
    if (!enquiry) return;

    const values = form.getFieldsValue();
    console.log("values", values);

    const {
      deal,
      status,
      paymentStatus,
      groupSize,
      preferredDate,
      billingLink,
      paymentLink,
      refundReceiptLink,
      price,
      knowSwimming,
      notes,
    } = values;

    const errors = [];

    const originalStatus = enquiry.status || "Created";
    const originalPaymentStatus = enquiry.paymentStatus || "";
    const statusChanged = status !== originalStatus;
    const paymentStatusChanged = paymentStatus !== originalPaymentStatus;

    // ---- business rules that depend on CHANGE ----

    // 1) Moving into "Quote Sent"
    if (statusChanged && status === "Quote Sent") {
      if (!billingLink) {
        errors.push(
          "Quote / Invoice link is required when changing status to 'Quote Sent'."
        );
      }
    }

    // 2) Moving into "Invoiced"
    if (statusChanged && status === "Invoiced") {
      if (!billingLink) {
        errors.push(
          "Quote / Invoice link is required when changing status to 'Invoiced'."
        );
      }
      if (!["Payment Pending", "Paid"].includes(paymentStatus)) {
        errors.push(
          "When changing status to 'Invoiced', payment status must be 'Payment Pending' or 'Paid'."
        );
      }
      if (price === "" || price === null || price === undefined) {
        errors.push("Price is required when changing status to 'Invoiced'.");
      }
      if (!paymentLink) {
        errors.push(
          "Payment link is required when changing status to 'Invoiced'."
        );
      }
    }

    // 3) Moving into "Service Provided"
    if (statusChanged && status === "Service Provided") {
      if (paymentStatus !== "Paid") {
        errors.push(
          "When changing status to 'Service Provided', payment status must be 'Paid'."
        );
      }
    }

    // 4) Moving into "Service Canceled"
    if (statusChanged && status === "Service Canceled") {
      if (!["Refund Pending", "Refund Issued"].includes(paymentStatus)) {
        errors.push(
          "When changing status to 'Service Canceled', payment status must be 'Refund Pending' or 'Refund Issued'."
        );
      }
    }

    // 5) Moving into "Refund Issued"
    if (paymentStatusChanged && paymentStatus === "Refund Issued") {
      if (!refundReceiptLink) {
        errors.push(
          "Refund receipt link is required when changing payment status to 'Refund Issued'."
        );
      }
    }

    if (errors.length > 0) {
      messageApi.error(
        <div>
          {errors.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
      );
      return;
    }

    // ---- build candidate object ----
    const candidate = {
      deal,
      status,
      paymentStatus: paymentStatus || "",
      groupSize: groupSize ?? 0,
      preferredDate: preferredDate ? dayjsToTs(preferredDate) : null,
      billingLink: billingLink || "",
      paymentLink: paymentLink || "",
      refundReceiptLink: refundReceiptLink || "",
      price: price ?? "",
      knowSwimming: knowSwimming ? "Yes" : "",
      notes: notes || "",
    };

    // ---- build updates with only changed fields ----
    const updates = {};

    // simple scalar fields
    const scalarFields = [
      "deal",
      "status",
      "paymentStatus",
      "groupSize",
      "billingLink",
      "paymentLink",
      "refundReceiptLink",
      "price",
      "notes",
    ];

    scalarFields.forEach((field) => {
      const newVal = candidate[field];
      const oldVal = enquiry[field];

      // special case: knowSwimming handled separately
      if (newVal !== oldVal) {
        updates[field] = newVal;
      }
    });

    // preferredDate (Firestore TS)
    const newPreferred = candidate.preferredDate;
    const oldPreferred = enquiry.preferredDate || null;
    if (!isSameTs(newPreferred, oldPreferred)) {
      updates.preferredDate = newPreferred;
    }

    // knowSwimming normalized
    const newKnow = candidate.knowSwimming; // "Yes" | ""
    const oldKnow = normalizeKnowSwimming(enquiry.knowSwimming);
    if (newKnow !== oldKnow) {
      updates.knowSwimming = newKnow;
    }

    if (Object.keys(updates).length === 0) {
      messageApi.info("No changes to update.");
      return;
    }

    updateMutation.mutate({
      id: enquiry.id, // Firestore doc id
      updates,
    });
  };

  const paymentOptionsForStatus = useMemo(() => {
    return PAYMENT_OPTIONS;
  }, []);

  if (isLoading || !enquiry) {
    return (
      <Row
        justify="center"
        style={{ minHeight: "100vh", padding: 16, background: "#f5f5f5" }}
      >
        <Col>
          <span>Loading...</span>
        </Col>
      </Row>
    );
  }

  const deal = enquiry.deal || "open";
  const dealColor = DEAL_COLORS[deal] || "orange";

  const statusColor = STATUS_COLORS[enquiry.status] || "default";
  const paymentStatusVal = enquiry.paymentStatus || "Null";
  const paymentColor = PAYMENT_COLORS[paymentStatusVal] || "default";

  return (
    <>
      {contextHolder}
      <Row
        justify="center"
        style={{ minHeight: "100vh", background: "#f5f5f5", padding: 12 }}
      >
        <Col xs={24} md={20} lg={18}>
          <Card
            style={{
              borderRadius: 16,
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.18)",
            }}
            bodyStyle={{ padding: 16 }}
            title={
              <Space size={8}>
                <Button
                  icon={<ArrowLeftOutlined />}
                  size="small"
                  onClick={() => navigate("/admin/enquiries")}
                />
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  {enquiry.enqNo}
                </span>
              </Space>
            }
          >
            <Form
              form={form}
              layout="vertical"
              size="small"
              style={{ marginTop: 4 }}
              disabled={updateMutation.isPending}
            >
              <Row gutter={8}>
                <Col xs={24} md={14}>
                  {/* Basic info */}
                  <Row gutter={8}>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Enquiry ID" style={{ marginBottom: 8 }}>
                        <Input value={enquiry.enqNo} size="small" disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="SKU" style={{ marginBottom: 8 }}>
                        <Input value={enquiry.sku} size="small" disabled />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={8}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Customer name"
                        style={{ marginBottom: 8 }}
                      >
                        <Input value={enquiry.name} size="small" disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Email" style={{ marginBottom: 8 }}>
                        <Input value={enquiry.email} size="small" disabled />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={8}>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Phone" style={{ marginBottom: 8 }}>
                        <Input value={enquiry.phoneNo} size="small" disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Group size"
                        name="groupSize"
                        style={{ marginBottom: 8 }}
                      >
                        <InputNumber
                          min={0}
                          max={99}
                          size="small"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={8}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Preferred date"
                        name="preferredDate"
                        style={{ marginBottom: 8 }}
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          format="DD-MM-YYYY"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Swimming ability"
                        name="knowSwimming"
                        valuePropName="checked"
                        style={{ marginBottom: 8 }}
                      >
                        <Checkbox>Customer knows swimming</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Internal notes"
                    name="notes"
                    style={{ marginBottom: 8 }}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Add internal notes / discussion points with the customer..."
                    />
                  </Form.Item>
                </Col>

                {/* Right side: deal / status / billing */}
                <Col xs={24} md={10}>
                  <Card
                    size="small"
                    type="inner"
                    title="Deal & billing"
                    bodyStyle={{ padding: 12 }}
                  >
                    <Form.Item
                      label="Deal"
                      name="deal"
                      style={{ marginBottom: 8 }}
                    >
                      <Select size="small">
                        <Select.Option value="open">Open</Select.Option>
                        <Select.Option value="closed">Closed</Select.Option>
                      </Select>
                    </Form.Item>
                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item
                          label="Status"
                          name="status"
                          style={{ marginBottom: 8 }}
                        >
                          <Select size="small">
                            {STATUS_OPTIONS.map((s) => (
                              <Select.Option key={s} value={s}>
                                <Tag color={STATUS_COLORS[s] || "default"}>
                                  {s}
                                </Tag>
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Payment status"
                          name="paymentStatus"
                          style={{ marginBottom: 8 }}
                        >
                          <Select size="small">
                            {paymentOptionsForStatus.map((s) => (
                              <Select.Option key={s || "Null"} value={s}>
                                <Tag
                                  color={
                                    PAYMENT_COLORS[s || "Null"] || "default"
                                  }
                                >
                                  {s || "Null"}
                                </Tag>
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label="Billing Link"
                      name="billingLink"
                      style={{ marginBottom: 8 }}
                    >
                      <Input
                        placeholder="Paste quote or invoice URL"
                        size="small"
                        addonAfter={
                          <Space size={4}>
                            <Button
                              type="link"
                              size="small"
                              icon={<LinkOutlined />}
                              onClick={() =>
                                handleOpenLink(
                                  form.getFieldValue("billingLink")
                                )
                              }
                            />
                            <Button
                              type="text"
                              size="small"
                              icon={
                                <WhatsAppOutlined
                                  style={{ color: "#25D366" }}
                                />
                              }
                              onClick={() => handleWhatsApp("billing")}
                            />
                          </Space>
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      label="Payment Link"
                      name="paymentLink"
                      style={{ marginBottom: 8 }}
                    >
                      <Input
                        placeholder="Paste payment URL"
                        size="small"
                        addonAfter={
                          <Space size={4}>
                            <Button
                              type="link"
                              size="small"
                              icon={<LinkOutlined />}
                              onClick={() =>
                                handleOpenLink(
                                  form.getFieldValue("paymentLink")
                                )
                              }
                            />
                            <Button
                              type="text"
                              size="small"
                              icon={
                                <WhatsAppOutlined
                                  style={{ color: "#25D366" }}
                                />
                              }
                              onClick={() => handleWhatsApp("payment")}
                            />
                          </Space>
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      label="Price"
                      name="price"
                      style={{ marginBottom: 8 }}
                    >
                      <Input
                        style={{ width: "100%" }}
                        placeholder="Total price"
                        size="small"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Refund receipt link"
                      name="refundReceiptLink"
                      style={{ marginBottom: 0 }}
                    >
                      <Input
                        placeholder="Paste refund receipt URL"
                        size="small"
                        addonAfter={
                          <Space size={4}>
                            <Button
                              type="link"
                              size="small"
                              icon={<LinkOutlined />}
                              onClick={() =>
                                handleOpenLink(
                                  form.getFieldValue("refundReceiptLink")
                                )
                              }
                            />
                            <Button
                              type="text"
                              size="small"
                              icon={
                                <WhatsAppOutlined
                                  style={{ color: "#25D366" }}
                                />
                              }
                              onClick={() => handleWhatsApp("refund")}
                            />
                          </Space>
                        }
                      />
                    </Form.Item>
                  </Card>
                </Col>
              </Row>

              <Row justify="end" style={{ marginTop: 16 }}>
                <Col>
                  <Space size={8}>
                    <Button
                      size="small"
                      onClick={() => navigate("/admin/enquiries")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      onClick={handleUpdate}
                      loading={updateMutation.isPending}
                    >
                      Update enquiry
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}
