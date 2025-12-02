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
import { useLocation } from "react-router-dom";
import AuthTabsModal from "./AuthTabsModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyDetails,
  loginWithGoogle,
  updatePhoneNumber,
} from "../services/api";
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
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phone, setPhone] = useState("+91");
  const [pendingUser, setPendingUser] = useState(null); // user from backend without phone
  const queryClient = useQueryClient();
  const accessToken = Cookies.get("token");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const auth = params.get("auth");

    if (auth === "signin") {
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

  const openAuthModal = (mode = "signin") => {
    closeDrawer();
    setAuthModalOpen(true);
  };
  const closeAuthModal = () => setAuthModalOpen(false);

  const loginMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (data) => {
      const userData = data.data;
      const backendToken = data.token; // save this for later

      if (userData.phoneNo) {
        // Has phone — finish login now
        completeLogin(userData, backendToken);
        return;
      }

      // Missing phone: wait for phone update mutation
      setPendingUser({ ...userData, token: backendToken });
      setPhone("+91"); // default prefix
      setAuthModalOpen(false); // close auth tabs modal
      setPhoneModalOpen(true); // open phone modal
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
      completeLogin(updatedUser, updatedUser.token); // finish login flow
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
        expires: 1,
        secure: true,
        sameSite: "Strict",
      });
    }
    message.success("Successfully signed in!");
    setAuthModalOpen(false); // close modal
    setLoading(false);

    // 🔁 Handle redirect back to the page user came from
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");

    if (redirect) {
      navigate(redirect, { replace: true });
    } else {
      // clean up ?auth=signin if present
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

    // Ensure it always starts with +91
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
      token: pendingUser.token, // 👈 use backend token here
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

                {!userDetails ? (
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
                      <Button size="large">
                        <Space>
                          <Avatar src={userDetails?.profileImage}>
                            <UserOutlined />
                          </Avatar>
                          {userDetails?.displayName ||
                            userDetails?.email.split("@")[0]}
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

          {!userDetails ? (
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
                  icon: <UserOutlined />,
                  label: "My Enquiries",
                },
                ...(userDetails?.role === "admin"
                  ? [
                      {
                        key: "admindashboard",
                        icon: <UserOutlined />,
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
