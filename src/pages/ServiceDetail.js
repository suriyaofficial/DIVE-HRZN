import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Row,
  Col,
  Card,
  Image,
  Button,
  Timeline,
  Divider,
  Modal,
  message,
  Tag,
  Typography,
  Space,
  Badge,
  Input,
  Alert,
  Form,
  Spin,
} from "antd";
import { getDetail, getMyDetails, postQuote } from "../services/api";
import {
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CaretUpFilled,
  CaretDownFilled,
  MailOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const { Title, Paragraph, Text } = Typography;

export default function ServiceDetail() {
  const accessToken = Cookies.get("token");
  const { sku } = useParams();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [openCards, setOpenCards] = useState(true);
  let getuser = queryClient.getQueryData(["myDetails"]);
  const { data: user } = useQuery({
    queryKey: ["myDetails"],
    queryFn: async () => {
      const response = await getMyDetails(accessToken);
      return response.data;
    },
    enabled: !!accessToken && !getuser,
    refetchOnWindowFocus: false,
  });
  const userDetails = getuser ? getuser : user;
  const [email, setEmail] = useState(userDetails?.email || null);
  const [loading, setLoading] = useState( null);
  const [phoneNo, setPhoneNo] = useState(userDetails?.phoneNo || "+91");
  const navigate = useNavigate();
  const location = useLocation();

  const tagProps = {
    available: { color: "green", text: "Available" },
    "coming soon": { color: "orange", text: "Coming soon" },
    "sold out": { color: "red", text: "Sold out" },
  };
  const { data, isLoading } = useQuery({
    queryKey: [`detail-${sku}`],
    queryFn: async () => {
      const response = await getDetail(sku);
      return response;
    },
    enabled: !!sku,
    staleTime: 1000 * 60 * 5,
  });
  const tag = tagProps[data?.status?.toLowerCase()];

  const quoteMutation = useMutation({
    mutationFn: (payload) => postQuote(payload, accessToken),
    onSuccess: (data) => {
      setLoading(false);

      message.success("Quote request sent! We will contact you soon.");
      queryClient.invalidateQueries(["detail", sku]);
      queryClient.invalidateQueries(["myDetails"]);
      setModalOpen(false);
    },
    onError: () => {
      message.error("Failed to send quote. Please try again.");
    },
  });

  const handleConfirm = (values) => {
    const payload = {
      sku: data.SKU,
      title: data?.title,
      email: email,
      phoneNo: phoneNo,
      name: `${userDetails?.firstName} ${userDetails?.lastName}`,
      initiatedDate: new Date().toISOString().split("T")[0],
    };
    setLoading(true);
    quoteMutation.mutate(payload);
  };

  const photos = useMemo(
    () => (Array.isArray(data?.photos) ? data.photos : []),
    [data]
  );

  // Helper: render list only when present and non-empty — replaced Antd List with semantic ul/li
  const renderBulletList = (title, arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return (
      <Card size="small" title={title} style={{ marginBottom: 16 }}>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          {arr.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 1 }}>
              <Text>{item}</Text>
            </li>
          ))}
        </ul>
      </Card>
    );
  };
  const handleActionClick = (action) => {
    if (!accessToken) {
      // send user to home with auth=signin and redirect back to this page after login
      const redirectTo = encodeURIComponent(
        location.pathname + location.search
      );
      navigate(`/?auth=signin&redirect=${redirectTo}`);
      return;
    }

    setModalOpen(true);
  };

  // Itinerary timeline (keeps Timeline)
  const renderItinerary = (itinerary) => {
    if (!Array.isArray(itinerary) || itinerary.length === 0) return null;
    return (
      <Card
        size="small"
        title="Itinerary"
        style={{ marginBottom: 16 }}
        extra={
          <Button
            type="default"
            size="small"
            icon={openCards ? <CaretUpFilled /> : <CaretDownFilled />}
            onClick={() => setOpenCards(!openCards)}
          />
        }
      >
        {openCards && (
          <Timeline mode="left">
            {itinerary.map((step, idx) => (
              <Timeline.Item key={idx} label={step.day || `Day ${idx + 1}`}>
                <div style={{ fontWeight: 600 }}>{step.title}</div>
                <div style={{ marginTop: 1 }}>
                  {Array.isArray(step.details) ? (
                    <ul style={{ paddingLeft: 16 }}>
                      {step.details.map((d, k) => (
                        <li key={k} style={{ marginBottom: 1 }}>
                          {d}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Paragraph>{step.details}</Paragraph>
                  )}
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Card>
    );
  };

  return (
    <>
      {!isLoading ? (
        <div style={{ padding: 24 }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={10} lg={8}>
              <Card variant="borderless" styles={{ body: { padding: 8 } }}>
                {photos.length > 0 ? (
                  <div>
                    <Image.PreviewGroup>
                      <div style={{ textAlign: "center" }}>
                        <Image
                          src={photos[0]}
                          style={{
                            maxHeight: 420,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                      </div>

                      {/* Thumbnails */}
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          marginTop: 8,
                          overflowX: "auto",
                          paddingBottom: 6,
                        }}
                      >
                        {photos.map((src, i) => (
                          <Image
                            key={i}
                            src={src}
                            width={80}
                            height={60}
                            preview={true}
                            style={{
                              objectFit: "cover",
                              borderRadius: 4,
                              cursor: "pointer",
                            }}
                          />
                        ))}
                      </div>
                    </Image.PreviewGroup>
                  </div>
                ) : (
                  <div
                    style={{
                      height: 420,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div>No photos available</div>
                  </div>
                )}
              </Card>
              <Badge.Ribbon text={tag?.text} color={tag?.color}>
                <Card style={{ marginTop: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>
                        {data?.title}
                      </div>
                      <div style={{ color: "#666", marginTop: 6 }}>
                        {data?.SKU}
                      </div>

                      {/* Inline meta row: group size / date / place (renders only when present) */}
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          marginTop: 10,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        {data?.group_size != null && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              color: "#333",
                            }}
                            aria-label="group-size"
                          >
                            <UserOutlined style={{ fontSize: 16 }} />
                            <span style={{ fontSize: 14 }}>
                              {data.group_size}{" "}
                              {String(data.group_size) === "1"
                                ? "person"
                                : "persons"}
                            </span>
                          </div>
                        )}

                        {data?.dates && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              color: "#333",
                            }}
                            aria-label="date"
                          >
                            <CalendarOutlined style={{ fontSize: 16 }} />
                            <span style={{ fontSize: 14 }}>{data.dates}</span>
                          </div>
                        )}

                        {data?.place && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              color: "#333",
                            }}
                            aria-label="place"
                          >
                            <EnvironmentOutlined style={{ fontSize: 16 }} />
                            <span style={{ fontSize: 14 }}>{data.place}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      {data?.price ? (
                        <Tag
                          color="green"
                          style={{ fontSize: 16, padding: "6px 12px" }}
                        >
                          {data.currency
                            ? `${data.currency} ${data.price}`
                            : `${data.price}`}
                        </Tag>
                      ) : (
                        <Tag color="blue">Price on request</Tag>
                      )}
                    </div>
                  </div>

                  <Divider />

                  {/* Action button */}
                  {accessToken ? (
                    <Space>
                      <Button
                        type="primary"
                        onClick={() => handleActionClick("quote")}
                        loading={loading || quoteMutation.isLoading}
                        disabled={tag?.text === "Sold out"}
                      >
                        Get Quote
                      </Button>
                    </Space>
                  ) : (
                    <Button
                      type="primary"
                      loading={loading || quoteMutation.isLoading}
                      onClick={() => handleActionClick("quote")}
                    >
                      Sign In to Continue
                    </Button>
                  )}
                </Card>
              </Badge.Ribbon>
            </Col>

            <Col xs={24} md={14} lg={16}>
              {/* Description */}
              {data?.description && (
                <>
                  <Title>{data.title}</Title>
                  <Paragraph style={{ whiteSpace: "pre-wrap" }}>
                    {data.description}
                  </Paragraph>
                </>
              )}

              {/* Pre requirements / Includes / Excludes */}
              {renderBulletList("Pre-requirements", data?.pre_requerments)}
              {renderBulletList("Included", data?.included)}
              {renderBulletList("Excluded", data?.excluded)}

              {/* Itinerary timeline */}
              {renderItinerary(data?.itinerary)}
            </Col>
          </Row>

          <Modal
            title={"Request a Quote"}
            open={modalOpen}
            onCancel={() => setModalOpen(false)}
            onOk={handleConfirm}
            okText={"Send Quote Request"}
            confirmLoading={loading || quoteMutation.isLoading}
            okButtonProps={{
              disabled: !email?.trim() || !phoneNo?.trim(), // enable only when filled
            }}
            width={380} // compact width (mobile-friendly)
            styles={{ body: { paddingTop: 10, paddingBottom: 10 } }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="small">
              {/* Short intro */}
              <Text style={{ fontSize: 14 }}>
                Just a few details & we’ll connect shortly.
              </Text>

              {/* Form */}
              <Form layout="vertical" style={{ marginBottom: 0 }}>
                <Form.Item
                  required
                  style={{ marginBottom: 12 }} // reduced gap
                >
                  <Input
                    size="middle"
                    value={email || ""}
                    prefix={<MailOutlined style={{ fontSize: 14 }} />}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!!userDetails?.email}
                  />
                </Form.Item>

                <Form.Item
                  required
                  style={{ marginBottom: 10 }} // reduced gap
                >
                  <Input
                    size="middle"
                    prefix={<WhatsAppOutlined style={{ fontSize: 14 }} />}
                    placeholder="WhatsApp number (+91…)"
                    value={phoneNo || ""}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    maxLength={15}
                    disabled={!!userDetails?.phoneNo}
                  />
                </Form.Item>
              </Form>

              {/* Privacy Note */}
              <Alert
                type="info"
                showIcon
                message="We respect your privacy"
                style={{
                  fontSize: 11,
                  borderRadius: 6,
                  padding: "6px 10px",
                }}
                description={
                  <div style={{ fontSize: 12, lineHeight: 1.3 }}>
                    • No spam calls or emails.
                    <br />• Stored securely with Google Firebase encryption.
                  </div>
                }
              />

              <Text type="secondary" style={{ fontSize: 11, marginTop: -6 }}>
                By continuing, you agree to be contacted by our team for this
                enquiry. You can ask us to delete your data anytime.
              </Text>
            </Space>
          </Modal>
        </div>
      ) : (
        <div style={{ padding: 16, minHeight: "90vh", paddingTop: "45vh" }}>
          <Row justify="center">
            <Spin size="large" />
          </Row>
        </div>
      )}
    </>
  );
}
