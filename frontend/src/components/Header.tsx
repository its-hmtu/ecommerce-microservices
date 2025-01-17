import { Button } from "antd";
import Logo from "./Logo";

type PropsTypes = {
  isMobile: boolean;
};

function Header({ isMobile }: PropsTypes) {
  const isLogin = false;
  return (
    <div className="w-full h-16 bg-slate-100 flex items-center justify-between px-4">
      <Logo />

      <div>
        {
          isLogin ? (
            <div className="flex items-center">
              <button className="mr-4">Cart</button>
              <button>Logout</button>
            </div>
          ) : (
            <Button type="dashed" className="font-bold text-black hover:text-blue-600">Login</Button>
          )
        }
      </div>
    </div>
  )
}

export default Header;
