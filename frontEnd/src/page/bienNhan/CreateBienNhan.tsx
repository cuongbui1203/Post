/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, Form, Input, QRCode, Select } from "antd";
import { ChangeEvent, LegacyRef, useRef, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import AddressComponent from "../../component/address/AddressComponent";
import { useStore } from "../../state/hooks";
import { handelGetBienNhan, handleCreateBienNhan } from "../../api/bienNhan";
import { ActionEnum, TypeEnum } from "../../enums/enum";
import { setBienNhan } from "../../state/action";
import { useNavigate } from "react-router-dom";

const { Item } = Form;
const options = [
  { label: "Chuyển hoàn ngay", value: ActionEnum.ReturnNow },
  { label: "Gọi điện cho người gửi/BC gửi", value: ActionEnum.Call },
  { label: "Chuyển hoàn trước ngày ", value: ActionEnum.ReturnBefore },
  { label: "Chuyển hoàn khi hết thời gian lưu trữ ", value: ActionEnum.Return },
];

const containerStyle: React.CSSProperties = {
  display: "flex",
  width: "90%",
  height: "100%",
  justifyContent: "start",
  alignItems: "center",
  flexDirection: "column",
};
const containerInfo: React.CSSProperties = {
  width: "40%",
  height: "fit-content",
};
function CreateBienNhan() {
  const qr = useRef() as LegacyRef<HTMLDivElement>;
  const print = () => {};
  const nav = useNavigate();
  const [senderName, setSenderName] = useState("");
  const [senderAddress, setSenderAddress] = useState<string[]>([]);
  const [senderPhone, setSenderPhone] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverAddress, setReceiverAddress] = useState<string[]>([]);
  const [receiverPhone, setReceiverPhone] = useState("");
  const [type, setType] = useState(TypeEnum.Goods);
  const [mass, setMass] = useState(0);
  const [massExtra, setMassExtra] = useState(0);
  const [cod, setCod] = useState(0);
  const [action, setAction] = useState<string[]>([]);
  const [noiDung, setNoiDung] = useState("");
  const [state, dispatch] = useStore();
  const [idBienNhan, setIdBienNhan] = useState("");
  const [showQr, setShowQr] = useState(false);
  const handleClick = async () => {
    console.log(state.workPlateId);
    const data = new FormData();
    data.append("tenNgGui", senderName);
    data.append("sdtNgGui", senderPhone);
    data.append("tenNgNhan", receiverName);
    data.append("sdtNgNhan", receiverPhone);
    data.append("idType", JSON.stringify(type));
    data.append("mass", JSON.stringify(mass));
    data.append("nd", noiDung);
    data.append("addressIdNgGui", senderAddress[2]);
    data.append("addressNgGui", senderAddress[3]);
    data.append("addressIdNgNhan", receiverAddress[2]);
    data.append("addressNgNhan", receiverAddress[3]);
    data.append("note", "");
    data.append("idTransactionPoint", state.workPlateId);
    data.append("cod", JSON.stringify(cod));
    data.append("action", JSON.stringify(action));

    const res = await handleCreateBienNhan(data);
    console.log(res);
    if (res?.success) {
      setIdBienNhan(res.data.id);
      const info = await handelGetBienNhan(res.data.id);
      dispatch(setBienNhan(info?.data));
      console.log(state);
      nav("/bien_nhan/print");
    }
    setShowQr(res ? res.success : false);
  };
  return (
    <>
      <div style={containerStyle}>
        <h2 style={{ width: "100%", textAlign: "center" }}>Tao don</h2>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <div style={containerInfo}>
            <h3>Nguoi Gui</h3>
            <Form.Item label="name">
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSenderName(e.currentTarget.value)
                }
              ></Input>
            </Form.Item>
            <Form.Item label="SDT">
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSenderPhone(e.currentTarget.value)
                }
              ></Input>
            </Form.Item>
            <AddressComponent onChange={setSenderAddress} />
          </div>
          <div style={containerInfo}>
            <h3>Nguoi Nhan</h3>

            <Form.Item label="name">
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setReceiverName(e.currentTarget.value)
                }
              ></Input>
            </Form.Item>
            <Form.Item label="SDT">
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setReceiverPhone(e.currentTarget.value)
                }
              ></Input>
            </Form.Item>
            <AddressComponent onChange={setReceiverAddress} />
          </div>
        </div>
        <div>
          <Item label="Loại Hàng Hoá">
            <Select
              options={[
                {
                  label: "Tài Liệu",
                  value: TypeEnum.Document,
                },
                {
                  label: "Hàng hoá",
                  value: TypeEnum.Goods,
                },
              ]}
              defaultValue={TypeEnum.Goods}
              onChange={(e) => setType(e)}
            ></Select>
          </Item>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Item label="khoi luong thuc">
              <Input
                style={{ width: "100px" }}
                type="number"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const res = parseInt(e.currentTarget.value);
                  setMass(res);
                  if (res < 100) {
                    setMassExtra(100);
                    return;
                  }
                  if (res % 100 != 0) {
                    if (res % 100 >= 50)
                      setMassExtra(Math.round(res / 100) * 100);
                    else setMassExtra((Math.round(res / 100) - 1) * 100);
                  }
                }}
              ></Input>
            </Item>
            <Item label="khoi luong Quy doi">
              <Input
                type="number"
                style={{ width: "100px" }}
                disabled
                value={massExtra}
              ></Input>
            </Item>
            <Item label="COD">
              <Input
                type="number"
                style={{ width: "200px" }}
                suffix="VND"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCod(parseInt(e.currentTarget.value))
                }
              ></Input>
            </Item>
          </div>
          <Item label="Chi dan khi khong chuyen dc hang">
            <Checkbox.Group
              options={options}
              // defaultValue={["Pear"]}
              onChange={(e: string[]) => setAction(e)}
            />
          </Item>
          <Item label="dịch vu dac biet">
            <TextArea
              onChange={(e) => setNoiDung(e.currentTarget.value)}
            ></TextArea>
          </Item>
        </div>
        <Button onClick={handleClick}>Create</Button>
      </div>
      <div
        ref={qr}
        id="myqrcode"
        // onClick={test}
        style={showQr ? { display: "block" } : { display: "none" }}
      >
        <QRCode
          value="https://ant.design/"
          bgColor="#fff"
          style={{ marginBottom: 16 }}
        />
        <Button onClick={print}>In</Button>
      </div>
    </>
  );
}

export default CreateBienNhan;
