import React, { useEffect, useState } from "react";
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
  theme,
} from "antd";
import { Outlet, useLocation, Link } from "react-router-dom";
import type { MenuProps } from "antd";
import { PacmanLoader } from "react-spinners"; 

const { Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const location = useLocation();

  //  Loading state
  const [loading, setLoading] = useState(true);

  // Fake fetch data / auth check
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Menu sidebar
  const items: MenuItem[] = [
    {
      label: <Link to="/">Dashboard</Link>,
      key: "/",
      icon: <AppstoreOutlined />,
    },
    {
      label: <span>Manage Users</span>,
      key: "/user",
      icon: <UserOutlined />,
      children: [
        {
          label: <Link to="/user">CRUD</Link>,
          key: "/user",
          icon: <TeamOutlined />,
        },
      ],
    },
    {
      label: <Link to="/book">Manage Books</Link>,
      key: "/book",
      icon: <ExceptionOutlined />,
    },
    {
      label: <Link to="/order">Manage Orders</Link>,
      key: "/order",
      icon: <DollarCircleOutlined />,
    },
  ];

  // Sync menu selection with URL
  useEffect(() => {
    const foundItem = items.find((item) => item?.key === location.pathname);
    setActiveMenu(foundItem ? (foundItem.key as string) : "/");
  }, [location]);

  // Dropdown menu
  const itemsDropdown: MenuProps["items"] = [
    {
      label: <Link to="/"><HomeOutlined /> Trang chủ</Link>,
      key: "home",
    },
    {
      label: (
        <span style={{ color: "#ff4d4f" }}>
          <LogoutOutlined /> Đăng xuất
        </span>
      ),
      key: "logout",
    },
  ];

  // Show loading if loading = true
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          zIndex: 9999,
        }}
      >
        <PacmanLoader color="#36d7b7" size={25} />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }} className="layout-admin">
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Admin
        </div>
        <Menu
          selectedKeys={[activeMenu]}
          mode="inline"
          items={items}
          onClick={(e) => setActiveMenu(e.key)}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <div
          className="admin-header"
          style={{
            height: "50px",
            borderBottom: "1px solid #ebebeb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 15px",
            backgroundColor: "#fff",
          }}
        >
          <span>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </span>

          <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                size="small"
                src="https://i.pravatar.cc/40?img=11"
              />
              <span style={{ fontWeight: 500 }}>Admin</span>
            </Space>
          </Dropdown>
        </div>

        {/* Content */}
        <Content style={{ padding: "15px", backgroundColor: "#f5f5f5" }}>
          <Outlet />
        </Content>

        {/* Footer */}
        <Footer style={{ padding: 0, textAlign: "center" }}>
          Admin Management &copy; {new Date().getFullYear()} <HeartTwoTone twoToneColor="#eb2f96" />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
