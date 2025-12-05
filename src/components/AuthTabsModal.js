import { Modal, Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";

const AuthTabsModal = ({ visible, onClose, loading, handleGoogleSignIn }) => {
  const modalWidth = 360;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={modalWidth}
      styles={{
        body: {
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: 20,
        },
      }}
      centered
      destroyOnHidden
      closable
    >
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 20 }}>Dive Hrzn</div>
          <div style={{ color: "#888", fontSize: 14, marginTop: 4 }}>
            Sign in to continue
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <Button
          block
          icon={<GoogleOutlined />}
          onClick={handleGoogleSignIn}
          loading={loading}
          size="large"
          type="primary"
          style={{ height: 48, fontSize: 16 }}
        >
          Continue with Google
        </Button>
      </div>
    </Modal>
  );
};

export default AuthTabsModal;
