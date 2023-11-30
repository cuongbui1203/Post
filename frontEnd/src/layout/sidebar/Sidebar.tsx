import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../state/hooks";
import { TypeEnum, UserRole } from "../../enums/enum";

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
      const typeWP = state.workPlate.type_id;
      switch (user.role.name) {
        case UserRole.Employee:
          {
            const contentTg =
              typeWP === TypeEnum.TransactionPoint ? (
                <>
                  <Button
                    style={buttonStyle}
                    onClick={() => {
                      navigate("/bien_nhan/create");
                    }}
                  >
                    Tạo biên nhận mới
                  </Button>
                  <Button
                    style={buttonStyle}
                    onClick={() => navigate("/thong_ke")}
                  >
                    Thống kê
                  </Button>
                  <Button
                    style={buttonStyle}
                    onClick={() => navigate("/toTheTransport")}
                  >
                    Chuyển cho chung chuyển
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
              ) : (
                <>
                  <Button
                    style={buttonStyle}
                    onClick={() => {
                      navigate("/bien_nhan/create");
                    }}
                  >
                    Tạo biên nhận mới
                  </Button>

                  <Button
                    style={buttonStyle}
                    onClick={() => navigate("/toTheTransport")}
                  >
                    Chuyển cho chung chuyển
                  </Button>
                  <Button
                    style={buttonStyle}
                    onClick={() => navigate("/bien_nhan/confirm/incoming")}
                  >
                    Xác nhận dơn hàng đã đến
                  </Button>
                </>
              );
            setContent(contentTg);
          }
          break;

        case UserRole.Boss:
          setContent(
            <>
              <Button
                style={buttonStyle}
                onClick={() => navigate("/quanLy/users")}
              >
                Quản lý tài khoản
              </Button>

              <Button
                style={buttonStyle}
                onClick={() => navigate("/quanLy/workPlates")}
              >
                Quản lý nơi làm việc
              </Button>
              <Button style={buttonStyle} onClick={() => navigate("/thong_ke")}>
                Thống kê
              </Button>
              <Button style={buttonStyle} onClick={onRegisterBtn}>
                Đăng ký tài khoản
              </Button>
            </>
          );
          break;
        case UserRole.Manager:
          setContent(
            <>
              <Button style={buttonStyle} onClick={() => navigate("/thong_ke")}>
                Thống kê
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
