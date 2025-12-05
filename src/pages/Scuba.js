import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Empty, Flex, Radio, Spin, Space, Button } from "antd";
import { useQuery } from "@tanstack/react-query";
import DisplayCard from "../components/DisplayCard";
import { getScuba } from "../services/api";
function Scuba() {
  const location = useLocation();
  const { data, isLoading } = useQuery({
    queryKey: ["scuba"],
    queryFn: async () => {
      const response = await getScuba();
      return response;
    },
  });

  const readTabFromURL = () => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    return tab;
  };

  const [activeTab, setActiveTab] = useState(() => readTabFromURL() || "TRIPS");

  const getCategoryObject = (name) => {
    if (!data || !Array.isArray(data.list)) return null;
    const lower = (n) => (n || "").toString().toLowerCase();
    return (
      data.list.find((c) => lower(c.category_name) === lower(name)) || null
    );
  };

  return (
    <>
      {!isLoading ? (
        <div style={{ padding: 16, minHeight: "90vh" }}>
          <Row justify="center" align="middle">
            <Flex vertical style={{ marginBottom: 16, marginTop: 16 }}>
              <div
                style={{
                  display: "flex",
                  // gap: 2,
                  // padding: "4px 6px",
                  borderRadius: 999,
                  background: "#fafafa",
                  // flexWrap: "wrap", // so it wraps on mobile
                }}
              >
                {data?.category.map((cat) => {
                  const isActive = activeTab === cat;
                  return (
                    <Button
                    size="small"
                      key={cat}
                      type="text"
                      onClick={() => setActiveTab(cat)}
                      style={{
                        borderRadius: 999,
                        // padding: "4px 12px",
                        fontSize: 12,
                        fontWeight: isActive ? 600 : 400,
                        background: isActive ? "#ffffff" : "transparent",
                        boxShadow: isActive ? "0 0 0 1px #e6f4ff" : "none",
                      }}
                    >
                      {cat}
                    </Button>
                  );
                })}
              </div>
            </Flex>
          </Row>

          <div style={{ marginTop: 20 }}>
            {(() => {
              const catObj = getCategoryObject(activeTab);
              if (!catObj || !catObj.list?.length)
                return (
                  <div style={{ padding: 40 }}>
                    <Empty description="No items available" />
                  </div>
                );

              return (
                <Row gutter={[16, 16]}>
                  {catObj.list.map((item) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.SKU}>
                      <DisplayCard item={item} />
                    </Col>
                  ))}
                </Row>
              );
            })()}
          </div>
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

export default Scuba;
