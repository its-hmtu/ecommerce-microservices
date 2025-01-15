import { Button, Checkbox, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../../api/auth";

interface FieldType {
  username?: string;
  email?: string;
  password?: string;
  // rememberMe?: boolean;
}
function RegisterPage() {
  const navigate = useNavigate();
  // const {user, setUser} = React.useContext(UserContext);
  const handleRegister = async (values: FieldType) => {
    try {
      const response = await register(values.email!, values.password!, values.username!)
      if (response) {
        toast.success("Register successful!")
        navigate("/auth/login")
      }
    } catch (e: any) {
      toast.error("Something went wrong! Please try again later.")
    }
  };

  return (
    <div
      style={{
        padding: 20,
        // margin: "0 auto",
        border: "1px solid #ccc",
        borderRadius: 5,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        width: "100%",
      }}
    >
      <h1
        style={{
          textAlign: "center",
        }}
      >
        Register
      </h1>
      <Form
        name="basic"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={handleRegister}
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "50%", margin: "0 auto", display: "block" }}
        >
          Register
        </Button>

        <Link
          to="/auth/login"
          style={{ display: "block", textAlign: "center", marginTop: 10 }}
        >
          Already have an account? Login now!
        </Link>
      </Form>
    </div>
  );
}

export default RegisterPage;
