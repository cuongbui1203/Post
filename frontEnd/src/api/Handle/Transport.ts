import { AxiosResponse } from "axios";
import { ResponseTransportInfo } from "../../interface/TransportInterface";
import net from "../net";

const handleGetTransportInfo: (
  data: string[]
) => Promise<ResponseTransportInfo | null> = async (data) => {
  try {
    const sendData = JSON.stringify(data);
    const formData = new FormData();
    formData.append("listIdBienNhan", sendData);
    const res: AxiosResponse<ResponseTransportInfo> = await net.post(
      "/bien_nhan/transport",
      formData
    );
    if (res.status === 200) {
      return res.data;
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export { handleGetTransportInfo };
