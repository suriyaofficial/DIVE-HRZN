import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Row, Col, Card, Space, Spin, Empty, Button, Badge, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import { getallENQ } from "../services/api";

const STATUS_COLORS = {
  Created: "blue",
  Assigned: "geekblue",
  Discussed: "magenta",
  "Quote Sent": "orange",
  Invoiced: "purple",
  "Service Provided": "green",
  "Service Canceled": "red",
};

function MyEnquiriesView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [dealFilter, setDealFilter] = React.useState("open"); // "all" | "open"

  const userDetails = queryClient.getQueryData(["myDetails"]);

  const email = userDetails?.email || null;

  const { data: myEnquiries = [], isLoading } = useQuery({
    queryKey: ["myEnquiriesList", email, dealFilter],
    enabled: !!email,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!email) return [];
      const params = new URLSearchParams();
      if (dealFilter) {
        let deal = dealFilter.toString();
        params.append("deal", deal);
      }
      params.append("q", email);

      const queryString = `?${params.toString()}`;
      const res = await getallENQ(queryString);
      return res?.enquiries || [];
    },
  });

  if (!userDetails) {
    return (
      <Row justify="center" style={{ padding: 24 }}>
        <Spin />
      </Row>
    );
  }

  if (isLoading) {
    return (
      <Row justify="center" style={{ padding: 24 }}>
        <Spin />
      </Row>
    );
  }

  if (!isLoading && myEnquiries.length === 0) {
    return (
      <Row justify="center" style={{ padding: 24 }}>
        <Col>
          <Empty description="No matching enquiries found." />
        </Col>
      </Row>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: 16,
      }}
    >
      <Space
        wrap
        style={{
          width: "100%",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <Radio.Group
          onChange={(e) => setDealFilter(e.target.value)}
          value={dealFilter}
        >
          <Radio.Button value="closed">Closed</Radio.Button>
          <Radio.Button value="open">Open</Radio.Button>
        </Radio.Group>
      </Space>
      <Row justify="center">
        <Col xs={24} md={20} lg={18}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {myEnquiries.map((enq) => {
              const statusColor = STATUS_COLORS[enq.status] || "default";
              return (
                <>
                  <Badge.Ribbon text={enq.status} color={statusColor}>
                    <Card
                      size="small"
                      key={enq.enqNo}
                      hoverable
                      style={{
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                      }}
                      bodyStyle={{ padding: 16 }}
                      onClick={() =>
                        navigate(`/my-enquiries/${enq.enqNo}/${email}`)
                      }
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Row
                          align="middle"
                          justify="space-between"
                          style={{ rowGap: 4 }}
                        >
                          <Col xs={24} sm={12} md={8}>
                            <div
                              style={{
                                fontSize: 12,
                                color: "rgba(0,0,0,0.45)",
                              }}
                            >
                              Enquiry ID
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 500 }}>
                              {enq.enqNo}
                            </div>
                          </Col>
                          <Col xs={24} md={16}>
                            <div
                              style={{
                                fontSize: 16,
                                fontWeight: 600,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {enq.title}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "rgba(0,0,0,0.45)",
                                marginTop: 2,
                              }}
                            >
                              {enq.sku}
                            </div>
                          </Col>
                        </Row>

                        <Row
                          align="middle"
                          justify="end"
                          style={{ marginTop: 4 }}
                        >
                          <Col
                            xs={24}
                            sm={12}
                            style={{ textAlign: "right", marginTop: 8 }}
                          >
                            <Button
                              type="link"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/my-enquiries/${enq.enqNo}/${email}`);
                              }}
                              style={{ padding: 0, fontSize: 14 }}
                            >
                              View enquiry details &raquo;
                            </Button>
                          </Col>
                        </Row>
                      </Space>
                    </Card>
                  </Badge.Ribbon>
                </>
              );
            })}
          </Space>
        </Col>
      </Row>
    </div>
  );
}

export default MyEnquiriesView;
