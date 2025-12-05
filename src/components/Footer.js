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
  WhatsAppOutlined,
  XOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getFooter } from "../services/api";

const { Title, Text, Paragraph } = Typography;

const LinktreeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 417 512.238"><path fill="#fff" fill-rule="nonzero" d="M171.274 344.942h74.09v167.296h-74.09V344.942zM0 173.468h126.068l-89.622-85.44 49.591-50.985 85.439 87.829V0h74.086v124.872L331 37.243l49.552 50.785-89.58 85.241L417 173.268v70.502H290.252l90.183 87.63L331 381.192 208.519 258.11 86.037 381.192l-49.591-49.591 90.218-87.631H0v-70.502z"/></svg>
);

const ThreadsIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-threads" viewBox="0 0 16 16">
  <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161"/>
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
  const { data, isLoading, error } = useQuery({
    queryKey: ["footer"],
    queryFn: getFooter,
    refetchOnWindowFocus: false,
  });

  // Fallbacks if doc is missing
  const company = data?.company || {};
  const contact = data?.contact || {};
  const social = data?.social || {};
  const legal = data?.legal || {};

  return (
    <footer
      style={{
        background: "#0f1724",
        color: "#fff",
        padding: "20px 20px 18px",
      }}
    >
      {!isLoading && data && (
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
                <div>
                  <Title
                    level={5}
                    style={{ color: "#fff", margin: 0, letterSpacing: 0.6 }}
                  >
                    {company.name || "Dive Hrzn Pvt. Ltd."}
                  </Title>
                  {company.regNumber && (
                    <Text
                      type="secondary"
                      style={{ color: "rgba(255,255,255,0.65)" }}
                    >
                      Company Reg. No: {company.regNumber}
                    </Text>
                  )}

                  <Divider
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      margin: "12px 0",
                    }}
                  />

                  {company.addressLines && company.addressLines.length > 0 && (
                    <Paragraph
                      style={{ margin: 0, color: "rgba(255,255,255,0.78)" }}
                    >
                      <strong>Registered Office</strong>
                      <br />
                      {company.addressLines.map((line, idx) => (
                        <React.Fragment key={idx}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </Paragraph>
                  )}
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
                    {contact.phone && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <PhoneOutlined
                          style={{ fontSize: 18, color: "#fff" }}
                        />
                        <a
                          href={`tel:${contact.phone.replace(/\s/g, "")}`}
                          style={{ color: "#fff", textDecoration: "none" }}
                        >
                          {contact.phone}
                        </a>
                      </div>
                    )}

                    {contact.email && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <MailOutlined style={{ fontSize: 18, color: "#fff" }} />
                        <a
                          href={`mailto:${contact.email}`}
                          style={{ color: "#fff", textDecoration: "none" }}
                        >
                          {contact.email}
                        </a>
                      </div>
                    )}

                    {contact.website && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <GlobalOutlined
                          style={{ fontSize: 18, color: "#fff" }}
                        />
                        <a
                          href={contact.website}
                          style={{ color: "#fff", textDecoration: "none" }}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {contact.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
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
                        gap: '3px',
                      }}
                    >
                      {social.instagram && (
                        <a
                          href={social.instagram}
                          aria-label="Instagram"
                          style={socialStyle}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <InstagramOutlined style={{ fontSize: 18 }} />
                        </a>
                      )}

                      {social.facebook && (
                        <a
                          href={social.facebook}
                          aria-label="Facebook"
                          style={socialStyle}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FacebookOutlined style={{ fontSize: 18 }} />
                        </a>
                      )}

                      {social.linkedin && (
                        <a
                          href={social.linkedin}
                          aria-label="LinkedIn"
                          style={socialStyle}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <LinkedinOutlined style={{ fontSize: 18 }} />
                        </a>
                      )}

                      {social.whatsapp && (
                        <a
                          href={social.whatsapp}
                          aria-label="WhatsApp"
                          style={socialStyle}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <WhatsAppOutlined style={{ fontSize: 18 }} />
                        </a>
                      )}

                      {social.youtube && (
                        <a
                          href={social.youtube}
                          aria-label="YouTube"
                          style={socialStyle}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <YoutubeOutlined style={{ fontSize: 18 }} />
                        </a>
                      )}

                      {social.threads && (
                        <a
                          href={social.threads}
                          aria-label="Threads"
                          style={socialStyle}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ThreadsIcon style={{ width: 10, height: 10 }} />
                        </a>
                      )}

                      {social.x && (
                        <a
                          href={social.x}
                          aria-label="X"
                          style={socialStyle}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <XOutlined />
                        </a>
                      )}

                      {/* {social.tiktok && (
                        <a
                          href={social.tiktok}
                          aria-label="TikTok"
                          style={socialStyle}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <TikTokIcon style={{ width: 20, height: 20 }} />
                        </a>
                      )} */}

                      {social.linktree && (
                        <a
                          href={social.linktree}
                          aria-label="Linktree"
                          style={socialStyle}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <LinktreeIcon style={{ width: 20, height: 20 }} />
                        </a>
                      )}
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
                        style={{
                          color: "rgba(255,255,255,0.6)",
                          fontSize: 13,
                        }}
                      >
                        © {new Date().getFullYear()}{" "}
                        {company.name || "Dive Hrzn Pvt. Ltd."}
                      </Text>
                    </Col>
                    <Col xs={24} sm={24}>
                      <Space size="small">
                        {legal.termsUrl && (
                          <a
                            style={{ color: "rgba(255,255,255,0.6)" }}
                            href={legal.termsUrl}
                          >
                            Terms &amp; Conditions
                          </a>
                        )}
                        {legal.privacyUrl && (
                          <a
                            style={{ color: "rgba(255,255,255,0.6)" }}
                            href={legal.privacyUrl}
                          >
                            Privacy Policy
                          </a>
                        )}
                        {legal.refundUrl && (
                          <a
                            style={{ color: "rgba(255,255,255,0.6)" }}
                            href={legal.refundUrl}
                          >
                            Refund Policy
                          </a>
                        )}
                      </Space>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </footer>
  );
};

export default Footer;
