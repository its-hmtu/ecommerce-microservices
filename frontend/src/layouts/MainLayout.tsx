import { Layout } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function MainLayout() {
  return (
    <Layout className="bg-white">
      <Layout.Header className="bg-slate-100 shadow-md">
        <Header isMobile={true} />
      </Layout.Header>
      <Layout.Content>
        <div className="container mx-auto p-4 pb-16">
          <Outlet />
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default MainLayout;
