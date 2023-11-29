import { Outlet, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./error/error-page";
import App from "./App";
import LoginComponent from "./page/login-register/LoginComponent";
import RegisterComponent from "./page/login-register/RegisterComponent";
import ContentComponent from "./component/ContentComponent";
import CreateBienNhan from "./page/bienNhan/CreateBienNhan";
import CheckBienNhan from "./page/bienNhan/CheckBienNhan";
import RequireAuth from "./component/RequireAuth";
import ThongKeComponent from "./component/ThongKe/ThongKeComponent";
import UserDetail from "./component/User/UserDetail";
import PrintBienNhan from "./page/bienNhan/PrintBienNhan";
import ToTransport from "./page/toTransport/ToTransport";
import ReceiveBienNhan from "./page/receive/ReceiveBienNhan";
import ConfirmBienNhan from "./page/bienNhan/ConfirmBienNhan";
import QLTaiKhoanComponent from "./page/quanLy/taiKhoan/QLTaiKhoanComponent";
import QuanLyWPComponent from "./page/quanLy/wp/QuanlyWPComponent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RequireAuth />,
    errorElement: <ErrorPage />,

    children: [
      {
        path: "/",
        element: <App />,
        children: [
          {
            path: "/",
            element: <ContentComponent />,
          },
          {
            path: "bien_nhan/",
            element: <Outlet />,
            children: [
              {
                path: "create",
                element: <CreateBienNhan />,
              },
              {
                path: "check",
                element: <CheckBienNhan />,
              },
              {
                path: "print",
                element: <PrintBienNhan />,
              },
              {
                path: "confirm/incoming",
                element: <ReceiveBienNhan />,
              },
              {
                path: "confirm",
                element: <ConfirmBienNhan />,
              },
            ],
          },
          {
            path: "/toTheTransport",
            element: <ToTransport />,
          },
          {
            path: "/thong_ke",
            element: <ThongKeComponent />,
          },
          {
            path: "/users/",
            children: [
              {
                path: ":userId",
                element: <UserDetail />,
              },
            ],
          },
          {
            path: "quanLy/users",
            element: <QLTaiKhoanComponent />,
          },
          {
            path: "quanLy/workPlates",
            element: <QuanLyWPComponent />,
          },
        ],
      },
      {
        path: "register",
        element: <RegisterComponent />,
      },
      {
        path: "login",
        element: <LoginComponent />,
      },
    ],
  },
]);
export default router;
