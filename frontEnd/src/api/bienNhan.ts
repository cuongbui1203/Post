import { AxiosResponse } from "axios";
import {
  ResponseBienNhanInfo,
  ResponseBienNhanInfos,
} from "../interface/ResponseInterface";
import net from "./net";

const handelGetBienNhan: (
  id: string
) => Promise<ResponseBienNhanInfo | null> = async (id) => {
  try {
    const res: AxiosResponse<ResponseBienNhanInfo> = await net.get(
      "/bien_nhan",
      {
        params: {
          id: id,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const handleCreateBienNhan: (
  data: unknown
) => Promise<ResponseBienNhanInfo | null> = async (data) => {
  try {
    const res: AxiosResponse<ResponseBienNhanInfo> = await net.post(
      "/bien_nhan",
      data
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
const handleIncomingBienNhan: (
  listId: string[]
) => Promise<ResponseBienNhanInfos | null> = async (listId) => {
  try {
    const sendData = JSON.stringify(listId);
    const res: AxiosResponse<ResponseBienNhanInfos> = await net.get(
      "/bien_nhan/transport",
      {
        params: {
          listIdBienNhan: sendData,
        },
      }
    );
    // if
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const handleConfirmBienNhan: (
  data: unknown
) => Promise<ResponseBienNhanInfo | null> = async (data) => {
  try {
    const res: AxiosResponse<ResponseBienNhanInfo> = await net.post(
      "/bien_nhan/complete",
      data
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

const handleReturnBienNhan: (
  id: string
) => Promise<ResponseBienNhanInfo | null> = async (id) => {
  try {
    const res: AxiosResponse<ResponseBienNhanInfo> = await net.get(
      "/bien_nhan/return",
      {
        params: {
          idBienNhan: id,
        },
      }
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export {
  handelGetBienNhan,
  handleCreateBienNhan,
  handleIncomingBienNhan,
  handleConfirmBienNhan,
  handleReturnBienNhan,
};
