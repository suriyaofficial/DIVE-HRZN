import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Empty, Flex, Radio } from "antd";
import { useQuery } from "@tanstack/react-query";
import DisplayCard from "../components/DisplayCard";
import { getScuba } from "../services/api";
function Scuba() {
  const location = useLocation();
  const { data } = useQuery({
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
    <div style={{ padding: 16, minHeight: "90vh" }}>

      <Row justify="center" align="middle" >
        <Flex vertical style={{ marginBottom: 16 ,marginTop:16}} >
          <Radio.Group
            size="small"
            optionType="button"
            buttonStyle="solid"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            options={data?.category.map((cat) => ({
              label: cat,
              value: cat,
            }))}
          />
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
  );
}

export default Scuba;
