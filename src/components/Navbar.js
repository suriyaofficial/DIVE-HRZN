import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../firebaseconfig";
import {
  Row,
  Col,
  Button,
  Drawer,
  Divider,
  Modal,
  Form,
  Input,
  message,
  Avatar,
  Dropdown,
  Menu,
  Space,
  Grid,
  Select,
  Tabs,
} from "antd";
import {
  MenuOutlined,
  LogoutOutlined,
  UserOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import {
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { useLocation } from "react-router-dom";
import AuthTabsModal from "./AuthTabsModal";
import { useMutation } from "@tanstack/react-query";
import { getMyDetails, loginWithGoogle } from "../services/api";
import { useQuery } from "@tanstack/react-query";

const { useBreakpoint } = Grid;

const Navbar = () => {
  const location = useLocation();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return Cookies.get("user");
    } catch {
      return null;
    }
  });

  const { data: userDetails } = useQuery({
    queryKey: ["myDetails"],
    queryFn: async () => {
      const response = await getMyDetails(user);
      return response.data;
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const openAuthModal = (mode = "signin") => {
    closeDrawer();
    setAuthModalOpen(true);
  };
  const closeAuthModal = () => setAuthModalOpen(false);

  const loginMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (data) => {
      const userData = data.data;
      completeLogin(userData.email);
    },
    onError: (error) => {
      console.error("Login failed", error);
      message.error(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
      setLoading(false);
    },
  });

  const completeLogin = (userData) => {
    Cookies.set("user", userData, {
      expires: 1, // 1 day
      secure: true,
      sameSite: "Strict",
    });
    setUser(userData);
    message.success("Successfully signed in!");
    closeAuthModal();
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, provider);
      const u = res.user; // Firebase user
      const names = u.displayName ? u.displayName.split(" ") : ["", ""];
      const firstName = names[0];
      const lastName = names.slice(1).join(" ") || "";

      const payload = {
        email: u.email,
        firstName: firstName,
        lastName: lastName,
        profileImage: u.profileImage,
      };

      loginMutation.mutate(payload);
    } catch (err) {
      console.error(err);
      message.error(err.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn(e);
    }
    Cookies.remove("user");
    setUser(null);
    message.success("Logged out");
    navigate("/");
    window.location.reload();
  };
  const goto = (path) => {
    navigate(path);
    closeDrawer();
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate("/profile")}>
        <UserOutlined /> Profile
      </Menu.Item>
      <Menu.Item key="myEnquiries" onClick={() => navigate("/my-enquiries")}>
        <UserOutlined /> My enquiries
      </Menu.Item>
      <Menu.Item key="logout" onClick={logout}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  const navItems = [
    { label: "Home", action: () => navigate("/") },
    { label: "Scuba", action: () => navigate("/scuba") },
    { label: "Skydive", action: () => navigate("/skydive"), disabled: true },
    { label: "About", action: () => navigate("/about") },
  ];

  const isMobile = !screens.md;

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <Row
          align="middle"
          justify="space-between"
          style={{ padding: "8px 16px", maxWidth: 1200, margin: "0 auto" }}
        >
          <Col>
            <Link to="/" style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/logo192.png"
                alt="logo"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  marginRight: 8,
                }}
              />
              <div style={{ fontWeight: 700, fontSize: 18 }}>Dive Hrzn</div>
            </Link>
          </Col>

          <Col>
            {isMobile ? (
              <Button
                type="default"
                icon={<MenuOutlined />}
                onClick={openDrawer}
              />
            ) : (
              <Row align="middle" gutter={16}>
                {navItems.map((it) => (
                  <Col key={it.label}>
                    <Button
                      type="text"
                      disabled={it.disabled}
                      onClick={it.action}
                    >
                      {it.label}
                    </Button>
                  </Col>
                ))}

                {!user ? (
                  <>
                    <Col>
                      <Button onClick={() => openAuthModal("signin")}>
                        Sign In
                      </Button>
                    </Col>
                  </>
                ) : (
                  <Col>
                    <Dropdown overlay={profileMenu} placement="bottomRight">
                      <Button>
                        <Space>
                          <Avatar src={userDetails?.profileImage} />
                          {userDetails?.displayName || userDetails?.email}
                        </Space>
                      </Button>
                    </Dropdown>
                  </Col>
                )}
              </Row>
            )}
          </Col>
        </Row>
      </div>

      <Drawer
        title="Menu"
        placement="left"
        onClose={closeDrawer}
        open={drawerOpen}
        bodyStyle={{ padding: 0 }}
      >
        <Divider style={{ margin: 0 }} />

        <div style={{ padding: "16px" }}>
          {/* MENU ITEMS */}
          <Menu
            selectedKeys={[location.pathname]}
            mode="inline"
            style={{ borderRight: 0, fontSize: "16px" }}
            onClick={({ key }) => {
              if (key === "profile") return navigate("/profile");
              if (key === "logout") return logout();
              goto(key);
              closeDrawer();
            }}
            items={[
              {
                key: "/",
                label: "Home",
              },
              {
                key: "/scuba",
                label: "Scuba",
              },
              {
                key: "/skydive",
                disabled: true,
                label: "Skydive",
              },
              {
                key: "/about",
                label: "About",
              },
            ]}
          />

          <Divider />

          {!user ? (
            <Button
              block
              type="primary"
              icon={<GoogleOutlined />}
              size="large"
              onClick={() => openAuthModal("signin")}
            >
              Sign In / Sign Up
            </Button>
          ) : (
            <Menu
              mode="inline"
              style={{ borderRight: 0, marginTop: 10 }}
              onClick={({ key }) => {
                if (key === "profile") {
                  navigate("/profile");
                  closeDrawer();
                }
                if (key === "myEnquiries") {
                  navigate("/my-enquiries");
                  closeDrawer();
                }
                if (key === "logout") {
                  logout();
                  closeDrawer();
                }
              }}
              items={[
                {
                  key: "profile",
                  icon: <UserOutlined />,
                  label: "My Profile",
                },
                {
                  key: "myEnquiries",
                  icon: <UserOutlined />,
                  label: "My Enquiries",
                },
                {
                  key: "logout",
                  icon: <LogoutOutlined style={{ color: "red" }} />,
                  label: <span style={{ color: "red" }}>Logout</span>,
                },
              ]}
            />
          )}
        </div>
      </Drawer>
      <AuthTabsModal
        visible={authModalOpen}
        onClose={closeAuthModal}
        loading={loading}
        handleGoogleSignIn={handleGoogleSignIn}
      />
    </>
  );
};

export default Navbar;
