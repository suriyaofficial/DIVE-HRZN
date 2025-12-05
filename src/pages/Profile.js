import React, { useEffect, useState } from "react";
import { Card, Form, Avatar, notification, Row, Col, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePhoneNumber } from "../services/api";
import PersonalDetailsForm from "../components/PersonalDetailsForm";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";

// ---------- MAIN PROFILE COMPONENT ----------

export default function Profile() {
  const queryClient = useQueryClient();
  const userDetails = queryClient.getQueryData(["myDetails"]);
  console.log("userDetails", userDetails);

  const [form] = Form.useForm();
  const [phone, setPhone] = useState(userDetails?.phoneNo || "+91");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = Cookies.get("token");

  const isPhoneValid = (p) => /^\+?[1-9]\d{0,3}[ ]?\d{7,12}$/.test(p.trim());

  const changed = userDetails
    ? phone.trim() !== (userDetails?.phoneNo || "").trim()
    : false;

  const canUpdate = userDetails && changed && isPhoneValid(phone);

  // ---- PHONE NUMBER UPDATE MUTATION ----
  const mutation = useMutation({
    mutationFn: (newPhone) =>
      updatePhoneNumber({ phoneNo: newPhone, accessToken }),
    onSuccess: () => {
      setLoading(false);
      notification.success({
        message: "Phone updated",
        description: "Your phone number was updated successfully.",
      });
      queryClient.invalidateQueries(["profile", userDetails?.phoneNo]);
    },
    onError: (err) => {
      setLoading(false);
      notification.error({
        message: "Update failed",
        description: err?.message,
      });
    },
  });

  const handleUpdate = () => {
    if (!canUpdate) return;
    setLoading(true);
    mutation.mutate(phone.trim());
  };
  useEffect(() => {
    if (!accessToken) {
      navigate(`/`);
    }
  }, [accessToken, navigate]);

  // If user details are not loaded yet
  if (!userDetails) {
    return (
      <Row
        justify="center"
        align="middle"
        style={{ minHeight: "100vh", background: "#f5f5f5" }}
      >
        <Spin />
      </Row>
    );
  }

  return (
    <div style={{ height: "90vh", margin: "0" }}>
      <Row
        justify="center"
        align="middle"
        style={{
          // minHeight: "100vh",
          // background: "#f5f5f5",
          padding: 16,
        }}
      >
        <Col xs={20} sm={20} md={16} lg={8} xl={8}>
          <Card
            styles={{
              width: "90%",
              borderRadius: 16,
              boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
              body: { padding: 24 },
            }}
          >
            {/* Avatar + name */}
            <Row justify="center">
              <Col>
                <Avatar
                  size={96}
                  src={userDetails?.profileImage}
                  icon={!userDetails?.profileImage ? <UserOutlined /> : null}
                >
                  <UserOutlined />
                </Avatar>
              </Col>
            </Row>
            {/* Personal details form */}
            <div>
              <PersonalDetailsForm
                form={form}
                userDetails={userDetails}
                phone={phone}
                setPhone={setPhone}
                canUpdate={canUpdate}
                loading={loading}
                handleUpdate={handleUpdate}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
