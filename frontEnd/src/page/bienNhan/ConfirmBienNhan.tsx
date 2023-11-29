import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Modal } from "antd";
import React, { useState } from "react";
import ShowInfoBienNhan from "./ShowInfoBienNhan";
import {
  handleConfirmBienNhan,
  handleReturnBienNhan,
} from "../../api/bienNhan";
import { StatusEnum } from "../../enums/enum";
const containerStyle: React.CSSProperties = {
  display: "flex",
  width: "100%",
  height: "100%",
  margin: "auto",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};
function ConfirmBienNhan() {
  const [id, setId] = useState("");

  const handlePressEnter = (e: { currentTarget: { value: string } }) => {
    console.log(e.currentTarget.value);
    setId(e.currentTarget.value);
    showModal();
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleReturn = async () => {
    const res = await handleReturnBienNhan(id);
    console.log(res);
    setIsModalOpen(false);
  };
  const handleFail = async () => {
    const data = new FormData();
    data.append("idBienNhan", id);
    data.append("status", JSON.stringify(StatusEnum.Fail));
    const res = await handleConfirmBienNhan(data);
    console.log(res);
    setIsModalOpen(false);
  };
  return (
    <>
      <div style={containerStyle}>
        <h1 style={{ margin: "50px 10px" }}>ID đơn hàng</h1>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Id don hang"
          style={{ width: "500px" }}
          onPressEnter={handlePressEnter}
        ></Input>
      </div>

      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button
            key="back"
            type="primary"
            style={{ backgroundColor: "red", color: "white" }}
            onClick={handleFail}
          >
            Thất Bại
          </Button>,
          <Button
            key="submit"
            style={{ backgroundColor: "green" }}
            type="primary"
            onClick={handleOk}
          >
            Hoàn thành
          </Button>,

          <Button key="return" type="primary" onClick={handleReturn}>
            Trả về
          </Button>,
        ]}
      >
        <ShowInfoBienNhan id={id} />
      </Modal>
    </>
  );
}

export default ConfirmBienNhan;
