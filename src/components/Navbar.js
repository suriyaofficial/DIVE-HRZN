import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { app } from "../firebaseconfig";
import {
  Row,
  Col,
  Button,
  Drawer,
  Divider,
  Modal,
  Input,
  message,
  Avatar,
  Dropdown,
  Menu,
  Space,
  Grid,
} from "antd";
import {
  MenuOutlined,
  LogoutOutlined,
  UserOutlined,
  GoogleOutlined,
  PhoneOutlined,
  FileSearchOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import {
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import AuthTabsModal from "./AuthTabsModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyDetails,
  loginWithGoogle,
  updatePhoneNumber,
} from "../services/api";
import divehrznLogo from "../divehrzn.svg";

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
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phone, setPhone] = useState("+91");
  const [pendingUser, setPendingUser] = useState(null);
  const queryClient = useQueryClient();
  const accessToken = Cookies.get("token");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const authQuery = params.get("auth");
    if (authQuery === "signin") {
      setAuthModalOpen(true);
    }
  }, [location.search]);

  const { data: userDetails } = useQuery({
    queryKey: ["myDetails"],
    queryFn: async () => {
      const response = await getMyDetails(accessToken);
      return response.data;
    },
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
  });

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const openAuthModal = () => {
    closeDrawer();
    setAuthModalOpen(true);
  };
  const closeAuthModal = () => setAuthModalOpen(false);

  const loginMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (data) => {
      const userData = data.data;
      const backendToken = data.token;

      if (userData.phoneNo) {
        completeLogin(userData, backendToken);
        return;
      }

      setPendingUser({ ...userData, token: backendToken });
      setPhone("+91");
      setAuthModalOpen(false);
      setPhoneModalOpen(true);
      setLoading(false);
    },
    onError: (error) => {
      console.error("Login failed", error);
      message.error(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
      setLoading(false);
    },
  });

  const updatePhoneMutation = useMutation({
    mutationFn: updatePhoneNumber,
    onSuccess: (data, variables) => {
      const updatedUser = {
        ...pendingUser,
        phoneNo: variables.phoneNo,
      };
      setPhoneModalOpen(false);
      setPendingUser(null);
      completeLogin(updatedUser, updatedUser.token);
      queryClient.invalidateQueries(["myDetails"]);
    },
    onError: (error) => {
      console.error("Phone update failed", error);
      message.error(
        "Failed to save phone number: " +
          (error.response?.data?.message || error.message)
      );
      setLoading(false);
    },
  });

  const completeLogin = (userData, token) => {
    if (token) {
      Cookies.set("token", token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
    }
    message.success("Successfully signed in!");
    setAuthModalOpen(false);
    setLoading(false);
    queryClient.invalidateQueries(["myDetails"]);

    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");

    if (redirect) {
      navigate(redirect, { replace: true });
    } else {
      if (params.get("auth")) {
        params.delete("auth");
        navigate(
          {
            pathname: location.pathname,
            search: params.toString(),
          },
          { replace: true }
        );
      }
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;

    if (!value.startsWith("+91")) {
      value = "+91" + value.replace(/^\+?91?/, "");
    }

    if (value.length > 15) {
      value = value.slice(0, 15);
    }

    setPhone(value);
  };

  const handlePhoneSubmit = () => {
    if (!pendingUser) {
      setPhoneModalOpen(false);
      return;
    }

    if (!phone || phone.length < 10) {
      message.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    updatePhoneMutation.mutate({
      phoneNo: phone,
      token: pendingUser.token,
    });
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      loginMutation.mutate(idToken);
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
    Cookies.remove("token");
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
        <FileSearchOutlined /> My Enquiries
      </Menu.Item>

      {userDetails?.role === "admin" && (
        <Menu.Item
          key="admindashboard"
          onClick={() => navigate("/admin/enquiries")}
        >
          <DashboardOutlined /> Admin Dashboard
        </Menu.Item>
      )}

      <Menu.Item key="logout" onClick={logout} danger>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Scuba", path: "/scuba" },
    { label: "Skydive", path: "/skydive", disabled: true },
    { label: "About", path: "/about" },
  ];
  const policiesPaths = ["/terms", "/refund-policy", "/privacy-policy"];

  const isPolicyActive = policiesPaths.includes(location.pathname);

  const policiesMenu = (
    <Menu
      onClick={({ key }) => {
        navigate(key);
      }}
      items={[
        {
          key: "/terms",
          label: "Terms & Conditions",
        },
        {
          key: "/refund-policy",
          label: "Refund Policy",
        },
        {
          key: "/privacy-policy",
          label: "Privacy Policy",
        },
      ]}
    />
  );

  const isMobile = !screens.md;

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* NAV WRAPPER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Row
          align="middle"
          justify="space-between"
          style={{
            padding: "8px 16px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* LEFT: LOGO + BRAND */}
          <Col>
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid #f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fff",
                }}
              >
                <img
                  src={divehrznLogo}
                  alt="logo"
                  style={{
                    width: "80%",
                    height: "80%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1.1,
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: 1.5,
                  }}
                >
                  DIVE HRZN
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "#8c8c8c",
                    textTransform: "uppercase",
                  }}
                >
                  Scuba & Adventure
                </span>
              </div>
            </Link>
          </Col>

          {/* RIGHT: NAV + PROFILE */}
          <Col>
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={openDrawer}
                style={{
                  borderRadius: 999,
                  border: "1px solid #e8e8e8",
                  width: 40,
                  height: 40,
                }}
              />
            ) : (
              <Row align="middle" gutter={12} wrap={false}>
                {/* NAV LINKS */}
                <Col>
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      padding: "4px 6px",
                      borderRadius: 999,
                      background: "#fafafa",
                    }}
                  >
                    {navItems.map((it) => (
                      <Button
                        key={it.label}
                        type="text"
                        disabled={it.disabled}
                        onClick={() => navigate(it.path)}
                        style={{
                          borderRadius: 999,
                          padding: "4px 12px",
                          fontSize: 13,
                          fontWeight: isActive(it.path) ? 600 : 400,
                          background: isActive(it.path)
                            ? "#ffffff"
                            : "transparent",
                          boxShadow: isActive(it.path)
                            ? "0 0 0 1px #e6f4ff"
                            : "none",
                        }}
                      >
                        {it.label}
                      </Button>
                    ))}
                    {/* Policies dropdown */}
                    <Dropdown
                      overlay={policiesMenu}
                      trigger={["hover", "click"]}
                    >
                      <Button
                        type="text"
                        style={{
                          borderRadius: 999,
                          padding: "4px 12px",
                          fontSize: 13,
                          fontWeight: isPolicyActive ? 600 : 400,
                          background: isPolicyActive
                            ? "#ffffff"
                            : "transparent",
                          boxShadow: isPolicyActive
                            ? "0 0 0 1px #e6f4ff"
                            : "none",
                        }}
                      >
                        Policies
                      </Button>
                    </Dropdown>
                  </div>
                </Col>

                {/* AUTH / PROFILE */}
                <Col>
                  {!accessToken ? (
                    <Button
                      // type="primary"
                      color="black"
                      onClick={openAuthModal}
                      style={{
                        borderRadius: 999,
                        padding: "0 18px",
                        height: 36,
                        fontWeight: 500,
                      }}
                    >
                      Sign In
                    </Button>
                  ) : (
                    <Dropdown overlay={profileMenu} placement="bottomRight">
                      <Button
                        style={{
                          borderRadius: 999,
                          padding: "0 12px",
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Avatar
                          size={24}
                          src={userDetails?.profileImage}
                          style={{ backgroundColor: "#e6f4ff" }}
                        >
                          <UserOutlined />
                        </Avatar>
                        <span
                          style={{
                            maxWidth: 140,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: 13,
                          }}
                        >
                          {userDetails?.displayName ||
                            userDetails?.email?.split("@")[0]}
                        </span>
                      </Button>
                    </Dropdown>
                  )}
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </div>

      {/* MOBILE DRAWER */}
      <Drawer
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <img
              src={divehrznLogo}
              alt="logo"
              style={{ width: 28, height: 28, borderRadius: 8 }}
            />
            <span style={{ fontWeight: 600 }}>DIVE HRZN</span>
          </div>
        }
        placement="left"
        onClose={closeDrawer}
        open={drawerOpen}
        styles={{ body: { padding: 0 } }}
      >
        <Divider style={{ margin: 0 }} />

        <div style={{ padding: "12px 16px" }}>
          <Menu
            selectedKeys={[location.pathname]}
            mode="inline"
            style={{ borderRight: 0, fontSize: 15 }}
            onClick={({ key }) => {
              if (key === "profile") return navigate("/profile");
              if (key === "logout") return logout();
              goto(key);
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
              {
                key: "policies",
                label: "Policies",
                children: [
                  {
                    key: "/terms",
                    label: "Terms & Conditions",
                  },
                  {
                    key: "/refund-policy",
                    label: "Refund Policy",
                  },
                  {
                    key: "/privacy-policy",
                    label: "Privacy Policy",
                  },
                ],
              },
            ]}
          />

          <Divider />

          {!accessToken ? (
            <Button
              block
              // type="primary"
              color="black"
              icon={<GoogleOutlined />}
              size="large"
              onClick={openAuthModal}
              style={{ borderRadius: 999 }}
            >
              Sign In
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
                if (key === "admindashboard") {
                  navigate("/admin/enquiries");
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
                  icon: <FileSearchOutlined />,
                  label: "My Enquiries",
                },
                ...(userDetails?.role === "admin"
                  ? [
                      {
                        key: "admindashboard",
                        icon: <DashboardOutlined />,
                        label: "Admin Dashboard",
                      },
                    ]
                  : []),
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

      {/* PHONE MODAL */}
      <Modal
        title="Add your phone number"
        open={phoneModalOpen}
        onOk={handlePhoneSubmit}
        maskClosable={false}
        onCancel={() => {
          setPhoneModalOpen(false);
          setPendingUser(null);
          setLoading(false);
          Cookies.remove("token");
        }}
        confirmLoading={updatePhoneMutation.isPending || loading}
        okText="Continue"
      >
        <p style={{ marginBottom: 8 }}>
          Please add your phone number to complete sign in.
        </p>
        <Input
          prefix={<PhoneOutlined />}
          placeholder="Enter phone number"
          value={phone}
          onChange={handlePhoneChange}
          maxLength={15}
        />
      </Modal>

      {/* AUTH MODAL */}
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
