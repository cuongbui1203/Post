import { NotificationInstance } from "antd/es/notification/interface";
import {
  resetStore,
  setLoginState,
  setToken,
  setUser,
  setWorkPlate,
  setWorkPlateId,
} from "../../state/action";
import { handleGetInfo, handleLogin } from "../authApi";
import { handleGetDetailWorkPlate } from "../workPlateApi";
import dayjs from "dayjs";

const handleLoginAction = async (
  data: unknown,
  noti: NotificationInstance,
  dispatch: unknown
) => {
  const res = await handleLogin(data);
  if (!res || !res.success) {
    dispatch(resetStore());
    noti["error"]({ message: "login fail" });
    return false;
  }
  if (res.success) {
    dispatch(setToken(res.data.token));
    dispatch(setLoginState(true));
    localStorage.setItem("token", res.data.token);
    const info = await handleGetInfo(res.data.token);
    if (!info) {
      dispatch(resetStore());
      noti["error"]({ message: "login fail" });
      return false;
    }
    const workPlateInfo = await handleGetDetailWorkPlate(
      info.detail.work_plate_id
    );
    // info.dob = dayjs(info.dob);
    dispatch(setUser(info));
    dispatch(setWorkPlateId(info.detail.work_plate_id));
    if (!workPlateInfo) {
      return false;
    }
    dispatch(setWorkPlate(workPlateInfo.data));
    noti["success"]({ message: "login success" });
  }
  return true;
};
const handleInit = async (dispatch: unknown) => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  dispatch(setToken(token));
  dispatch(setLoginState(true));
  const info = await handleGetInfo();
  if (!info) {
    dispatch(resetStore());
    return false;
  }
  const workPlateInfo = await handleGetDetailWorkPlate(
    info.detail.work_plate_id
  );
  dispatch(setUser(info));
  dispatch(setWorkPlateId(info.detail.work_plate_id));
  if (!workPlateInfo) {
    return false;
  }
  dispatch(setWorkPlate(workPlateInfo.data));
  return true;
};

export { handleLoginAction, handleInit };
