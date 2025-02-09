import React, { useEffect } from "react";
import { ProductCardTypes } from "../../types";
import { toast } from "react-toastify";
import ProductCard from "../../components/ProductCard";
import productService from "../../features/services/product.service";
import { useQuery } from "@tanstack/react-query";
import useUser from "../../hooks/useUser";
import { Routes, useNavigate, useParams } from "react-router-dom";
import { Button, Card, Divider, Empty, Form, Input, Select } from "antd";
import { useSelector } from "react-redux";
import { selectCartTotal } from "../../features/counters/user.slice";
import routes from "../../constants/paths";
import RecommendRow from "../../components/RecommendRow";

type FieldTypes = {
  email: string;
  address: string;
  zipcode: string;
  city: string;
  state: string;
  country: string;
  cardNumber: string;
  month: string;
  year: string;
  cvv: string;
};

function CartPage() {
  const { user } = useUser();
  const cartTotal = useSelector(selectCartTotal);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      navigate(routes.PATHS.LOGIN);
    }
  }, [user, navigate]);

  return (
    <div className="w-full mt-4">
      {user.cart?.length === 0 ? (
        <>
          <Empty className="w-full">
            <p>Your cart is empty.</p>
            <Button
              type="primary"
              className="mt-4"
              onClick={(): void | Promise<void> => navigate(routes.PATHS.HOME)}
            >
              Continue Shopping
            </Button>
          </Empty>
        </>
      ) : (
        <div className="mx-52 flex justify-between">
          <div>
            <h1 className="text-3xl font-semibold flex items-center">
              Your Cart
              <span className="ml-2">({cartTotal})</span>
              <div className="flex ml-6 gap-2">
                <Button
                  variant="outlined"
                  color="danger"
                  className="rounded-full"
                  onClick={(): void | Promise<void> =>
                    navigate(routes.PATHS.HOME)
                  }
                >
                  Clear Cart
                </Button>
                <Button
                  type="primary"
                  className="rounded-full"
                  onClick={(): void | Promise<void> =>
                    navigate(routes.PATHS.HOME)
                  }
                >
                  Continue Shopping
                </Button>
              </div>
            </h1>
            <div className="mt-6 max-w-md">
              {user.cart?.map((item) => (
                <>
                  <div key={item.productId} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-contain"
                      width={150}
                      height={150}
                    />
                    <div
                      className="flex flex-col justify-between gap-2 basis-52"
                      style={{ height: "100px" }}
                    >
                      <div>
                        <h2 className="text-xl font-bold">{item.name}</h2>
                      </div>
                      <div className="flex justify-between items-center">
                        <p>Quantity: {item.quantity}</p>
                        <p className="text-lg">${item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                  <Divider />
                </>
              ))}

              <div className="flex justify-between mt-4">
                <p className="text-xl font-bold">Total:</p>
                <p className="text-xl font-bold">
                  $
                  {user.cart.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="basis-1/2">
            <Form layout="vertical" className="">
              <h1 className="text-2xl font-bold mb-4">Shipping Address</h1>
              <Form.Item<FieldTypes>
                name="email"
                rules={[{ message: "Please input your email!" }]}
                label="Email"
              >
                <Input
                  type="email"
                  className="w-full border rounded"
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item<FieldTypes>
                name="address"
                rules={[{ message: "Please input your address!" }]}
                label="Address"
              >
                <Input
                  type="text"
                  className="w-full border rounded"
                  placeholder="Address"
                />
              </Form.Item>
              <Form.Item<FieldTypes>
                name="zipcode"
                rules={[{ message: "Please input your zip code!" }]}
                label="Zip Code"
              >
                <Input
                  type="text"
                  className="w-full border rounded"
                  placeholder="Zip Code"
                />
              </Form.Item>
              <Form.Item<FieldTypes>
                name="city"
                rules={[{ message: "Please input your city!" }]}
                label="City"
              >
                <Input
                  type="text"
                  className="w-full border rounded"
                  placeholder="City"
                />
              </Form.Item>
              <div className="flex gap-2">
                <Form.Item<FieldTypes>
                  name="state"
                  rules={[{ message: "Please input your state!" }]}
                  label="State"
                  className="w-1/2"
                >
                  <Input
                    type="text"
                    className="w-full border rounded"
                    placeholder="State"
                  />
                </Form.Item>
                <Form.Item<FieldTypes>
                  name="country"
                  rules={[{ message: "Please input your country!" }]}
                  label="Country"
                  className="w-1/2"
                >
                  <Input
                    type="text"
                    className="w-full border rounded"
                    placeholder="Country"
                  />
                </Form.Item>
              </div>
              <h1 className="text-2xl font-bold mb-4">Payment Method</h1>
              <Form.Item<FieldTypes>
                name="cardNumber"
                rules={[{ message: "Please input your card number!" }]}
              >
                <Input
                  type="text"
                  className="w-full border rounded"
                  placeholder="Credit Card Number"
                />
              </Form.Item>
              <div className="flex gap-2 mb-4">
                <Select
                  className="w-1/2"
                  // onChange={handleChange}
                  options={[
                    { label: "January", value: "01" },
                    { label: "February", value: "02" },
                    { label: "March", value: "03" },
                    { label: "April", value: "04" },
                    { label: "May", value: "05" },
                    { label: "June", value: "06" },
                    { label: "July", value: "07" },
                    { label: "August", value: "08" },
                    { label: "September", value: "09" },
                    { label: "October", value: "10" },
                    { label: "November", value: "11" },
                    { label: "December", value: "12" },
                  ]}
                  placeholder="Month"
                />
                <Select
                  className="w-1/2"
                  // onChange={handleChange}
                  placeholder="Year"
                  options={[
                    { label: "2021", value: "2021" },
                    { label: "2022", value: "2022" },
                    { label: "2023", value: "2023" },
                    { label: "2024", value: "2024" },
                    { label: "2025", value: "2025" },
                    { label: "2026", value: "2026" },
                    { label: "2027", value: "2027" },
                    { label: "2028", value: "2028" },
                    { label: "2029", value: "2029" },
                    { label: "2030", value: "2030" },
                  ]}
                />
              </div>
              <Form.Item<FieldTypes>
                name="cvv"
                rules={[{ message: "Please input your cvv!" }]}
                className="w-1/2"
              >
                <Input
                  type="text"
                  className="w-full border rounded"
                  placeholder="CVV"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className=" rounded-full font-bold flex justify-self-center"
                // loading={isLoggingIn}
                // disabled={isPending}
              >
                Place Order
              </Button>
            </Form>
          </div>
        </div>
      )}
      <Divider />
      <RecommendRow />
    </div>
  );
}

export default CartPage;
