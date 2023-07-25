import React, { useState } from "react";
import { FingerPrintLogo, LandingButtons, TextInput } from "../components";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

export const LoginPage = () => {
  const [newUser, setNewUser] = useState(false);

  return (
    <div className="mt-6 flex flex-col justify-center items-center gap-5">
      <FingerPrintLogo />
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please put your username!",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please put your password!",
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item className="flex justify-center">
          <Link>
            <a className="" href="">
              Forgot password
            </a>
          </Link>
        </Form.Item>
        <div className="flex flex-col">
          <Button type="default" htmlType="submit">
            Login
          </Button>
          <div className="flex justify-center">
            <Link to="/signuppage">
              <Button type="link">Create Account</Button>
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
};
