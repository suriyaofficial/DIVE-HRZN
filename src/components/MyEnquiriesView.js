import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Row, Col, Card, Tag, Space, Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { getallENQ } from "../services/api";
import dayjs from "dayjs";

const STATUS_COLORS = {
  Created: "blue",
  Assigned: "geekblue",
  Discussed: "magenta",
  "Quote Sent": "orange",
  Invoiced: "purple",
  "Service Provided": "green",
  "Service Canceled": "red",
};

const DEAL_COLORS = {
  open: "orange",
  closed: "green",
};

function MyEnquiriesView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const userDetails = queryClient.getQueryData(["myDetails"]);

  console.log("userDetails", userDetails);

  const allEnquiries = userDetails.enquiries;

  if (!allEnquiries || allEnquiries.length === 0) {
    return (
      <Row justify="center" style={{ padding: 24 }}>
        <Col>
          <Empty description="You don't have any enquiries yet." />
        </Col>
      </Row>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 16 }}>My enquiries</h2>
      <Row gutter={[16, 16]}>
        {allEnquiries.map((enqNo) => {
          return (
            <Col key={enqNo} xs={8} sm={12} md={4} lg={4}>
              <Card
                size="small"
                hoverable
                onClick={() => navigate(`/my-enquiries/${enqNo}`)}
                style={{ height: "100%" }}
              >
               {enqNo}
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default MyEnquiriesView;
