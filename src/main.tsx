import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "styles/global.scss";
import { App, ConfigProvider } from "antd";
import DashBoardPage from "pages/admin/dashboard";
import ManageBookPage from "pages/admin/manage.book";
import ManageOrderPage from "pages/admin/manage.order";
import ManageUserPage from "pages/admin/manage.user";
import LayoutAdmin from "components/layout/layout.admin";
import enUS from "antd/locale/en_US";
import { Provider } from "react-redux";
import { store } from "./redux/store";

// import viVN from "antd/locale/vi_VN";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <DashBoardPage />
        ),
      },
      {
        path: "user",
        element: (
          <ManageUserPage />
        ),
      },
      {
        path: "book",
        element: (
          <ManageBookPage />
        ),
      },
      {
        path: "order",
        element: (
          <ManageOrderPage />
        ),
      }
    ],
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App>
        <ConfigProvider locale={enUS}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </App>
    </Provider>

  </StrictMode>
);
