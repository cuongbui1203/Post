import LoginOutlined from "@ant-design/icons/lib/icons/LoginOutlined";
import styles from "./header.module.scss";

import { Header } from "antd/es/layout/layout";
import Icon from "../../icon/Icon";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../state/hooks";
import { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { handleLogout } from "../../api/authApi";
import { setLoginState, setToken, setUser } from "../../state/action";

export default function HeaderComponent() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, dispatch] = useStore();
  const [login, setLogin] = useState(<></>);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const showModal = () => {
    navigate("login");
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handelLogout = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const res = await handleLogout();
    dispatch(setLoginState(false));
    dispatch(setUser(null));
    dispatch(setToken(""));
    navigate("/");
  };
  useEffect(() => {
    if (state.login && state.user) {
      setLogin(
        <div className={styles.header_login}>
          <span onClick={() => navigate(`/users/${state.user.uuid}`)}>
            <UserOutlined />
            {state.user.name}
          </span>
          <Button style={{ border: "none" }} onClick={handelLogout}>
            Logout
          </Button>
        </div>
      );
    } else {
      setLogin(
        <div className={styles.header_login} onClick={showModal}>
          <LoginOutlined className={styles.header_login_icon} />
          login
        </div>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.login, state.user]);
  return (
    <>
      <Header className={styles.header_component}>
        <Link to={"/"} style={{ color: "black", cursor: "unset" }}>
          <div className={styles.header_logo}>
            <div className={styles.logo}>
              <Icon />
            </div>
            <div className={styles.app_name}>MAGIC POST</div>
          </div>
        </Link>
        {login}
      </Header>
    </>
  );
}
