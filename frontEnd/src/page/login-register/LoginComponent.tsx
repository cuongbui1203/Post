import { Form, notification } from "antd";
import styles from "./login.module.scss";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../state/hooks";
import { handleLoginAction } from "../../api/Handle/Login";

interface FormResults {
  email: string;
  password: string;
}
export default function LoginComponent() {
  const [noti, contextHolder] = notification.useNotification();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, dispatch] = useStore();
  const nav = useNavigate();
  const onFinish = async (values: FormResults) => {
    const form = new FormData();
    form.append("email", values.email);
    form.append("password", values.password);
    const res = await handleLoginAction(form, noti, dispatch);
    if (res) {
      nav("/");
    }
  };
  return (
    <>
      {contextHolder}
      <div
        className={styles.main}
        style={{
          height: "98vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#71c571",
        }}
      >
        <div>
          <div className={styles.screen}>
            <div className={styles.screen__content}>
              <Form
                name="register"
                className={styles.login}
                validateTrigger="onChange"
                onFinish={onFinish}
              >
                <div className={styles.login__field}>
                  <Form.Item name="email">
                    <input
                      type="text"
                      className={styles.login__input}
                      placeholder="Email"
                    ></input>
                  </Form.Item>
                </div>
                <div className={styles.login__field}>
                  <Form.Item name="password">
                    <input
                      type="password"
                      className={styles.login__input}
                      placeholder="Password"
                    ></input>
                  </Form.Item>
                </div>
                <button
                  className={clsx(styles.button, styles.login__submit)}
                  // onClick={onFinish}
                >
                  <span className={styles.button__text}>Log In Now</span>
                  <i className="button__icon fas fa-chevron-right"></i>
                </button>
                {/* <div className={styles.social_login}>
                <h3>Register</h3>
              </div> */}
                <div
                  style={{
                    display: "flex",
                    width: "90%",
                    margin: "10px 0px",
                    justifyContent: "space-between",
                  }}
                >
                  <Link className={styles.link} to={"/register"}>
                    Don't have an account?
                  </Link>
                  <Link className={styles.link} to={"/"}>
                    cancel
                  </Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
