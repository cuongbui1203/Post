import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useStore } from "../state/hooks";
import { handleInit } from "../api/Handle/Login";

function RequireAuth() {
  // console.log("first");
  const nav = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, dispatch] = useStore();
  // console.log(state);
  useEffect(() => {
    const getInfo = async () => {
      const res = await handleInit(dispatch);
      nav("/");
    };
    getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Outlet />;
}

export default RequireAuth;
