import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import productService from "../../features/services/product.service";
import { Card, Empty } from "antd";
import ProductCard from "./components/ProductCard";
import { toast } from "react-toastify";
type ProductCardTypes = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

function HomePage() {
  const { data, isError, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: productService.getProducts,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Error while fetching products");
    }
  }, [isError]);

  // if (isError) {
  //   return <div>Error</div>;
  // }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Hot Products</h1>
      <div className="flex flex-wrap xl:gap-4 sm:gap-3">
        {isPending || !data ? (
          Array.from({ length: 10 }).map((_, index) => (
            <Card
              key={index}
              loading={true}
              style={{
                width: "200px",
                height: "200px",
              }}
            >
              <Card.Meta title="Products" />
            </Card>
          ))
        ) : data?.length === 0 ? (
          <Empty className="w-full" />
        ) : (
          data?.map(
            ({ _id, name, description, price, image }: ProductCardTypes) => (
              <ProductCard
                key={_id}
                _id={_id}
                name={name}
                description={description}
                price={price}
                image={image}
                loading={isPending}
              />
            )
          )
        )}
      </div>
    </div>
  );
}

export default HomePage;
