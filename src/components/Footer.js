// src/components/Footer.jsx
import React from "react";
import { Row, Col, Typography, Space, Divider } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  TwitterOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

/* Inline SVG for TikTok (simple) */
const TikTokIcon = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <path d="M9 3v10a4 4 0 104 4V7h3V3h-7z" />
  </svg>
);

/* Inline SVG for Linktree-like icon */
const LinktreeIcon = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <path d="M6 3a3 3 0 100 6 3 3 0 000-6zm12 0a3 3 0 100 6 3 3 0 000-6zM6 15a3 3 0 100 6 3 3 0 000-6zm12 0a3 3 0 100 6 3 3 0 000-6zM7 9h10v6H7z" />
  </svg>
);

const socialStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  borderRadius: 22,
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  marginRight: 8,
  transition: "transform .12s ease, background .12s ease",
  boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
};

const Footer = () => {
  return (
    <footer
      style={{
        background: "#0f1724",
        color: "#fff",
        padding: "20px 20px 18px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Row gutter={[24, 24]} align="top">
          {/* LEFT: Company / Address */}
          <Col xs={12} sm={12} md={12} lg={12}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                paddingTop: "25px",
              }}
            >
              {/* optional logo placeholder */}
              {/* <div
                style={{
                  minWidth: 72,
                  minHeight: 72,
                  borderRadius: 12,
                  background:
                    "linear-gradient(135deg, rgba(255,160,50,0.12), rgba(255,255,255,0.03))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 18,
                  boxShadow: "inset 0 -8px 18px rgba(0,0,0,0.2)",
                }}
              >
                DH
              </div> */}

              <div>
                <Title
                  level={5}
                  style={{ color: "#fff", margin: 0, letterSpacing: 0.6 }}
                >
                  Dive Hrzn Pvt. Ltd.
                </Title>
                <Text
                  type="secondary"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  Company Reg. No: 0123456789
                </Text>

                <Divider
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    margin: "12px 0",
                  }}
                />

                <Paragraph
                  style={{ margin: 0, color: "rgba(255,255,255,0.78)" }}
                >
                  <strong>Registered Office</strong>
                  <br />
                  No. 12, Ocean View Road,
                  <br />
                  Marina District, Chennai,
                  <br />
                  Tamil Nadu — 600001
                </Paragraph>
              </div>
            </div>
          </Col>

          {/* RIGHT: Contact + Social */}
          <Col xs={12} sm={12} md={12} lg={12}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <div>
                <Title level={5} style={{ color: "#fff", marginBottom: 8 }}>
                  Contact
                </Title>

                <Space direction="vertical" size="small">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <PhoneOutlined style={{ fontSize: 18, color: "#fff" }} />
                    <a
                      href="tel:+919876543210"
                      style={{ color: "#fff", textDecoration: "none" }}
                    >
                      +91 98765 43210
                    </a>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <MailOutlined style={{ fontSize: 18, color: "#fff" }} />
                    <a
                      href="mailto:hello@divehrzn.com"
                      style={{ color: "#fff", textDecoration: "none" }}
                    >
                      hello@divehrzn.com
                    </a>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <GlobalOutlined style={{ fontSize: 18, color: "#fff" }} />
                    <a
                      href="https://www.divehrzn.com"
                      style={{ color: "#fff", textDecoration: "none" }}
                    >
                      www.divehrzn.com
                    </a>
                  </div>
                </Space>

                <Divider
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    margin: "18px 0",
                  }}
                />

                <div>
                  <Title level={5} style={{ color: "#fff", marginBottom: 8 }}>
                    Follow us
                  </Title>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <a
                      href="https://instagram.com"
                      aria-label="Instagram"
                      style={socialStyle}
                    >
                      <InstagramOutlined style={{ fontSize: 18 }} />
                    </a>

                    <a
                      href="https://facebook.com"
                      aria-label="Facebook"
                      style={socialStyle}
                    >
                      <FacebookOutlined style={{ fontSize: 18 }} />
                    </a>

                    <a
                      href="https://twitter.com"
                      aria-label="Twitter"
                      style={socialStyle}
                    >
                      <TwitterOutlined style={{ fontSize: 18 }} />
                    </a>

                    <a
                      href="https://youtube.com"
                      aria-label="YouTube"
                      style={socialStyle}
                    >
                      <YoutubeOutlined style={{ fontSize: 18 }} />
                    </a>

                    <a
                      href="https://linkedin.com"
                      aria-label="LinkedIn"
                      style={socialStyle}
                    >
                      <LinkedinOutlined style={{ fontSize: 18 }} />
                    </a>

                    <a
                      href="https://tiktok.com"
                      aria-label="TikTok"
                      style={socialStyle}
                    >
                      <TikTokIcon style={{ width: 20, height: 20 }} />
                    </a>

                    <a
                      href="https://linktr.ee"
                      aria-label="Linktree"
                      style={socialStyle}
                    >
                      <LinktreeIcon style={{ width: 20, height: 20 }} />
                    </a>

                    {/* Add more social icons as needed — they will wrap on small screens */}
                  </div>
                </div>
              </div>

              {/* bottom small links / copyright */}
              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 0,
                }}
              >
                <Row>
                  <Col xs={24} sm={24}>
                    <Text
                      style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}
                    >
                      © {new Date().getFullYear()} Dive Hrzn Pvt. Ltd.
                    </Text>
                  </Col>
                  <Col xs={24} sm={24}>
                    <Space size="small">
                      <a
                        style={{ color: "rgba(255,255,255,0.6)" }}
                        href="/terms"
                      >
                        Terms
                      </a>
                      <a
                        style={{ color: "rgba(255,255,255,0.6)" }}
                        href="/privacy"
                      >
                        Privacy
                      </a>
                    </Space>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;
