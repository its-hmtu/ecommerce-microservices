import { Button, Tooltip } from "antd";
import Logo from "./Logo";
import { Link, useNavigate } from "react-router-dom";
import routes from "../constants/paths";
import { FaSignOutAlt } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";

type PropsTypes = {
  isMobile: boolean;
};

function Header({ isMobile }: PropsTypes) {
  const isLogin = false;
  const navigate = useNavigate();

  return (
    <div className="w-full h-16 bg-slate-100 flex items-center justify-between px-4">
      <Link to={routes.PATHS.HOME} className="hover:text-black">
        <Logo size="text-2xl" />
      </Link>

      <div>
        {isLogin ? (
          <div className="flex items-center">
            <Tooltip title="Cart">
              <Button className="" variant="link" color="default">
                <FaCartShopping size={18} />
              </Button>
            </Tooltip>
            <Tooltip title="Logout">
              <Button className="" variant="link" color="default">
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
  );
}

export default Header;
