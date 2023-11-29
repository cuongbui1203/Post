import { AxiosResponse } from "axios";
import { TypeEnum } from "../enums/enum";
import {
  ResponseWorkPlate,
  ResponseWorkPlates,
} from "../interface/ResponseInterface";
import net from "./net";

const handleSearchTransactionPoint: (
  vung: string
) => Promise<ResponseWorkPlates | null> = async (vung) => {
  try {
    const res: AxiosResponse<ResponseWorkPlates | null> = await net.get(
      "/work/search",
      {
        params: {
          vung: vung,
          type: TypeEnum.TransactionPoint,
        },
      }
    );
    return res.data;
  } catch (e) {
    return null;
  }
};
const handelCreateWorkPlate = async (data: unknown) => {
  try {
    const res = await net.post("/bien_nhan", {
      data: data,
    });
  } catch (err) {
    console.log(err);
    return null;
  }
};
const handleGetDetailWorkPlate: (
  id: string
) => Promise<ResponseWorkPlate | null> = async (id) => {
  try {
    const res: AxiosResponse<ResponseWorkPlate | null> = await net.get(
      "/work",
      {
        params: {
          id: id,
        },
      }
    );
    console.log(res.data?.data);
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
export {
  handleSearchTransactionPoint,
  handelCreateWorkPlate,
  handleGetDetailWorkPlate,
};
