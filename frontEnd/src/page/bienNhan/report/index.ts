import { TemplateHandler } from "easy-template-x";
import { getTemplate } from "./form";
import { saveFile } from "./utils";

export async function run(jsonData: unknown) {
  try {
    // setStatus("");

    // 1. read template file
    // setStatus("Getting the template...");
    const templateFile = await getTemplate();

    // 2. read json data
    // setStatus("Parsing data...");
    // const jsonData = getJsonData();

    // 3. process the template
    // setStatus("Creating document...");
    const handler = new TemplateHandler();
    const data = jsonData;
    console.log(data);

    const docx = await handler.process(templateFile, data);
    const tags = await handler.parseTags(templateFile);
    console.log(tags);
    if (!docx) {
      console.log("null");
      return;
    }
    // 4. save output
    // setStatus("Done!");
    saveFile("result.docx", docx);

    // setTimeout(() => setStatus(""), 1000);
  } catch (e) {
    // error handling
    // setStatus("Error: " + e.message, true);
    console.error(e);
  }
}
interface DataBienNhan {
  id: string;
  image: {
    _type: string;
    source: Blob;
    format: string;
    altText?: string;
    width?: number;
    height?: number;
  };
  sender: {
    name: string;
    address: string;
    id?: string;
    phone: string;
    postCode: string;
    time: string;
  };
  receiver: {
    name: string;
    address: string;
    id?: string;
    phone: string;
    postCode: string;
    time?: string;
  };
  mass: {
    extract: number;
    mass: number;
  };
  nd?: {
    value: number;
    note: string;
    quantity: number;
  };
  dv?: string;
  charge: {
    main: number;
    extra: number;
    gtvt: number;
    other: number;
  };
  cod?: {
    cod?: number;
    other?: number;
  };
  sendTime: string;
  // type: [{ hh: boolean; doc: boolean }];
}
const defaultValue = {
  senderName: "",
  senderAddress: "",
  senderPhone: "",
  senderId: "",
  senderPostCode: "",

  receiverName: "",
  receiverAddress: "",
  receiverPhone: "",
  receiverId: "",
  receiverPostCode: "",

  nd: "",

  idBienNhan: "",
  image: {
    _type: "image",
    source: new Blob(),
    format: "",
    altText: "QR", // Optional
    width: 90,
    height: 90,
  },
  // mass: {
  exact: 0,
  mass: 0,

  quantity: 0,
  value: 0,
  note: "",

  chinh: 0,
  extra: 0,
  gtvt: 0,
  sum: 0,
  other: 0,
  totalCuoc: 0,
  cod: 0,
  otherCod: 0,
  totalCod: 0,
  type: [
    {
      hh: true,
      doc: false,
    },
  ],
  sendTime: "",
};

export type { DataBienNhan };

export default async function createReport(input: DataBienNhan) {
  const data = {
    ...defaultValue,
  };
  // sender
  data.senderAddress = input.sender.address;
  data.senderName = input.sender.name;
  data.senderPhone = input.sender.phone;
  data.senderPostCode = input.sender.postCode;
  data.senderId = input.sender.id ? input.sender.id : "";

  // receiver
  data.receiverAddress = input.receiver.address;
  data.receiverId = input.receiver.id ? input.receiver.id : "";
  data.receiverName = input.receiver.name;
  data.receiverPhone = input.receiver.phone;
  data.receiverPostCode = input.receiver.postCode;

  // cuoc
  data.chinh = input.charge.main;
  data.extra = input.charge.extra;
  data.gtvt = input.charge.gtvt;
  data.sum = (data.chinh + data.extra + data.gtvt) * 1.1;
  data.other = input.charge.other;
  data.totalCuoc = data.other + data.sum;

  // cod
  if (!data.cod) {
    data.cod = 0;
    data.otherCod = 0;
  }
  data.cod = input.cod?.cod ? input.cod.cod : 0;
  data.otherCod = input.cod?.other ? input.cod.other : 0;

  // mass
  data.mass = input.mass.mass;
  data.exact = input.mass.extract;

  data.nd = input.dv ? input.dv : "";

  // id & QR
  data.idBienNhan = input.id;
  data.image._type = input.image._type;
  data.image.altText = input.image.altText ? input.image.altText : "QR";
  data.image.format = input.image.format;
  data.image.height = input.image.height ? input.image.height : 90;
  data.image.width = input.image.width ? input.image.width : 90;
  data.image.source = input.image.source;
  data.sendTime = input.sender.time;
  await run(data);
}
