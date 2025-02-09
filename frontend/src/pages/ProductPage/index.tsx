import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import productService from "../../features/services/product.service";
import { Button, Divider, InputNumber } from "antd";
import ProductCard from "../../components/ProductCard";
import { GiConsoleController } from "react-icons/gi";
import useUser from "../../hooks/useUser";
import { toast } from "react-toastify";
import { ProductCardTypes } from "../../types";
import userService from "../../features/services/user.service";

function ProductPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = React.useState<number>(1);
  const {addToCart, user} = useUser();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id!),
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getProducts,
  });

  const { mutate: syncAddToCart, isPending} = useMutation({
    mutationFn: () => userService.updateUserCart(user?.id, user?.cart)
  })

  const handleAddToCart = async () => {
    try {
      await addToCart({
        product,
        quantity
      })
      console.log("user cart", user?.cart)
      await syncAddToCart()
      toast.success("Product added to cart", {
        autoClose: 3000,
      });
    } catch (error: any) {
      toast.error("Error while adding product to cart");
      console.error(error)
    }
  };
  
  return (
    <div className="w-full mt-4">
      <div className="flex justify-between gap-6">
        <img
          src={product?.image}
          alt={product?.name}
          className="w-1/2 object-contain border rounded-md mr-3"
          style={{
            height: "450px", 
          }}
        />
        <div className="w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product?.name}</h1>
          <p className="text-2xl">${product?.price}</p>
          <p className="text-xl">{product?.description}</p>
          <InputNumber
            min={1}
            defaultValue={1}
            className="mt-2"
            value={quantity}
            onChange={(value) => setQuantity(value as number)}
          />
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-full w-1/3 mt-3" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
      <Divider />
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">You may aslo like</h2>
        {isLoadingProducts ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-5 gap-3">
            {products
              ?.filter((product: ProductCardTypes) => product._id !== id)
              .map((product: ProductCardTypes) => (
                <ProductCard
                  key={product._id}
                  _id={product._id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  image={product.image}
                  loading={isLoading}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;
