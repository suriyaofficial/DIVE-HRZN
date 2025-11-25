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
  Descriptions,
  Space,
  Badge,
} from "antd";
import { getDetail, postQuote, postReserve } from "../services/api";
import {
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  PoweroffOutlined,
  CaretUpFilled,
  CaretDownFilled,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function Detail() {
  const { sku } = useParams();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [openCards, setOpenCards] = useState(true);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const tagProps = {
    available: { color: "green", text: "Available" },
    "coming soon": { color: "orange", text: "Coming soon" },
    "sold out": { color: "red", text: "Sold out" },
  };
  const { data, isLoading, isError } = useQuery({
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
    mutationFn: (payload) => postQuote(payload),
    onSuccess: () => {
      message.success("Quote request sent! We will contact you soon.");
      queryClient.invalidateQueries(["detail", sku]);
      setModalOpen(false);
    },
    onError: () => {
      message.error("Failed to send quote. Please try again.");
    },
  });

  const reserveMutation = useMutation({
    mutationFn: (payload) => postReserve(payload),
    onSuccess: () => {
      message.success(
        "Reservation successful! Check your email for confirmation."
      );
      queryClient.invalidateQueries(["detail", sku]);
      setModalOpen(false);
    },
    onError: () => {
      message.error("Reservation failed. Please try again.");
    },
  });

  const handleActionClick = (action) => {
    // action: 'quote' or 'reserve'
    setSelectedAction(action);
    setModalOpen(true);
  };

  const handleConfirm = (values) => {
    const payload = {
      sku,
      title: data?.title,
      phoneNo: user?.phoneNo,
      email: user?.email,
      name: `${user?.firstName} ${user?.lastName}`,
      initiatedDate: new Date().toISOString().split("T")[0],
    };

    if (selectedAction === "quote") {
      quoteMutation.mutate(payload);
    } else {
      reserveMutation.mutate(payload);
    }
  };

  const photos = useMemo(
    () => (Array.isArray(data?.photos) ? data.photos : []),
    [data]
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div>Unable to load details. Please try again later.</div>;

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
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={10} lg={8}>
          <Card bordered={false} bodyStyle={{ padding: 8 }}>
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
          <Badge.Ribbon text={tag.text} color={tag.color}>
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
                  <div style={{ color: "#666", marginTop: 6 }}>{data?.SKU}</div>

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
              <Space>
                {data?.price ? (
                  <Button
                    type="primary"
                    onClick={() => handleActionClick("reserve")}
                    loading={reserveMutation.isLoading}
                    disabled={tag.text === "Sold out"}
                  >
                    Reserve the Seat
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => handleActionClick("quote")}
                    loading={quoteMutation.isLoading}
                  >
                    Get Quote
                  </Button>
                )}
              </Space>
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
        title={
          selectedAction === "quote" ? "Request a Quote" : "Reserve the Seat"
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => handleConfirm()}
        okText={
          selectedAction === "quote"
            ? "Send Quote Request"
            : "Confirm Reservation"
        }
        confirmLoading={quoteMutation.isLoading || reserveMutation.isLoading}
      >
        <div>
          <Paragraph>
            {selectedAction === "quote"
              ? "We will contact you with a personalized quote for this package."
              : "Confirm your reservation — we will send booking details to your email."}
          </Paragraph>
          <Paragraph>
            <Text strong>Package:</Text> {data?.title}
          </Paragraph>
          <Paragraph>
            <Text strong>SKU:</Text> {sku}
          </Paragraph>
        </div>
      </Modal>
    </div>
  );
}
