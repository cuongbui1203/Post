import { SearchOutlined } from "@ant-design/icons";
import { Input, Modal } from "antd";
import React, { ReactElement, useState } from "react";
import ShowInfoBienNhan from "./ShowInfoBienNhan";
const containerStyle: React.CSSProperties = {
  display: "flex",
  width: "100%",
  height: "100%",
  margin: "auto",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};
function CheckBienNhan() {
  const [id, setId] = useState("");
  const [contentModal, setContentModal] = useState<ReactElement>(<></>);
  let id2 = "";
  const handlePressEnter = (e: { currentTarget: { value: string } }) => {
    console.log(e.currentTarget.value);
    setId(e.currentTarget.value);
    id2 = e.currentTarget.value;
    setContentModal(<ShowInfoBienNhan id={e.currentTarget.value} />);
    showModal();
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setContentModal(<></>);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setContentModal(<></>);
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
      >
        {contentModal}
      </Modal>
    </>
  );
}

export default CheckBienNhan;
