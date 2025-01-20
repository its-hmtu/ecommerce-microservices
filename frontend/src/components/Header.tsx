import { Button } from "antd";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import routes from "../constants/paths";

type PropsTypes = {
  isMobile: boolean;
};

function Header({ isMobile }: PropsTypes) {
  const isLogin = false;
  const navigate = useNavigate();

  return (
    <div className="w-full h-16 bg-slate-100 flex items-center justify-between px-4">
      <Logo size="text-2xl" />

      <div>
        {isLogin ? (
          <div className="flex items-center">
            <button className="mr-4">Cart</button>
            <button>Logout</button>
          </div>
        ) : (
          <Button
            type="dashed"
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
