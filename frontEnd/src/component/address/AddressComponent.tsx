import { Select, Input, Form } from "antd";
// import Item from "antd/es/descriptions/Item";
import { useEffect, useState } from "react";
import { GetProvinces, GetDistricts, GetWards } from "../../api/addressApi";
import { labelStyle } from "../../comonStyle";

const { Item } = Form;
interface SelectOptionType {
  value: string;
  label: string;
}

interface Props {
  onChange: (e: string[]) => void;
  readonly ward?: string;
  readonly district?: string;
  readonly province?: string;
  readonly addressMore?: string;
  readonly style?: React.CSSProperties;
}
function AddressComponent(props: Props) {
  const { onChange, ward, district, province, addressMore, style } = props;
  const [idDistrict, setIdDistrict] = useState<string | null>(null);
  const [idWard, setIdWard] = useState<string | null>(null);
  const [idProvince, setIdProvince] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const [showDistrict, setShowDistrict] = useState(false);
  const [showWard, setShowWard] = useState(false);

  const [listProvince, setListProvince] = useState<SelectOptionType[]>([]);
  const [listDistrict, setListDistrict] = useState<SelectOptionType[]>([]);
  const [listWard, setListWard] = useState<SelectOptionType[]>([]);

  const localStyle = style ? style : labelStyle;

  useEffect(() => {
    const res = [
      idProvince,
      idDistrict ? idDistrict : "",
      idWard ? idWard : "",
      address,
    ];
    onChange(res);
  }, [address, idDistrict, idProvince, idWard, onChange]);

  const handleGetDistrict = async (id: string) => {
    // console.log(idProvince);
    const res = await GetDistricts(id);
    console.log(res);
    const tem: SelectOptionType[] = [];
    res?.data.map((e) => {
      tem.push({
        label: e.name,
        value: e.id,
      });
    });
    setListDistrict(tem);
    setShowDistrict(true);
  };

  const handleGetWard = async (id: string) => {
    const res = await GetWards(id);
    const tem: SelectOptionType[] = [];
    res?.data.map((e) => {
      tem.push({
        label: e.name,
        value: e.id,
      });
    });
    setListWard(tem);
    setShowWard(true);
  };

  useEffect(() => {
    const handle = async () => {
      if (district && ward && province && addressMore) {
        {
          const res = await GetProvinces();
          const tem: SelectOptionType[] = [];
          res?.data.map((e) => {
            tem.push({
              label: e.name,
              value: e.id,
            });
          });
          setListProvince(tem);
        }
        {
          const res = await GetDistricts(province);
          const tem: SelectOptionType[] = [];
          res?.data.map((e) => {
            tem.push({
              label: e.name,
              value: e.id,
            });
          });
          setListDistrict(tem);
        }
        {
          const res = await GetWards(district);
          const tem: SelectOptionType[] = [];
          res?.data.map((e) => {
            tem.push({
              label: e.name,
              value: e.id,
            });
          });
          setListWard(tem);
        }

        setShowDistrict(true);
        setShowWard(true);

        setIdProvince(province);
        setIdWard(ward);
        setIdDistrict(district);
        setAddress(addressMore);
      } else {
        const res = await GetProvinces();
        const tem: SelectOptionType[] = [];
        res?.data.map((e) => {
          tem.push({
            label: e.name,
            value: e.id,
          });
        });
        setListProvince(tem);
      }
    };
    handle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <Item label={<span style={localStyle}>Tinh</span>} colon={false}>
        <Select
          value={idProvince}
          onChange={(v: string) => {
            setIdProvince(v);
            setShowDistrict(false);
            setShowWard(false);
            handleGetDistrict(v);
            setIdDistrict(null);
            setIdWard(null);
          }}
          options={listProvince}
          placeholder="Chọn tỉnh"
        />
      </Item>
      <Item label={<span style={localStyle}>Thanh pho</span>} colon={false}>
        <Select
          value={idDistrict}
          disabled={!showDistrict}
          onChange={(v: string) => {
            setIdDistrict(v);
            handleGetWard(v);
            setIdWard(null);
          }}
          options={listDistrict}
          placeholder="Chọn Quận"
        />
      </Item>
      <Item label={<span style={localStyle}>Phuong</span>} colon={false}>
        <Select
          value={idWard}
          disabled={!showWard}
          options={listWard}
          onChange={(e) => setIdWard(e)}
          placeholder="Phường"
        />
      </Item>
      <Item colon={false} label={<span style={localStyle}>Dia chi</span>}>
        <Input
          value={address}
          // width={500}
          placeholder="Địa chỉ cụ thể"
          onChange={(e) => setAddress(e.currentTarget.value)}
        ></Input>
      </Item>
    </div>
  );
}

export default AddressComponent;
