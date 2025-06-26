import {
  AppstoreOutlined,
  ExceptionOutlined,
  HeartTwoTone,
  TeamOutlined,
  UserOutlined,
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Dropdown,
  Space,
  Avatar,
  Grid,
} from "antd";
import { Outlet, useLocation, Link } from "react-router-dom";
import type { MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import { PacmanLoader } from "react-spinners";

const { Content, Footer, Sider, Header } = Layout;
const { useBreakpoint } = Grid;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const screens = useBreakpoint();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const menuItems: MenuProps["items"] = [
    { label: <Link to="/">Dashboard</Link>, key: "/", icon: <AppstoreOutlined /> },
    {
      label: "Manage Users",
      key: "/user",
      icon: <UserOutlined />,
      children: [{ label: <Link to="/user">CRUD</Link>, key: "/user", icon: <TeamOutlined /> }],
    },
    { label: <Link to="/product">Manage Products</Link>, key: "/product", icon: <ExceptionOutlined /> },
    { label: <Link to="/order">Manage Orders</Link>, key: "/order", icon: <DollarCircleOutlined /> },
  ];

  if (loading) {
    return <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}><PacmanLoader color="#36d7b7" /></div>;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={screens.xs ? 0 : 80}
      >
        <div style={{ margin: 16, fontWeight: "bold", fontSize: 18, textAlign: "center" }}>Admin</div>
        <Menu selectedKeys={[activeMenu]} mode="inline" items={menuItems} onClick={(e) => setActiveMenu(e.key)} />
      </Sider>

      <Layout>
        <Header
          style={{ backgroundColor: "#F5F5F5", padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e8e8e8" }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: "trigger",
            onClick: () => setCollapsed(!collapsed),
          })}
          <Dropdown
            menu={{
              items: [
                { label: <Link to="/"><HomeOutlined /> Trang chủ</Link>, key: "home" },
                { label: <span style={{ color: "#ff4d4f" }}><LogoutOutlined /> Đăng xuất</span>, key: "logout" },
              ],
            }}
            trigger={["click"]}
          >
            <Space style={{ cursor: "pointer" }}>
              <Avatar size="small" src="https://i.pravatar.cc/40?img=11" />
              <span style={{ fontWeight: 500 }}>Admin</span>
            </Space>
          </Dropdown>
        </Header>

        <Content style={{ margin: "16px", backgroundColor: "#f5f5f5", minHeight: "calc(100vh - 100px)" }}>
          <Outlet />
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Admin Management &copy; {new Date().getFullYear()} <HeartTwoTone twoToneColor="#eb2f96" />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
