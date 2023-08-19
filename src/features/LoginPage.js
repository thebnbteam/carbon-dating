import React, { useState } from "react";
import { FingerPrintLogo } from "../components";
import { Button, Form, Input, Alert } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useUserAuth } from "../context/UserAuthContext";

export const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { logIn, googleSignIn, authNotificationHandler, authNotifications } =
    useUserAuth();

  const signIn = async () => {
    try {
      await logIn(form.getFieldsValue().email, form.getFieldsValue().password);
      authNotificationHandler(
        "success",
        "Success",
        "You have successfully logged in!",
        true
      );
      navigate("/profilepage");
    } catch (err) {
      authNotificationHandler("error", "Error", err.message);
    }
  };

  return (
    <div className="mt-6 flex flex-col justify-center items-center gap-5">
      <FingerPrintLogo />
      <h2 className="text-center">carbon</h2>
      <h2 className="text-center">dating</h2>
      {authNotifications.type === "error" ? (
        <Alert
          type={authNotifications.type}
          message={authNotifications.message}
          description={authNotifications.description}
          showIcon
          closable
          style={{
            margin: 10,
          }}
        />
      ) : null}
      <Form
        form={form}
        name="normal_login"
        className="login-form"
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please put your email!",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" type="email" />
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
          <Button
            type="default"
            htmlType="submit"
            onClick={() => {
              signIn();
            }}
          >
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
