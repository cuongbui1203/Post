import { AddressInfo, ResponseInfo, WorkPlateInfo } from "./ResponseInterface";

interface BienNhanTransport {
  id: string;
  tenNgNhan: string;
  sdtNgNhan: string;
  addressNgNhan: AddressInfo;
}

interface TransportInfo {
  bienNhan: BienNhanTransport;
  to: WorkPlateInfo;
}

interface ResponseTransportInfo extends ResponseInfo {
  data: TransportInfo[];
}

export type {
  TransportInfo,
  BienNhanTransport,
  TransportInfo,
  ResponseTransportInfo,
};
