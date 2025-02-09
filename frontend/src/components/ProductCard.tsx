import { Button, Card, Modal } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

type PropsType = {
  _id?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  loading?: boolean;
  isLoggedIn?: boolean;
};

function ProductCard({
  _id,
  name,
  description,
  price,
  image,
  loading,
  isLoggedIn = false,
}: PropsType) {
  const navigate = useNavigate();
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      Modal.info({
        title: "Login Required",
        content: "Please login to add products to cart",
        closable: true,
        footer: (_) => (
          <>
            <Button
              type="link"
              onClick={() => {
                Modal.destroyAll();
                navigate("/register");
              }}
            >
              Register
            </Button>
            <Button
              type="primary"
              onClick={() => {
                Modal.destroyAll();
                navigate("/login");
              }}
            >
              Sign in
            </Button>
          </>
        ),
      });
    }
  };

  return (
    <Card
      hoverable
      loading={loading}
      style={{
        maxWidth: "275px",
      }}
    >
      <div
        onClick={() => navigate(`/products/${_id}`)}
        className="flex flex-col"
        style={{
          height: "300px",
        }}
      >
        <img
          src={image}
          alt={name}
          style={{
            width: "200px",
            height: "200px",
            objectFit: "fill",
            marginBottom: 10,
            margin: "auto",
          }}
        />
        <Card.Meta 
          title={name} 
          // description={description} 
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="font-bold text-lg mt-2 block">${price}</span>
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => navigate(`/products/${_id}`)}
        >
          Details
        </Button>
      </div>
    </Card>
  );
}

export default ProductCard;
