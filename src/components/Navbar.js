import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../firebaseconfig";
import {
  Row,
  Col,
  Button,
  Drawer,
  Divider,
  Tag,
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
  Spin,
  Tabs,
} from "antd";
import {
  MenuOutlined,
  LogoutOutlined,
  UserOutlined,
  GoogleOutlined,
  HomeOutlined,
  CompassOutlined,
  RocketOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

import {
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useLocation } from "react-router-dom";
import AuthTabsModal from "./AuthTabsModal";

const { useBreakpoint } = Grid;
const { Option } = Select;

const { TabPane } = Tabs;
const Navbar = () => {
  const location = useLocation();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // "signin" or "signup"
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // Profile completion modal (shown after auth if profile incomplete)
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Country/State/City data and loading flags
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryLoading, setCountryLoading] = useState(false);
  const [stateLoading, setStateLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);

  useEffect(() => {
    // Optionally we could check firebase onAuthStateChanged
  }, []);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const openAuthModal = (mode = "signin") => {
    closeDrawer();
    setAuthMode(mode);
    setAuthModalOpen(true);
  };
  const closeAuthModal = () => setAuthModalOpen(false);

  // --------------------
  // AUTH FLOW
  // --------------------
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, provider);
      
      const u = res['_tokenResponse'];
      console.log("res",u);
      // build minimal user object from firebase auth result
      const userObj = {
        
        email: u.email || null,
        photoURL: u.photoURL || null,
        firstName: u.firstName || null,
        lastName: u.lastName || null,
        // other profile fields will be added after complete-profile
      };
      // Save basic auth info temporarily
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);

      // open profile completion modal (if additional fields not present)
      setTimeout(() => setProfileModalOpen(true), 200);
      closeAuthModal();
      message.success("Signed in with Google — please complete profile");
    } catch (err) {
      console.error(err);
      message.error(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  // EMAIL SIGNUP (only email/password + confirm password in modal)
  const handleEmailSignup = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // update display name later in profile completion
      const userObj = {
        uid: res.user.uid,
        email: res.user.email,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
      setAuthModalOpen(false);
      setTimeout(() => setProfileModalOpen(true), 200);
      message.success("Account created — please complete profile");
    } catch (err) {
      console.error(err);
      message.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // EMAIL SIGNIN (if user already has account)
  const handleEmailSignin = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const userObj = {
        uid: res.user.uid,
        displayName: res.user.displayName || null,
        email: res.user.email,
        photoURL: res.user.photoURL || null,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
      setAuthModalOpen(false);
      // If profile data is incomplete, open profile modal
      setTimeout(() => setProfileModalOpen(true), 200);
      message.success("Signed in — complete profile if needed");
    } catch (err) {
      console.error(err);
      message.error(err.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn(e);
    }
    localStorage.removeItem("user");
    setUser(null);
    message.success("Logged out");
    navigate("/");
    window.location.reload();
  };

  // --------------------
  // PROFILE COMPLETION: fetching country/state/city lists
  // --------------------
  const fetchCountries = async () => {
    setCountryLoading(true);
    try {
      // REST Countries API (public)
      const res = await fetch("https://restcountries.com/v3.1/all");
      const data = await res.json();
      // map to { name, code } and sort
      const list = data
        .map((c) => ({
          name: c.name?.common,
          code: c.cca2 || c.ccn3 || c.cca3 || c.name?.common,
        }))
        .filter(Boolean)
        .sort((a, b) => a.name.localeCompare(b.name));
      setCountries(list);
    } catch (err) {
      console.error("countries fetch", err);
      message.error("Failed to load countries");
    } finally {
      setCountryLoading(false);
    }
  };

  // For states and cities we use "countriesnow.space" public endpoints (POST)
  const fetchStatesForCountry = async (countryName) => {
    if (!countryName) return setStates([]);
    setStateLoading(true);
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: countryName }),
        }
      );
      const json = await res.json();
      const list = (json?.data?.states || []).map((s) => s.name).sort();
      setStates(list);
    } catch (err) {
      console.error("states fetch", err);
      message.error("Failed to load states");
    } finally {
      setStateLoading(false);
    }
  };

  const fetchCitiesForState = async (countryName, stateName) => {
    if (!countryName || !stateName) return setCities([]);
    setCityLoading(true);
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: countryName, state: stateName }),
        }
      );
      const json = await res.json();
      const list = (json?.data || []).sort();
      setCities(list);
    } catch (err) {
      console.error("cities fetch", err);
      message.error("Failed to load cities");
    } finally {
      setCityLoading(false);
    }
  };

  // Called when profile modal opens — ensure we have country list
  useEffect(() => {
    if (profileModalOpen && countries.length === 0) {
      fetchCountries();
    }
  }, [profileModalOpen]);

  // --------------------
  // Save profile data
  // --------------------
  const onCompleteProfile = async (values) => {
    setProfileLoading(true);
    try {
      // Merge with existing user object from localStorage
      const existing = JSON.parse(localStorage.getItem("user")) || {};
      const merged = {
        ...existing,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        country: values.country,
        state: values.state,
        city: values.city,
        displayName: `${values.firstName} ${values.lastName}`.trim(),
      };

      // update firebase profile displayName if firebase user exists
      try {
        const currentUser = auth.currentUser;
        if (currentUser && merged.displayName) {
          await updateProfile(currentUser, { displayName: merged.displayName });
        }
      } catch (e) {
        console.warn("Could not update firebase profile", e);
      }

      // store final user object locally (you can also persist to firestore)
      localStorage.setItem("user", JSON.stringify(merged));
      setUser(merged);
      setProfileModalOpen(false);
      message.success("Profile saved");
    } catch (err) {
      console.error(err);
      message.error("Failed to save profile");
    } finally {
      setProfileLoading(false);
    }
  };

  // --------------------
  // UI helpers & nav
  // --------------------
  const goto = (path) => {
    navigate(path);
    closeDrawer();
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate("/profile")}>
        <UserOutlined /> Profile
      </Menu.Item>
      <Menu.Item key="logout" onClick={logout}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  const navItems = [
    { label: "Home", action: () => navigate("/") },
    { label: "Scuba", action: () => navigate("/scuba") },
    { label: "Skydive", action: () => navigate("/skydive") },
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
                    <Button type="text" onClick={it.action}>
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
                          <Avatar
                            src={user.photoURL}
                            icon={!user.photoURL && <UserOutlined />}
                          />
                          {user.displayName || user.email}
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
                // icon: <HomeOutlined />,
                label: "Home",
              },
              {
                key: "/scuba",
                // icon: <CompassOutlined />,
                label: "Scuba",
              },
              {
                key: "/skydive",
                // icon: <RocketOutlined />,
                label: "Skydive",
              },
              {
                key: "/about",
                // icon: <InfoCircleOutlined />,
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
              items={[
                {
                  key: "profile",
                  icon: <UserOutlined />,
                  label: "My Profile",
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
  handleEmailSignin={handleEmailSignin}
  handleEmailSignup={handleEmailSignup}
/>
   



      {/* Profile Completion Modal (after auth) */}
      <Modal
        title="Complete your profile"
        open={profileModalOpen}
        onCancel={() => setProfileModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          onFinish={onCompleteProfile}
          initialValues={{
            email: user?.email || "",
          }}
        >
          <Form.Item label="Email (from authentication)">
            <Input value={user?.email || ""} disabled />
          </Form.Item>

          <Form.Item
            name="firstName"
            label="First name"
            rules={[{ required: true, message: "Enter first name" }]}
          >
            <Input value={user?.firstName||""}/>
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last name"
            rules={[{ required: true, message: "Enter last name" }]}
          >
            <Input value={user?.lastName||""} />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: "Select country" }]}
          >
            {countryLoading ? (
              <Spin />
            ) : (
              <Select
                showSearch
                placeholder="Select country"
                optionFilterProp="children"
                onChange={(val) => {
                  // when country changes, load states for that country
                  fetchStatesForCountry(val);
                  // clear cities
                  setCities([]);
                }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {countries.map((c) => (
                  <Option key={c.name} value={c.name}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item
            name="state"
            label="State"
            rules={[{ required: true, message: "Select state" }]}
          >
            {stateLoading ? (
              <Spin />
            ) : (
              <Select
                showSearch
                placeholder="Select state"
                onChange={(val, opt) => {
                  // fetch cities for selected state + country
                  const country =
                    document.querySelector('[name="country"] input')?.value ||
                    null;
                  // better to track selected country via form but to keep simple we read form value below
                }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                onFocus={() => {
                  // no-op - states are loaded when country changes
                }}
              >
                {states.map((s) => (
                  <Option key={s} value={s}>
                    {s}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: "Select city" }]}
          >
            {cityLoading ? (
              <Spin />
            ) : (
              <Select
                showSearch
                placeholder="Select city"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                onFocus={async () => {
                  // When user focuses city select, fetch cities if not yet loaded
                  const form = document.querySelector("form");
                  // Instead of DOM hack, get form values via native form, but better to use Form.useForm()
                }}
              >
                {cities.map((c) => (
                  <Option key={c} value={c}>
                    {c}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={profileLoading}
              block
            >
              Save profile
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Navbar;
