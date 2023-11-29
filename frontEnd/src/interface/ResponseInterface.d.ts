import { Dayjs } from "dayjs";

interface ResponseInfo {
  success: boolean;
  message: string;
  size?: number;
}

interface ResponseLogin extends ResponseInfo {
  data: {
    token: string;
  };
}
interface AddressInfo {
  province: string;
  district: string;
  ward: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  address: string;
}
interface Address {
  id: string;
  name: string;
}
interface UserRole {
  id: number;
  name: string;
}

interface UserInfo {
  name: string;
  uuid: string;
  dob: Dayjs;
  phone: string;
  address: AddressInfo;
  role: UserRole;
  detail: { work_plate_id: string };
}
interface ResponseUserInfo extends ResponseInfo {
  data: {
    user: UserInfo;
  };
}

interface ResponseAddress extends ResponseInfo {
  data: Address[];
}

interface WorkPlate {
  id: string;
  name: string;
  type_id: number;
  vung: string;
  cap: number;
  address: AddressInfo;
}

interface WorkPlateInfo {
  id: string;
  name: string;
  address: AddressInfo;
  type: {
    id: number;
    name: string;
  };
}

interface ResponseWorkPlates extends ResponseInfo {
  data: WorkPlate[];
}

interface ResponseWorkPlate extends ResponseInfo {
  data: WorkPlate;
}
interface ResponseWorkPlateInfo extends ResponseInfo {
  data: WorkPlateInfo;
}

interface BienNhan {
  id: string;
  ten_ng_gui: string;
  sdt_ng_gui: string;
  type_id: string;
  ten_ng_nhan: string;
  sdt_ng_nhan: string;
  nd: string;
  note: string;
  mass: string;
  cod: number;
  ngay_gui: string;
  status_id: number;
  id_address_ng_gui: number;
  id_address_ng_nhan: number;
}
interface HistoryInfo {
  id: string;
  from_id: string;
  to_id: string;
  status_id: number;
  description: string;
  from: WorkPlateInfo;
  updated_at: string;
}
interface BienNhanInfo extends BienNhan {
  address_ng_gui: {
    id: number;
    address_id: string;
    address: AddressInfo;
  };
  address_ng_nhan: {
    id: number;
    address_id: string;
    address: AddressInfo;
  };
  type: {
    id: number;
    name: string;
  };
  histories: HistoryInfo[];
}

interface ResponseBienNhanInfo extends ResponseInfo {
  data: BienNhanInfo;
}
interface ResponseBienNhanInfos extends ResponseInfo {
  data: BienNhanInfo[];
}

interface ResponseBienNhan extends ResponseInfo {
  data: BienNhan;
}

interface ResponseThongKe extends ResponseInfo {
  data: [];
}

export type {
  ResponseInfo,
  ResponseLogin,
  ResponseUserInfo,
  ResponseAddress,
  ResponseWorkPlate,
  ResponseWorkPlates,
  ResponseWorkPlateInfo,
  ResponseBienNhanInfo,
  ResponseBienNhanInfos,
  ResponseBienNhan,
  ResponseThongKe,
  UserInfo,
  UserRole,
  AddressInfo,
  Address,
  WorkPlate,
  WorkPlateInfo,
  BienNhanInfo,
  HistoryInfo,
};
