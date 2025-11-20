import { Modal, Tabs, Form, Input, Button, Divider, Space } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import React, { useState } from "react";

const AuthTabsModal = ({
  visible,
  onClose,
  loading,
  handleGoogleSignIn,
  handleEmailSignin,
  handleEmailSignup,
}) => {
  const [activeKey, setActiveKey] = useState("signin");
  const [signinForm] = Form.useForm();
  const [signupForm] = Form.useForm();

  // compact modal dimensions ~ 9:16 (portrait)
  const modalWidth = 360;
  const modalBodyStyle = {
    height: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 20,
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={modalWidth}
      bodyStyle={modalBodyStyle}
      centered
      destroyOnClose
      closable
    >
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}
      >
        {/* Small premium header */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 20 }}>Dive Hrzn</div>
        </div>
      </div>

      <Tabs
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        centered
        items={[
          {
            key: "signin",
            label: "Sign In",
            children: (
              <>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Form
                    layout="vertical"
                    form={signinForm}
                    onFinish={(values) => handleEmailSignin(values)}
                    style={{ width: "100%" }}
                  >
                    <Form.Item
                      name="email"
                      //   label="Email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Enter a valid email",
                        },
                      ]}
                    >
                      <Input placeholder="Email" size="default" />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      //   label="Password"
                      rules={[{ required: true, message: "Enter password" }]}
                    >
                      <Input.Password placeholder="Password" size="default" />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="default"
                        loading={loading}
                      >
                        Sign in
                      </Button>
                    </Form.Item>
                  </Form>

                  <div style={{ textAlign: "center", }}>
                    Dont have an account? {" "}
                    <Button type="link" onClick={() => setActiveKey("signup")}>
                      Create one
                    </Button>
                  </div>
                </Space>
              </>
            ),
          },
          {
            key: "signup",
            label: "Sign Up",
            children: (
              <>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Form
                    layout="vertical"
                    form={signupForm}
                    onFinish={(values) => handleEmailSignup(values)}
                    style={{ width: "100%" }}
                  >
                    <Form.Item
                      name="email"
                      //   label="Email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Enter a valid email",
                        },
                      ]}
                    >
                      <Input placeholder="Email" size="default" />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      //   label="Password"
                      rules={[
                        {
                          required: true,
                          min: 6,
                          message: "Password min 6 chars",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Password" size="default" />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      //   label="Confirm Password"
                      dependencies={["password"]}
                      rules={[
                        { required: true, message: "Confirm password" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value)
                              return Promise.resolve();
                            return Promise.reject(
                              new Error("Passwords do not match")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        placeholder="Confirm Password"
                        size="default"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="default"
                        loading={loading}
                      >
                        Create account
                      </Button>
                    </Form.Item>
                  </Form>

                  <div style={{ textAlign: "center",}}>
                    Already have an account?{" "}
                    <Button type="link" onClick={() => setActiveKey("signin")}>
                      Sign in
                    </Button>
                  </div>
                </Space>
              </>
            ),
          },
        ]}
      />
     <Button
        block
        icon={<GoogleOutlined />}
        onClick={handleGoogleSignIn}
        loading={loading}
        // style={{ height: 42 }}
        // Bottom={0}
      >
        Continue with Google
      </Button>
    </Modal>
  );
};

export default AuthTabsModal;
