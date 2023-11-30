// import React from "react";
import { ReactElement, useEffect, useState } from "react";
import { Button, Card, Modal, Space } from "antd";
import UserIcon from "../../icon/UserIcon";
import { ExclamationCircleFilled } from "@ant-design/icons";
import net from "../../api/net";
import { AxiosResponse } from "axios";
import { ResponseInfo } from "../../interface/ResponseInterface";
import { UserRole } from "../../enums/enum";
import { useNavigate } from "react-router-dom";
interface Data {
  name: string;
  type: "workPlate" | "user";
  detail: string;
  uuid?: string;
  type2?: string;
}
interface Props {
  data?: Data[];
}
function ListItem(props: Props) {
  const { data } = props;
  const [content, setContent] = useState<ReactElement>(<></>);
  const navigate = useNavigate();

  const { confirm } = Modal;
  const handleReload = () => {
    navigate(0);
  };
  const handleDelete = async (id: string, type: "user" | "workPlate") => {
    if (type === "user") {
      const res: AxiosResponse<ResponseInfo> = await net.delete("/user", {
        params: {
          id: id,
        },
      });
      return res.data.success;
    } else if (type === "workPlate") {
      const res: AxiosResponse<ResponseInfo> = await net.delete("/work", {
        params: {
          id: id,
        },
      });
      handleReload();
      return res.data.success;
    }
  };
  const showConfirm = (id: string, type: "user" | "workPlate") => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      onOk() {
        console.log(id, type);
        handleDelete(id, type);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const showConfirm2 = (id: string) => {
    confirm({
      title: "Do you to do that?",
      icon: <ExclamationCircleFilled />,
      // content: "Some descriptions",
      onOk() {
        const handle2 = async () => {
          const res = await net.put("/updateRole", null, {
            params: {
              id: id,
            },
          });
          console.log(res.data.success);
        };
        handle2();
        console.log(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // const [openModal, setOpenModal] = useState(false);
  // const [contentModal, setContentModal] = useState<ReactElement>(<></>);
  useEffect(() => {
    if (data) {
      const res: ReactElement[] = [];
      data.map((e) => {
        const icon =
          e.type === "user" ? (
            <UserIcon size={50} />
          ) : (
            <img
              style={{ height: "100px", width: "130px" }}
              src="https://cache.giaohangtietkiem.vn/admin/files/uploads/images/post_ofices/2018/07/02/5b3a27da-bc30-483c-9741-a4db0a0a026e.png"
            />
          );
        const changePermission =
          e.type === "user" &&
          (e.detail === UserRole.Employee || e.detail === UserRole.Shipper) ? (
            <Button onClick={() => showConfirm2(e.uuid ? e.uuid : "")}>
              set to manager
            </Button>
          ) : (
            <></>
          );
        const detailContent = e.type2 ? (
          <>
            <b>{e.type2}</b>
            <br />
            {e.detail}
          </>
        ) : (
          <>{e.detail}</>
        );
        res.push(
          <Card>
            <div style={{ width: "100%", maxWidth: "500px" }}>
              <div
                style={{
                  width: "100%",
                  fontWeight: "bold",
                  fontSize: "1.03rem",
                  textAlign: "center",
                }}
              >
                {e.name}
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ paddingRight: 10 }}>{icon}</div>
                <div>
                  <div style={{ wordWrap: "break-word" }}>{detailContent}</div>
                  <div>
                    {changePermission}
                    <Button
                      onClick={() => showConfirm(e.uuid ? e.uuid : "", e.type)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
        setContent(
          <Space size={[30, 30]} align="center" wrap>
            {res}
          </Space>
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "auto",
      }}
    >
      {content}
      {/* <Modal open={openModal} onCancel={() => setOpenModal(false)}>
        {contentModal}
      </Modal> */}
    </div>
  );
}

export default ListItem;
export type { Data };
