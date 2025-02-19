import { Button, Checkbox, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import routes from "../../constants/paths";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import userService from "../../features/services/user.service";
import useUser from "../../hooks/useUser";

type FieldTypes = {
  email: string;
  password: string;
  remember: boolean;
};

function LoginPage() {
  const [isLoggingIn, setLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser()
  const { mutate, isPending, data } = useMutation({
    mutationFn: userService.login
  })
  //  const {data: cart, isLoading: isLoadingCart} = useQuery({
  //     queryKey: ["cart"],
  //     queryFn: () => userService.getUserCart(user?.id),
  //   })

  const handleLogin = async (values: FieldTypes) => {
    try {
      setLoggingIn(true);
      await mutate(values, {
        onSuccess: async (data) => {
          if (data.status === 200) {
            const {data: cartData} = await userService.getUserCart(data.data.user.id)
            if (cartData) {
              const {cart, totalItems} = cartData

              await login({
                ...data.data.user,
                cart: cart.items,
                cartTotal: totalItems
              }) 
            } else {
              await login(data.data.user)
            }
            // await login()
            navigate(routes.PATHS.HOME)
            // console.log(cartData)
          }
        }
      });
      message.success("Login successful");
    } catch (error) {
      toast.error("Error while logging in");
    } finally {
      setLoggingIn(false);
    }
  };


  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold">Welcome! 👋</h1>
        <p className="text-sm text-gray-600">Please sign in to continue.</p>
      </div>

      <Form layout="vertical" onFinish={handleLogin}>
        <Form.Item<FieldTypes>
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            type="email"
            className="w-full border rounded"
            placeholder="Email"
            disabled={isPending}
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
            disabled={isPending}
          />
        </Form.Item>
        <Form.Item<FieldTypes>
          name="remember"
          valuePropName="checked"
          className="flex justify-between w-full"
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full rounded-full font-bold "
          loading={isLoggingIn}
          disabled={isPending}
        >
          Sign in
        </Button>

        <div className="text-right mt-4">
          <Link to={routes.PATHS.FORGOT_PASS} className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <div className="mt-4 text-center">
          <span>Don't have an account?</span>{" "}
          <Link to={routes.PATHS.REGISTER} className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default LoginPage;
