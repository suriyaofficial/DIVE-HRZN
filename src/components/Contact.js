import React from "react";
import { Row, Col, Input, Button, Form } from "antd";

const Contact = () => {
  const onFinish = (values) => {
    // You can implement save/contact behavior here (send to email, Firebase, API)
    console.log("contact form", values);
  };

  return (
    // <section id="contact-us" >
      <div style={{ height:"90vh", margin: "0", padding: "50px 40px " ,backgroundColor:"#000000", color:"#ffffff"}}>
        <h2>Contact Us</h2>
        <p>Questions or bookings — drop a message and we'll reply.</p>

        <Form layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Your name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="message" label="Message" rules={[{ required: true }]}>
            <Input.TextArea rows={5} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">Send Message</Button>
          </Form.Item>
        </Form>
      </div>
    // </section>
  );
};

export default Contact;
