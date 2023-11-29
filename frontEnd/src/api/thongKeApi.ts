import { AxiosResponse } from "axios";
import { ResponseInfo, ResponseThongKe } from "../interface/ResponseInterface";
import net from "./net";

const handleGetInfoThongKeHang: (
  timeStart: string,
  timeEnd: string
) => Promise<ResponseThongKe | null> = async (timeStart, timeEnd) => {
  try {
    const res = await net.get("/thongKe", {
      params: {
        timeStart: timeStart,
        timeEnd: timeEnd,
      },
    });
    return res.data;
  } catch (err) {
    return null;
  }
};

const handleGetTotalBNToday: (time: string) => Promise<number> = async (
  time
) => {
  try {
    const res: AxiosResponse<ResponseInfo & { data: number }> = await net(
      "/thongKe/today",
      {
        params: {
          time: time,
        },
      }
    );

    return res.data.data;
  } catch (err) {
    console.log(err);
    return 0;
  }
};
export { handleGetInfoThongKeHang, handleGetTotalBNToday };
