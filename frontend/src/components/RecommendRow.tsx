import { Card } from "antd";
import React, { useEffect } from "react";
import ProductCard from "./ProductCard";
import { ProductCardTypes } from "../types";
import { useQuery } from "@tanstack/react-query";
import productService from "../features/services/product.service";
import { toast } from "react-toastify";

type Props = {};

function RecommendRow({}: Props) {
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getProducts,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Error while fetching products");
    }
  }, [isError]);
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">You may aslo like</h2>

      <div className="grid grid-cols-5 gap-3">
        {isLoadingProducts || !products
          ? Array.from({ length: 5 }).map((_, index) => (
              <Card
                key={index}
                loading={true}
                style={{
                  width: "250px",
                  height: "300px",
                }}
              >
                <Card.Meta title="Products" />
              </Card>
            ))
          : products?.map((product: ProductCardTypes) => (
              <ProductCard
                key={product._id}
                _id={product._id}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
                loading={isLoadingProducts}
              />
            ))}
      </div>
    </div>
  );
}

export default RecommendRow;
