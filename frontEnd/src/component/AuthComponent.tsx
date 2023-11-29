import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../state/hooks";
import { handleGetInfo } from "../api/authApi";
import { setUser } from "../state/action";
import { useState } from "react";
import { Spin } from "antd";

function AuthComponent() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, dispatch] = useStore();
  const location = useLocation();
  // const [body, setBody] = useState(<></>);
  const { login, loading } = state;
  const getInfo = async () => {
    const res = await handleGetInfo();
    dispatch(setUser(res));
  };
  let body = <></>;
  if (loading) {
    body = <Spin />;
  } else if (login) {
    body = <Outlet />;
  } else {
    body = <Navigate to="/login" replace />;
  }

  return <>{body}</>;
}

export default AuthComponent;
