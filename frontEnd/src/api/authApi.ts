import { AxiosResponse } from "axios";
import {
  ResponseInfo,
  ResponseLogin,
  ResponseUserInfo,
  UserInfo,
} from "../interface/ResponseInterface";
import net from "./net";
import dayjs from "dayjs";

const handleLogin: (data: unknown) => Promise<ResponseLogin | null> = async (
  data
) => {
  try {
    const res1 = await net.post("/login", data, {
      headers: { Authorization: "" },
    });
    const res: ResponseLogin = res1.data;
    console.log(res.data.token);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("login", "1");
    net.defaults.headers["Authorization"] = "Bearer " + res.data.token;

    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const handleGetInfo: (token?: string) => Promise<UserInfo | null> = async (
  token
) => {
  try {
    const auth =
      "Bearer " +
      (localStorage.getItem("token") ? localStorage.getItem("token") : token);

    const res: AxiosResponse<ResponseUserInfo> = await net.get("/me", {
      headers: {
        Authorization: auth,
      },
    });
    res.data.data.user.dob = dayjs(res.data.data.user.dob, "YYYY-MM-DD");
    console.log(res);
    return res.data.data.user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const handleLogout = async () => {
  try {
    const res = await net.get("/logout");
    localStorage.removeItem("token");
    localStorage.setItem("login", "0");
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const handleUpdateInfo: (
  data: unknown
) => Promise<ResponseInfo | null> = async (data: unknown) => {
  try {
    const res: AxiosResponse<ResponseInfo> = await net.post("/update", data);
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
const handleRegister: (
  data: unknown
) => Promise<{ name: string } | null> = async (data) => {
  try {
    const res: AxiosResponse<{
      success: boolean;
      message: string;
      size: number;
      data: { name: string };
    }> = await net.post("/register", data);
    return res.data.data;
  } catch (err) {
    return null;
  }
};
export {
  handleLogin,
  handleGetInfo,
  handleLogout,
  handleUpdateInfo,
  handleRegister,
};
