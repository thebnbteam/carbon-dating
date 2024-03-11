import React, { useState } from "react";
import { Form, Input, Checkbox, Button } from "antd";
import { SubmitButton, FingerPrintLogo } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { signUp, authNotificationHandler } = useUserAuth();

  const signIn = async () => {
    try {
      await signUp(form.getFieldsValue().email, form.getFieldsValue().password);
      authNotificationHandler(
        "success",
        "Success",
        "You have successfully signed up!"
      );
      navigate("/calibratelandingpage");
    } catch (err) {
      authNotificationHandler("error", "Error", err.message);
    }
  };

  return (
    <div className="mt-6 flex flex-col justify-center items-center gap-5">
      <FingerPrintLogo />
      <h2 className="text-center">carbon</h2>
      <h2 className="text-center">dating</h2>
      <Form form={form} name="validateOnly">
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Your password needs to be more than 6 characters",
              min: 6,
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          className="flex justify-center"
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Should accept agreement")),
            },
          ]}
        >
          <Checkbox>
            I have read the <a href="">agreement</a>
          </Checkbox>
        </Form.Item>
        <Form.Item className="flex justify-center">
          <SubmitButton form={form} onSubmit={signIn} />
        </Form.Item>
      </Form>
      <Link to="/loginpage">
        <Button type="default">Back to login</Button>
      </Link>
    </div>
  );
};
