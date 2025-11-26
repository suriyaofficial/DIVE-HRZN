import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Avatar,
  Button,
  Row,
  Col,
  notification,
  Layout,
  Menu,
  List,
  Badge,
  Tag,
  Space,
  Spin,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updatePhoneNumber, getallENQ } from "../services/api"; // <-- added getallENQ
import dayjs from "dayjs";

const { Sider, Content } = Layout;

// --- helper: Firestore timestamp -> JS Date ---
const tsToDate = (ts) => {
  if (!ts || !ts.seconds) return null;
  const ms = ts.seconds * 1000 + (ts.nanoseconds || 0) / 1e6;
  return new Date(ms);
};

// --- payment/status colors (reuse from admin if you want) ---
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

// ---------- MAIN PROFILE COMPONENT ----------

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal"); // "personal" | "enquiries"

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")).data;
    } catch {
      return null;
    }
  });
  console.log("Profile user:", user);

  const [phone, setPhone] = useState(user?.phoneNo || "+91");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const isPhoneValid = (p) => /^\+?[1-9]\d{0,3}[ ]?\d{7,12}$/.test(p.trim());

  const changed = phone.trim() !== (user?.phoneNo || "").trim();
  const canUpdate = changed && isPhoneValid(phone);

  // ---- PHONE NUMBER UPDATE MUTATION (unchanged logic) ----
  const mutation = useMutation({
    mutationFn: (newPhone) =>
      updatePhoneNumber({ email: user?.email, phoneNo: newPhone }),
    onSuccess: () => {
      const updatedUser = { ...user, phoneNo: phone };
      try {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setLoading(false);
      } catch (e) {}
      notification.success({
        message: "Phone updated",
        description: "Your phone number was updated successfully.",
      });
      queryClient.invalidateQueries(["profile", user?.phoneNo]);
    },
    onError: (err) => {
      setLoading(false);
      notification.error({
        message: "Update failed",
        description: err?.message,
      });
    },
  });

  const handleUpdate = () => {
    if (!canUpdate) return;
    setLoading(true);
    mutation.mutate(phone.trim());
  };

  const enquiriesIds = user?.enquiries || [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card
        style={{ width: "100%", maxWidth: 1100, borderRadius: 12 }}
        bodyStyle={{ padding: 0 }}
      >
        <Layout>
          {/* LEFT SIDE: avatar + menu */}
          <Sider
            width={260}
            style={{
              background: "#fafafa",
              borderRight: "1px solid #f0f0f0",
              padding: 16,
            }}
            breakpoint="md"
            collapsedWidth="0"
          >
            <div className="flex flex-col items-center mb-6">
              <Avatar
                size={96}
                src={user?.profileImage}
                icon={!user?.profileImage ? <UserOutlined /> : null}
              />
              <div className="mt-3 text-center">
                <div className="font-semibold text-base">
                  {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                    "Your name"}
                </div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>

            <Menu
              mode="inline"
              selectedKeys={[activeTab]}
              onClick={(e) => setActiveTab(e.key)}
              items={[
                {
                  key: "personal",
                  label: "Personal details",
                },
                {
                  key: "enquiries",
                  label: "My enquiries",
                },
              ]}
            />
          </Sider>

          {/* RIGHT SIDE CONTENT */}
          <Content style={{ padding: 24 }}>
            {activeTab === "personal" && (
              <PersonalDetailsForm
                form={form}
                user={user}
                phone={phone}
                setPhone={setPhone}
                canUpdate={canUpdate}
                loading={loading}
                handleUpdate={handleUpdate}
              />
            )}

            {activeTab === "enquiries" && (
              <MyEnquiriesView enquiriesIds={enquiriesIds} />
            )}
          </Content>
        </Layout>
      </Card>
    </div>
  );
}

// ---------- PERSONAL DETAILS (your original UI, moved into a sub-component) ----------

function PersonalDetailsForm({
  form,
  user,
  phone,
  setPhone,
  canUpdate,
  loading,
  handleUpdate,
}) {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24}>
        <div className="font-semibold text-lg mb-2">Personal details</div>
      </Col>

      <Col xs={24}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ email: user?.email }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="First name">
                <Input value={user?.firstName} disabled />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Last name">
                <Input value={user?.lastName} disabled />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Email">
                <Input prefix={<MailOutlined />} value={user?.email} disabled />
              </Form.Item>
            </Col>

            <Col xs={24} sm={16}>
              <Form.Item label="Phone number">
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Enter phone number"
                  value={phone || user?.phoneNo}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={15}
                />
                <div className="text-xs mt-1 text-gray-500">
                  Leave blank to keep empty. Use digits only (7-15 chars).
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} sm={8} className="flex items-end">
              <Button
                block
                type="primary"
                onClick={handleUpdate}
                disabled={!canUpdate || loading}
                loading={loading}
              >
                Update number
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}

// ---------- MY ENQUIRIES VIEW (user side) ----------

