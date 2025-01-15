import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function MainLayout() {
  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "0 auto",
          maxWidth: 1280,
          paddingTop: 40,
          height: "100vh",
          gap: 20,
        }}
      >
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
