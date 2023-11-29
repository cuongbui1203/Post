import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../state/hooks";
import { UserRole } from "../../enums/enum";

const siderStyle: React.CSSProperties = {
  textAlign: "center",
  justifyContent: "start",
  lineHeight: "120px",
  color: "#000",
  backgroundColor: "transparent",
};
const contentStyle: React.CSSProperties = {
  display: "grid",
  gap: "10px",
  marginLeft: "10px",
};
const buttonStyle = {
  backgroundColor: "transparent",
  cursor: "pointer",
  border: "none",
  "&:hover": {
    background: "#efefef",
  },
};
export default function Sidebar() {
  const navigate = useNavigate();
  const [content, setContent] = useState(<></>);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, dispatch] = useStore();
  const onKtBtn = () => {
    navigate("/bien_nhan/check");
  };
  const onRegisterBtn = () => {
    navigate("/register");
  };

  useEffect(() => {
    console.log(state);
    if (!state.login) {
      setContent(<></>);
      return;
    }
    if (state.user) {
      console.log(state.user);
      const user = state.user;
      switch (user.role.name) {
        case UserRole.Employee:
          setContent(
            <>
              <Button
                style={buttonStyle}
                onClick={() => {
                  navigate("/bien_nhan/create");
                }}
              >
                Tao Bien Nhan Moi
              </Button>
              <Button style={buttonStyle} onClick={() => navigate("/thong_ke")}>
                Thong ke
              </Button>
              <Button
                style={buttonStyle}
                onClick={() => navigate("/toTheTransport")}
              >
                chuyển cho chung chuyển
              </Button>
              <Button
                style={buttonStyle}
                onClick={() => navigate("/bien_nhan/confirm/incoming")}
              >
                Xác nhận dơn hàng đã đến
              </Button>
              <Button
                style={buttonStyle}
                onClick={() => navigate("/bien_nhan/confirm")}
              >
                Hoàn thành hoặc huỷ
              </Button>
            </>
          );
          break;

        case UserRole.Boss:
        case UserRole.Manager:
          setContent(
            <>
              <Button
                style={buttonStyle}
                onClick={() => navigate("/quanLy/users")}
              >
                quan ly tai khoan
              </Button>

              <Button
                style={buttonStyle}
                onClick={() => navigate("/quanLy/workPlates")}
              >
                quan ly noi lam viec
              </Button>
              <Button style={buttonStyle} onClick={() => navigate("/thong_ke")}>
                Thong ke
              </Button>
              <Button style={buttonStyle} onClick={onRegisterBtn}>
                Đăng ký tài khoản
              </Button>
            </>
          );
          break;

        default:
          setContent(<>default</>);
      }
    }
  }, [state]);

  return (
    <div style={siderStyle}>
      <div style={contentStyle}>
        <Button style={buttonStyle} onClick={onKtBtn}>
          Kiểm tra đơn hàng
        </Button>
        {content}
      </div>
    </div>
  );
}
