import React, { useEffect } from "react";
import { getProducts } from "../../api/product";
import { toast } from "react-toastify";
import { Button, Card } from "antd";
import { FaCartPlus } from "react-icons/fa";
import { UserContext } from "../../contexts/UserContext";
import { addToCart, getCart } from "../../api/cart";
import { CartContext } from "../../contexts/CartContext";
interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
}

function HomePage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const {cart, setCart} = React.useContext(CartContext);
  const [products, setProducts] = React.useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        console.log(products);
        setIsLoading(false);
        setProducts(products);
      } catch (e: any) {
        toast.error("Cannot get products right now. Please try again later.");
      }
    };

    fetchProducts();
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const cart = await getCart();
      console.log(cart);
      setIsLoading(false);
      setCart(cart);
    } catch (e: any) {
      console.log(e.message);
    }
  }

  const handleAddToCart = async ({ _id, name, image, price }: Product) => {
    try {
      const response = await addToCart({
        productId: _id,
        quantity: 1,
        name,
        image,
        price,
      })

      if (response.message) {
        throw new Error(response.message);
      }

      toast.success("Product added to cart");
      await fetchCart();
    } catch (e: any) {
      toast.error("Cannot add product to cart. Please try again later.");
    }
  }

  return (
    <>
      <h1>Hot Products</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {products.map((product: Product) => (
            <Card
              cover={<img src={product.image} alt={product.name} />}
              style={{
                width: 300,
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                marginBottom: 20,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Card.Meta
                title={product.name}
                description={product.description}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>${product.price}</span>
                  <span>Stock: {product.stock}</span>
                </div>

                <Button type="primary" 
                  onClick={() => handleAddToCart(product)}
                  // disabled={!user}
                >
                  <FaCartPlus />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

export default HomePage;
