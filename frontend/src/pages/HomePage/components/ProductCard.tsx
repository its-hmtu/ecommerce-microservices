import { Card } from "antd";
import React from "react";

type PropsType = {
  _id?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
};

function ProductCard({ _id, name, description, price, image }: PropsType) {
  return (
    <Card hoverable>
      <img
        src={image}
        alt={name}
        style={{
          width: "200px",
          height: "200px",
          objectFit: "fill",
          marginBottom: 10,
        }}
      />
      <Card.Meta title={name} description={description} />

      <div className="flex justify-between items-center mt-2">
        <span className="font-bold text-lg">${price}</span>

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
          Add to Cart
        </button>
      </div>
    </Card>
  );
}

export default ProductCard;
