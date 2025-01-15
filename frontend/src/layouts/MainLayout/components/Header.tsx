import { Avatar, Badge, Button } from "antd";
import React from "react";
import { FaRegUser, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import { getCart } from "../../../api/cart";
import { IoIosLogOut } from "react-icons/io";
import { CartContext } from "../../../contexts/CartContext";
function Header() {
  // const [cart, setCart] = React.useState<any>(null);
  const navigate = useNavigate()
  const { cart, setCart } = React.useContext(CartContext);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  return (
    <header
      style={{
        height: 60,
        backgroundColor: "#242424",
        color: "white",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Link to={"/"} style={{ color: "white", textDecoration: "none" }}>
          <h4>OnlineBoutique</h4>
        </Link>

        {localStorage.getItem("user") ? (
          <div style={{ display: "flex", gap: 20 }}>
            <Link
              to={"/cart"}
              style={{ color: "white", textDecoration: "none" }}
            >
              <Button color="default" variant="filled">
                <Badge
                  count={cart?.items?.reduce(
                    (acc: number, product: any) => acc + product.quantity,
                    0
                  )}
                  showZero
                >
                  <FaShoppingCart size={24} style={{ color: "white" }} />
                </Badge>
              </Button>
            </Link>

            <Link to={"/profile"} >
              <Avatar
                icon={<FaRegUser />}
                style={{
                  backgroundColor: "white",
                  color: "#242424",
                }}
              />
            </Link>

            <Button color="danger" variant="solid" onClick={handleLogout}>
              <IoIosLogOut />
            </Button>
          </div>
        ) : (
          <Link
            to={"/auth/login"}
            style={{ color: "white", textDecoration: "none" }}
          >
            <Button color="primary" variant="solid">
              Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
