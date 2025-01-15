import React from "react";
import { emptyCart, getCart } from "../../api/cart";
import { Button, DatePicker, Divider, Form, Input } from "antd";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../api/order";
import { toast } from "react-toastify";
interface FieldType {
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  cardNumber?: string;
  expirationDate?: string;
  cvv?: string;
}
function CartPage() {
  const [cart, setCart] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await getCart();
        console.log(cart);
        setIsLoading(false);
        setCart(cart);
      } catch (e: any) {
        console.log(e.message);
      }
    };

    fetchCart();
  }, []);

  const handleEmptyCart = async () => {
    try {
      const response = await emptyCart();
      console.log(response);

      if (response) {
        setCart(null);
      }

      toast.success("Cart emptied");
    } catch (e: any) {
      toast.error("Please try again later!");
    }
  };

  const handlePlaceOrder = async (values: FieldType) => {
    try {
      const orderData = {
        userId: JSON.parse(localStorage.getItem("user") as string).user._id,
        email: values.email,
        address: `${values.address}, ${values.city}, ${values.country}`,
        postal_code: values.postalCode,
        cardNumber: values.cardNumber,
        expiryDate: values.expirationDate,
        cvv: values.cvv,
      };

      const response = await createOrder(orderData);
      console.log(response);

      if (response) {
        navigate("/success");
      }
    } catch (e: any) {
      toast.error("Failed to place order! Please try again later.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            alignItems: "center",
          }}
        >
          <h1
            style={{
              marginBottom: 20,
            }}
          >
            Your Cart{" "}
            {cart ? `(${cart?.items?.reduce(
              (acc: number, product: any) => acc + product.quantity,
              0
            )})` : "(0)"}
          </h1>

          {cart && cart?.items && (
            <Button variant="solid" color="danger" 
              onClick={handleEmptyCart}
            >
              Empty Cart
            </Button>
          )}
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {cart?.items?.map((product: any) => (
              <div
                key={product._id}
                style={{
                  display: "flex",
                  marginBottom: 20,
                  alignItems: "center",
                  gap: 20,
                  minWidth: 600,
                  // boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                  padding: 20,
                  // borderRadius: 5,
                  borderBottom: "1px solid #ccc",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: 100 }}
                  />
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <h3>{product.name}</h3>
                    <div
                      style={{
                        display: "flex",
                        gap: 20,
                        justifyContent: "space-between",
                      }}
                    >
                      <p>Quantity: {product.quantity}</p>
                      <h3>${product.price}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Total: </h2>
          <h2>
            $
            {cart
              ? cart?.items?.reduce(
                  (acc: number, item: any) => acc + item.price * item.quantity,
                  0
                )
              : 0}
          </h2>
        </div>
      </div>

      <div style={{ width: "50%" }}>
        <h2
          style={{
            marginBottom: 20,
          }}
        >
          Shipping Address
        </h2>
        <Form
          name="placeOrder"
          labelCol={{ span: 4 }}
          autoComplete="off"
          initialValues={{
            email: JSON.parse(localStorage.getItem("user") as string).user
              .email,
          }}
          onFinish={handlePlaceOrder}
        >
          <Form.Item<FieldType> label="Email" name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item<FieldType> name="address" label="Address">
            <Input type="text" />
          </Form.Item>
          <Form.Item<FieldType> name="city" label="City">
            <Input type="text" />
          </Form.Item>
          <Form.Item<FieldType> name="country" label="Country">
            <Input type="text" />
          </Form.Item>
          <Form.Item<FieldType> name="postalCode" label="Postal Code">
            <Input type="text" />
          </Form.Item>
          <Divider />
          <h2
            style={{
              marginBottom: 20,
            }}
          >
            Payment Method
          </h2>
          <Form.Item<FieldType> name="cardNumber" label="Card Number">
            <Input type="text" />
          </Form.Item>

          <Form.Item<FieldType> name="expirationDate" label="Expiration Date">
            <DatePicker
              picker="month"
              style={{ marginRight: 10 }}
              placeholder="Select"
            />
          </Form.Item>
          <Form.Item<FieldType> name="cvv" label="CVV">
            <Input
              type="text"
              style={{
                width: 100,
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              variant="solid"
              color="primary"
              style={{
                borderRadius: 5,
                padding: "24px 24px",
                fontSize: 16,
                display: "flex",
                justifySelf: "center",
              }}
              htmlType="submit"
            >
              Place Order
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default CartPage;
