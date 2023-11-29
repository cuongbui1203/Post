import { useEffect, useState } from "react";
import ListItem, { Data } from "../ListItem";
import net from "../../../api/net";
import { Button, Form, Input, Modal, Select } from "antd";
import AddressComponent from "../../../component/address/AddressComponent";
import { TypeEnum } from "../../../enums/enum";
import { AxiosResponse } from "axios";
import { ResponseInfo } from "../../../interface/ResponseInterface";
import { useNavigate } from "react-router-dom";

function QuanLyWPComponent() {
  // const [listContent, setListContent] = useState<ReactElement[]>([]);
  const [data, setData] = useState<Data[]>([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [cap, setCap] = useState(TypeEnum.Ward);
  const [loai, setLoai] = useState(TypeEnum.TransactionPoint);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await handleSubmit();
    setIsModalOpen(false);
    navigate(0);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = async () => {
    const data = new FormData();
    data.append("name", name);
    data.append("addressId", address[2]);
    data.append("address", address[3]);
    data.append("idType", JSON.stringify(loai));
    data.append("cap", JSON.stringify(cap));
    const res: AxiosResponse<ResponseInfo> = await net.post("/work", data);
    if (res.data.success) {
      console.log("thanh cong");
    } else {
      console.log("that baij");
    }
  };
  useEffect(() => {
    const handle = async () => {
      const res = await net.get("/works");
      const tg: Data[] = [];
      console.log(res);
      res.data.data.map(
        (e: {
          name: string;
          address: {
            address: string;
            ward: string;
            district: string;
            province: string;
          };
          id: string;
        }) => {
          const t: Data = {
            name: e.name,
            type: "workPlate",
            detail: `${e.address.address}, ${e.address.ward}, ${e.address.district}, ${e.address.province}`,
            uuid: e.id,
          };
          tg.push(t);
        }
      );
      setData(tg);
    };
    console.log("first");
    handle();
  }, []);
  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "10",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              display: "inline-block",
              fontSize: "1.03rem",
            }}
          >
            Quan ly noi lm vc
          </span>
          <Button onClick={showModal}>add new</Button>
        </div>
        <div>
          <ListItem data={data} />
        </div>
      </div>
      <Modal
        title="Create new Work plate"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <Form.Item>
            <Input
              placeholder="name"
              onChange={(e) => {
                setName(e.currentTarget.value);
              }}
            ></Input>
          </Form.Item>
          <Form.Item>
            <AddressComponent
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              onChange={setAddress}
            />
          </Form.Item>
          <Form.Item>
            <Select
              options={[
                {
                  label: "Điểm trung chuyển",
                  value: TypeEnum.TransportPoint,
                },
                {
                  label: "Điểm giao dich",
                  value: TypeEnum.TransactionPoint,
                },
                {
                  label: "Trụ sở công ty",
                  value: TypeEnum.RegisteredOffice,
                },
              ]}
              defaultValue={TypeEnum.TransactionPoint}
              onChange={(e) => {
                setLoai(e);
              }}
            ></Select>
          </Form.Item>
          <Form.Item>
            <Select
              options={[
                {
                  label: "Cấp phường xã",
                  value: TypeEnum.Ward,
                },
                {
                  label: "Điểm quận huyện",
                  value: TypeEnum.District,
                },
                {
                  label: "Cấp Tỉnh",
                  value: TypeEnum.Province,
                },
              ]}
              defaultValue={TypeEnum.Ward}
              onChange={(e) => {
                setCap(e);
              }}
            ></Select>
          </Form.Item>
        </div>
      </Modal>
    </>
  );
}

export default QuanLyWPComponent;
