import { Button, Checkbox, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import { toast } from "react-toastify";
import { UserContext } from "../../contexts/UserContext";

interface FieldType {
  email?: string;
  password?: string;
  rememberMe?: boolean;
}

function LoginPage() {
  const navigate = useNavigate();
  // const {user, setUser} = React.useContext(UserContext);
  const handleLogin = async (values: FieldType) => {
    try {
      const response = await login(values.email!, values.password!)
      if (response) {
        toast.success("Login successful!")
        navigate("/")
        localStorage.setItem("user", JSON.stringify(response))
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
        Login
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
        onFinish={handleLogin}
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

        <Form.Item<FieldType>
          name="rememberMe"
          valuePropName="checked"
          label={null}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", margin: "0 auto", display: "block" }}
          >
            Login
          </Button>
        </Form.Item>
        <Link
          to="/auth/register"
          style={{ display: "block", textAlign: "center", marginTop: 10 }}
        >
          Don't have an account? Register now!
        </Link>
      </Form>
    </div>
  );
}

export default LoginPage;
