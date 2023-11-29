/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePicker, Form, Input } from "antd";
import { useStore } from "../../state/hooks";
import { UserInfo } from "../../interface/ResponseInterface";
import { useEffect, useState } from "react";
import AddressComponent from "../address/AddressComponent";
import { labelStyle } from "../../comonStyle";
import dayjs, { Dayjs } from "dayjs";
interface Props {
  onOk: (data: unknown) => void;
}
interface DataReturn {
  name: string;
  phone: string;
  _method: string;
  dob: Dayjs;
  address: string;
  addressId: string;
}
function UpdateInfo(props: Props) {
  const { onOk } = props;
  const [state, dispatch] = useStore();
  const { user }: { user: UserInfo } = state;
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [dob, setDob] = useState<Dayjs>(user.dob);
  const [address, setAddress] = useState<string[]>([]);
  useEffect(() => {
    const data = new FormData();
    data.append("name", name);
    data.append("phone", phone);
    data.append("dob", dob.format("YYYY-MM-DD").toString());
    data.append("address", address[3]);
    data.append("addressId", address[2]);
    data.append("_method", "PUT");
    // console.log(data);
    onOk(data);
  }, [address, dob, name, onOk, phone]);

  return (
    <div>
      <Form.Item label={<span style={labelStyle}>Name</span>} colon={false}>
        <Input
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        ></Input>
      </Form.Item>
      <Form.Item label={<span style={labelStyle}>DOB</span>} colon={false}>
        <DatePicker
          value={dob}
          onChange={(e) => setDob(dayjs(e))}
          allowClear={false}
          style={{ width: "100%" }}
        ></DatePicker>
      </Form.Item>
      <Form.Item label={<span style={labelStyle}>Phone</span>} colon={false}>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.currentTarget.value)}
        ></Input>
      </Form.Item>
      <AddressComponent
        onChange={setAddress}
        ward={user.address.wardCode}
        province={user.address.provinceCode}
        district={user.address.districtCode}
        addressMore={user.address.address}
      />
    </div>
  );
}

export default UpdateInfo;
