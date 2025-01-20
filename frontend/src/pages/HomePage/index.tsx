import { useQuery } from "@tanstack/react-query";
import React from "react";
import productService from "../../features/services/product.service";
import { Empty } from "antd";
import ProductCard from "./components/ProductCard";

function HomePage() {
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: productService.getProducts,
  });

  if (data?.length === 0) {
    <Empty />;
  }

  return (
    <div className="">
      <div className="flex flex-wrap gap-3">
        {data?.map(
          ({
            _id,
            name,
            description,
            price,
            image,
          }: {
            _id: string;
            name: string;
            description: string;
            price: number;
            image: string;
          }) => (
            <ProductCard
              key={_id}
              _id={_id}
              name={name}
              description={description}
              price={price}
              image={image}
            />
          )
        )}
      </div>
    </div>
  );
}

export default HomePage;
