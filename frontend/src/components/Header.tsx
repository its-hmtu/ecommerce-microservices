import { Badge, Button, Tooltip } from "antd";
import Logo from "./Logo";
import { Link, useNavigate } from "react-router-dom";
import routes from "../constants/paths";
import { FaSignOutAlt } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import userService from "../features/services/user.service";
import React from "react";
import useUser from "../hooks/useUser";
import LogoutModal from "./Modals/LogoutModal";
import { useSelector } from "react-redux";
import { selectCartTotal } from "../features/counters/user.slice";

type PropsTypes = {
  isMobile: boolean;
};

function Header({ isMobile }: PropsTypes) {
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const { user, logout, cart } = useUser();
  const cartTotal = useSelector(selectCartTotal);
  const [isModalOpen, setModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (Object.keys(user).length > 0) {
      console.log(user);
      setLoggedIn(true);
    }
  }, [user]);

  const handleOnOk = () => {
    setModalOpen(false);
    logout();
    setLoggedIn(false);
  };

  return (
    <>
      <div className="w-full h-16 bg-slate-100 flex items-center justify-between px-4">
        <Link to={routes.PATHS.HOME} className="hover:text-black">
          <Logo size="text-2xl" />
        </Link>

        <div>
          {isLoggedIn ? (
            <div className="flex items-center">
              <Tooltip title="Cart">
                <Button className="" variant="link" color="default" onClick={() => navigate(routes.PATHS.CART)}>
                  <Badge count={cartTotal} showZero>
                    <FaCartShopping size={18} />
                  </Badge>
                </Button>
              </Tooltip>
              <Tooltip title="Logout">
                <Button
                  className=""
                  variant="link"
                  color="default"
                  onClick={() => setModalOpen(true)}
                >
                  <FaSignOutAlt size={18} />
                </Button>
              </Tooltip>
            </div>
          ) : (
            <Button
              type="text"
              className="font-bold text-black hover:text-blue-600"
              onClick={() => navigate(routes.PATHS.LOGIN)}
            >
              Login
            </Button>
          )}
        </div>
      </div>
      <LogoutModal
        open={isModalOpen}
        onOk={handleOnOk}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

export default Header;
