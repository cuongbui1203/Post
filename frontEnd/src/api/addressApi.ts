import { ResponseAddress } from "../interface/ResponseInterface";
import net from "./net";

const GetDistricts: (id: string) => Promise<ResponseAddress | null> = async (
  id
) => {
  try {
    const res = await net.get("/address/districts", {
      params: {
        id: id,
      },
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }

  return null;
};

const GetWards: (id: string) => Promise<ResponseAddress | null> = async (
  id
) => {
  try {
    const res = await net.get("/address/wards", {
      params: {
        id: id,
      },
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }

  return null;
};

const GetProvinces: () => Promise<ResponseAddress | null> = async () => {
  try {
    const res = await net.get("/address/provinces");
    console.log(res.data);
    return res.data;
  } catch (e) {
    return null;
  }
};

export { GetDistricts, GetProvinces, GetWards };