function MyEnquiriesView({ enquiriesIds }) {
  const [selectedEnqId, setSelectedEnqId] = useState(enquiriesIds?.[0] || null);

  const { data, isLoading } = useQuery({
    queryKey: ["myEnquiry", selectedEnqId],
    enabled: !!selectedEnqId,
    queryFn: async () => {
      const res = await getallENQ(`?id=${selectedEnqId}`);
      return res?.enquiries?.[0];
    },
  });

  const enquiry = data;

  const createdAtDate = enquiry?.createdAt ? tsToDate(enquiry.createdAt) : null;
  const preferredDate = enquiry?.preferredDate
    ? tsToDate(enquiry.preferredDate)
    : null;

  const dealColor = enquiry?.deal === "closed" ? "green" : "orange";
  const dealLabel = enquiry?.deal === "closed" ? "Deal Closed" : "Deal Open";

  const paymentColor = PAYMENT_COLORS[enquiry?.paymentStatus] || "default";
  const statusColor = STATUS_COLORS[enquiry?.status] || "default";

  const handleOpenLink = () => {
    if (!enquiry?.link) return;
    window.open(enquiry.link, "_blank", "noopener,noreferrer");
  };

  return (
    <Row gutter={[24, 24]}>
      {/* LEFT: list of enquiry IDs (1/4) */}
      <Col xs={24} md={6}>
        <Card
          size="small"
          title="My enquiries"
          bodyStyle={{ padding: 8, maxHeight: 400, overflowY: "auto" }}
        >
          {enquiriesIds?.length === 0 && (
            <div className="text-xs text-gray-500">
              No enquiries found for this account.
            </div>
          )}

          {enquiriesIds?.length > 0 && (
            <List
              size="small"
              dataSource={enquiriesIds}
              renderItem={(id) => {
                const selected = id === selectedEnqId;
                return (
                  <List.Item
                    style={{ padding: "4px 0" }}
                    onClick={() => setSelectedEnqId(id)}
                  >
                    <Button
                      type={selected ? "primary" : "text"}
                      size="small"
                      block
                    >
                      {id}
                    </Button>
                  </List.Item>
                );
              }}
            />
          )}
        </Card>
      </Col>

      {/* RIGHT: enquiry details (3/4) */}
      <Col xs={24} md={18}>
        {!selectedEnqId && (
          <Card size="small">
            <div className="text-sm text-gray-500">
              Select an enquiry from the left to view details.
            </div>
          </Card>
        )}

        {selectedEnqId && (
          <Badge.Ribbon text={dealLabel} color={dealColor}>
            <Card
              size="small"
              title={enquiry?.title || selectedEnqId}
              style={{ minHeight: 220 }}
            >
              {isLoading && (
                <div className="flex items-center justify-center py-10">
                  <Spin />
                </div>
              )}

              {!isLoading && !enquiry && (
                <div className="text-sm text-red-500">
                  Could not load enquiry details.
                </div>
              )}

              {!isLoading && enquiry && (
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Row gutter={8}>
                    <Col xs={12} md={8}>
                      <div className="text-xs text-gray-500">Enquiry No</div>
                      <div className="text-sm font-medium">{enquiry.enqNo}</div>
                    </Col>
                    <Col xs={12} md={8}>
                      <div className="text-xs text-gray-500">Title</div>
                      <div className="text-sm ">{enquiry.title}</div>
                    </Col>
                    <Col xs={12} md={8}>
                      <div className="text-xs text-gray-500">SKU</div>
                      <div className="text-sm">{enquiry.sku}</div>
                    </Col>
                  </Row>

                  <Row gutter={8}>
                    <Col xs={12} md={8}>
                      <div className="text-xs text-gray-500">Created on</div>
                      <div className="text-sm">
                        {createdAtDate
                          ? dayjs(createdAtDate).format("DD/MM/YYYY")
                          : "-"}
                      </div>
                    </Col>
                    <Col xs={12} md={8}>
                      <div className="text-xs text-gray-500">
                        Preferred date
                      </div>
                      <div className="text-sm">
                        {preferredDate
                          ? dayjs(preferredDate).format("DD/MM/YYYY")
                          : "-"}
                      </div>
                    </Col>
                    <Col xs={12} md={8}>
                      <div className="text-xs text-gray-500">Group size</div>
                      <div className="text-sm">{enquiry.groupSize ?? "-"}</div>
                    </Col>
                  </Row>
                  <Row gutter={8}>
                    <Col xs={12} md={8}>
                      <div className="text-xs text-gray-500">Status</div>
                      <div className="text-sm">
                        <Tag color={statusColor}>{enquiry?.status}</Tag>
                      </div>
                    </Col>
                    <Col xs={12} md={8}>
                      <div className="text-xs text-gray-500">
                        Payment Status
                      </div>
                      <div className="text-sm">
                        <Tag color={paymentColor}>{enquiry?.paymentStatus}</Tag>
                      </div>
                    </Col>
                  </Row>

                  <div className="mt-3">
                    <Button
                      type="primary"
                      size="small"
                      icon={<LinkOutlined />}
                      onClick={handleOpenLink}
                      disabled={!enquiry.link}
                    >
                      {enquiry.paymentStatus === "Paid"
                        ? "View invoice"
                        : "View quote"}
                    </Button>
                  </div>
                </Space>
              )}
            </Card>
          </Badge.Ribbon>
        )}
      </Col>
    </Row>
  );
}
