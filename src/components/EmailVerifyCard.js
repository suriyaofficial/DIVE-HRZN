import React from "react";
import { Card, Form, Input, Button, Typography } from "antd";

const { Title, Text } = Typography;

function EmailVerifyCard({
  title = "Verify your email",
  subtitle,
  email,
  error,
  loading,
  onChangeEmail,
  onSubmit,
}) {
  return (
    <div
      style={{
        padding: 16,
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          maxWidth: 420,
          width: "100%",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
        }}
      >
        <Title level={4} style={{ textAlign: "center", marginBottom: 4 }}>
          {title}
        </Title>

        {subtitle && (
          <Text
            type="secondary"
            style={{
              display: "block",
              textAlign: "center",
              marginBottom: 16,
              fontSize: 13,
            }}
          >
            {subtitle}
          </Text>
        )}

        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Email address"
            validateStatus={error ? "error" : ""}
            help={error || ""}
          >
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => onChangeEmail(e.target.value)}
              placeholder="Enter your email"
              size="middle"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {loading ? "Verifying..." : "Continue"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default EmailVerifyCard;
