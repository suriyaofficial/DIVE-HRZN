import React, { useMemo, useState } from "react";
import {
  Card,
  Form,
  Input,
  Avatar,
  Button,
  Row,
  Col,
  notification,
} from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePhoneNumber } from "../services/api"; // <-- adjust path as needed

export default function Profile() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [phone, setPhone] = useState(user?.phoneNo || "+91");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const isPhoneValid = (p) => /^\+?[1-9]\d{0,3}[ ]?\d{7,12}$/.test(p.trim());

  const changed = phone.trim() !== (user?.phoneNo || "").trim();
  const canUpdate = changed && isPhoneValid(phone);

  const mutation = useMutation({
    mutationFn: (newPhone) =>
      updatePhoneNumber({ email: user?.email, phoneNo: newPhone }),
    onSuccess: (res) => {
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
      notification.error({
        message: "Update failed",
        description:
          err?.message || "Could not update phone number. Try again.",
      });
    },
  });

  const handleUpdate = () => {
    if (!canUpdate) return;
    setLoading(true);
    mutation.mutate(phone.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card
        style={{ width: "100%", maxWidth: 900, borderRadius: 12 }}
        bodyStyle={{ padding: 24 }}
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={6} className="flex justify-center">
            <div className="flex flex-col items-center">
              <Avatar
                size={120}
                src={user?.profileImage || undefined}
                icon={!user?.profileImage ? <UserOutlined /> : null}
              />
              <div className="mt-3 text-center">
                <div className="font-semibold text-lg">
                  {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                    "Your name"}
                </div>
                <div className="text-sm text-gray-500">Member</div>
              </div>
            </div>
          </Col>

          <Col xs={24} md={18}>
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
                    <Input
                      prefix={<MailOutlined />}
                      value={user?.email}
                      disabled
                    />
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
                      initialValues={"+91"}
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
      </Card>
    </div>
  );
}
