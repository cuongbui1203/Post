import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Image, Modal } from "antd";
import { useStore } from "../../state/hooks";
import {
  AddressInfo,
  UserInfo,
  WorkPlateInfo,
} from "../../interface/ResponseInterface";
import { imgSrcWP } from "../../ConstVar";
import UpdateInfo from "./UpdateInfo";
import { handleUpdateInfo } from "../../api/authApi";
import { handleInit } from "../../api/Handle/Login";
import ChangePass from "./ChangePass";
import UserIcon from "../../icon/UserIcon";
// import { labelStyle } from "../../comonStyle";
// import { imgSrcWP } from "../ConstVar";
const labelStyle: React.CSSProperties = {
  width: "150px",
};
const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};
const showAddress = (address: AddressInfo) => {
  return `${address.address}, ${address.ward}, ${address.district}, ${address.province}`;
};
function UserDetail() {
  const { userId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const [data, setData] = useState<FormData>(new FormData());

  const handleOk = async () => {
    console.log(data);
    // const formData = new FormData();
    // Object.entries(data).map((v: string[]) => {
    //   formData.append(v[0], v[1]);
    // });
    const res = await handleUpdateInfo(data);
    if (res?.success) {
      await handleInit(dispatch);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [state, dispatch] = useStore();
  const {
    user,
    workPlateId,
    workPlate,
  }: { user: UserInfo; workPlateId: string; workPlate: WorkPlateInfo } = state;
  const nav = useNavigate();

  return (
    <>
      <div style={containerStyle}>
        <div>{user.role.name}</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* <Image
            src="https://wallpapers.com/images/hd/anime-profile-picture-jioug7q8n43yhlwn.jpg"
            width={200}
            height={200}
          /> */}
          <UserIcon size={200} />
          <div style={{ margin: "0px 30px" }}>
            <div>
              <span style={labelStyle}>Name:</span> {user.name}
            </div>
            <div>
              <span style={labelStyle}>DOB:</span>{" "}
              {user.dob.format("DD/MM/YYYY").toString()}
            </div>
            <div>
              <span style={labelStyle}>Address:</span>{" "}
              {showAddress(user.address)}
            </div>
            <Button onClick={showModal}>Edit</Button>
            <Button onClick={() => setIsChangePassOpen(true)}>
              ChangePass
            </Button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Image src={imgSrcWP} width={200} height={200} preview={false} />
          </div>
          <div style={{ margin: "0px 30px" }}>
            <div>{workPlate?.type.name}</div>
            <div>Name: {workPlate?.name}</div>
            <div>Address: {showAddress(workPlate?.address)}</div>
          </div>
        </div>
      </div>
      <Modal
        title="Thay doi thong tin"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <UpdateInfo onOk={setData} />
      </Modal>
      <Modal
        title="Change Password"
        open={isChangePassOpen}
        onCancel={() => setIsChangePassOpen(false)}
        onOk={() => setIsChangePassOpen(false)}
      >
        <ChangePass />
      </Modal>
    </>
  );
}

export default UserDetail;
