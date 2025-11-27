import React from 'react'
import { Row, Col, Form, Input, Button } from 'antd'
import { MailOutlined, PhoneOutlined } from '@ant-design/icons'

function PersonalDetailsForm({
  form,
  userDetails,
  phone,
  setPhone,
  canUpdate,
  loading,
  handleUpdate,
}) {
  return (
    <Row gutter={[24, 24]} style={{ padding: 8, paddingTop: 0 }}>
      

      <Col xs={24}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ email: userDetails?.email }}
        >
          <Row gutter={16} >
            <Col xs={12} sm={12}>
              <Form.Item label="First name">
                <Input value={userDetails?.firstName} disabled={userDetails?.firstName} />
              </Form.Item>
            </Col>

            <Col xs={12} sm={12}>
              <Form.Item label="Last name">
                <Input value={userDetails?.lastName} disabled={userDetails?.lastName} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Email">
                <Input
                  prefix={<MailOutlined />}
                  value={userDetails?.email}
                  disabled
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={20}>
              <Form.Item label="Phone number">
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Enter phone number"
                  value={phone || userDetails?.phoneNo}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={15}
                />
                <div className="text-xs mt-1 text-gray-500">
                  Leave blank to keep empty. Use digits only (7-15 chars).
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} sm={16}  >
              <Button
                block
                type="primary"
                onClick={handleUpdate}
                disabled={!canUpdate || loading}
                loading={loading}
              >
                Update number
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}

export default PersonalDetailsForm
