import { AddressInfo } from "../../interface/ResponseInterface";

const getAddress: (address: AddressInfo) => string = (address) => {
  return `${address.address}, ${address.ward}, ${address.district}, ${address.province}`;
};

export { getAddress };
