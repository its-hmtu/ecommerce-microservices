import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import routes from "../../constants/paths";

type FieldTypes = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const validate = (values: FieldTypes) => {
  const errors: Partial<FieldTypes> = {};

  if (!values.email) {
    errors.email = "Email is required";
  }

  if (!values.username) {
    errors.username = "Username is required";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm Password is required";
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Password and Confirm Password must match";
  }

  return errors;
};

function RegisterPage(): JSX.Element {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold">Welcome! 👋</h1>
        <p className="text-sm text-gray-600">Let's sign up your account!</p>
      </div>

      <Form layout="vertical" >
        <Form.Item<FieldTypes>
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            type="email"
            className="w-full border rounded"
            placeholder="Email"
            // disabled={isLoggingIn}
          />
        </Form.Item>
        <Form.Item<FieldTypes>
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input
            type="text"
            className="w-full border rounded"
            placeholder="Username"
            // disabled={isLoggingIn}
          />
        </Form.Item>
        <Form.Item<FieldTypes>
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            type="password"
            className="w-full border rounded"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item<FieldTypes>
          name="confirmPassword"
          rules={[
            { required: true, message: "Please input your confirm password!" },
          ]}
        >
          <Input.Password
            type="password"
            className="w-full border rounded"
            placeholder="Confirm Password"
            // disabled={isLoggingIn}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          className="w-full rounded-full font-bold"
          // loading={isLoggingIn}
        >
          Register
        </Button>

        <div className="mt-4 text-center">
          <span>Aleadry have an account?</span>{" "}
          <Link
            to={routes.PATHS.LOGIN}
            className="text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default RegisterPage;
