import React, { useState, useEffect } from "react";
import { Button, Form } from "antd";

export const SubmitButton = ({ form, onSubmit }) => {
  const values = Form.useWatch([], form);
  const [submitStatus, setsubmitStatus] = useState(false);
  useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(
        () => {
          setsubmitStatus(true);
        },
        () => {
          setsubmitStatus(false);
        }
      );
  }, [values]);
  return (
    <Button
      disabled={!submitStatus}
      type="default"
      htmlType="button"
      onClick={() => {
        onSubmit();
      }}
    >
      Register
    </Button>
  );
};
