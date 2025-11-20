import React, { useState } from "react";
import { app } from "../firebaseconfig";

import { Link } from "react-router-dom";
// import Drawer from "./DrawerComp";
// import logo from "../assets/navlogo.jpg";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Col, Row, Button, Drawer, Divider, Tag } from "antd";
import {
  DeleteTwoTone,
  FileImageTwoTone,
  LockTwoTone,
  MenuOutlined,
  SoundTwoTone,
  StarTwoTone,
} from "@ant-design/icons";

const Navbar = () => {
  const auth = getAuth(app);
  let navigate = useNavigate();
  const [value, setValue] = useState();
  const [open, setOpen] = useState(false);
  let userData = JSON.parse(localStorage.getItem("user"));
  console.log(
    "🚀 ~ file: Navbar.js:18 ~ Navbar ~ userData:"
    // JSON.parse(userData)
  );

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const menu = (e) => {
    // console.log("🚀 ~ file: Navbar.js:42 ~ routeMenu ~ e:", e.target.value);
    navigate(`/wander/${e}`);
    setOpen(false);
  };

  const logout = async () => {
    try {
      let result = await signOut(auth);
      await localStorage.clear();
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log("🚀 ~ file: Navbar.js:28 ~ logout ~ error:", error);
    }
  };

  return (
    <>
      <Row>
        <Col className="gutter-row">
          <Button size={"large"} type="primary" onClick={showDrawer}>
            <MenuOutlined />
          </Button>
        </Col>
      </Row>

      <Drawer title="Menu" onClose={onClose} open={open}>
        <Tag
          color="processing"
          style={{
            display: "flex",
            justifyContent: "center",
            textTransform: "capitalize",
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
            fontWeight: "600",
            fontSize: "30px",
          }}
        >
          {userData.wanderer}
        </Tag>
        <Divider />
        <Button
          size="large"
          icon={
            <StarTwoTone
              twoToneColor={"orange"}
              style={{ fontSize: "30px", alignItems: "left" }}
            />
          }
          value="active/wander"
          style={{
            width: "100%",
            marginBottom: "10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            fontWeight: "bolder",
          }}
          onClick={(e) => menu("active/wander")}
        >
          Active Wander
        </Button>
        <br />
        <Button
          size="large"
          icon={<SoundTwoTone style={{ fontSize: "30px" }} />}
          value="invite"
          style={{
            width: "100%",
            marginBottom: "10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            fontWeight: "bolder",
          }}
          onClick={(e) => menu("invite")}
        >
          Wander Invitation
        </Button>
        <br />
        <Button
          size="large"
          icon={<FileImageTwoTone style={{ fontSize: "30px" }} />}
          value="reports"
          style={{
            width: "100%",
            marginBottom: "10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            fontWeight: "bolder",
          }}
          onClick={(e) => menu("reports")}
        >
          Wander Reports
        </Button>
        <br />
        <Button
          size="large"
          icon={
            <LockTwoTone twoToneColor={"red"} style={{ fontSize: "30px" }} />
          }
          value="logout"
          style={{
            width: "100%",
            marginBottom: "10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            fontWeight: "bolder",
          }}
          onClick={logout}
        >
          Logout
        </Button>
        <br />
      </Drawer>
    </>
  );
};

export default Navbar;
