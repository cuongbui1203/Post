import { Button, QRCode } from "antd";
import { LegacyRef, useRef, useState } from "react";
import { useStore } from "../../state/hooks";
import createReport, { DataBienNhan } from "./report";
import { AddressInfo, BienNhanInfo } from "../../interface/ResponseInterface";

function PrintBienNhan() {
  const qr = useRef() as LegacyRef<HTMLDivElement>;
  // const [showQr, setShowQr] = useState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, dispatch] = useStore();
  const { bienNhan }: { bienNhan: BienNhanInfo | null } = state;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [img, setImg] = useState<Blob | null>();
  const handleClick = () => {
    if (!bienNhan) return;
    const canvas = document
      .getElementById("myqrcode")
      ?.querySelector<HTMLCanvasElement>("canvas");
    if (canvas) {
      // const url = canvas.toDataURL();

      // console.log(data);
      console.log(bienNhan);
      canvas.toBlob((blob) => {
        const senderAddress: AddressInfo = bienNhan.address_ng_gui.address;
        const receiverAddress: AddressInfo = bienNhan.address_ng_nhan.address;
        setImg(blob);
        const data: DataBienNhan = {
          id: bienNhan.id,
          image: {
            _type: "image",
            source: blob ? blob : new Blob(),
            format: "image/png",
          },
          sender: {
            name: bienNhan.ten_ng_gui,
            address: `${senderAddress.address}, ${senderAddress.ward}, ${senderAddress.district}, ${senderAddress.province}`,
            phone: bienNhan.sdt_ng_gui,
            postCode: "",
            time: bienNhan.ngay_gui,
          },
          receiver: {
            name: bienNhan.ten_ng_nhan,
            address: `${receiverAddress.address}, ${receiverAddress.ward}, ${receiverAddress.district}, ${receiverAddress.province}`,
            // address: "",
            // id: undefined,
            phone: bienNhan.sdt_ng_nhan,
            postCode: "",
            time: undefined,
          },
          mass: {
            extract: 0,
            mass: JSON.parse(bienNhan.mass),
          },
          charge: {
            main: bienNhan.cod,
            extra: 0,
            gtvt: 0,
            other: 0,
          },
          sendTime: bienNhan.ngay_gui,
        };
        console.log(data);
        createReport(data);
      });
    }
  };
  return (
    <div
      ref={qr}
      id="myqrcode"
      // onClick={test}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h2>Tạo thành công</h2>
      <span>Đây là mã Biên Nhận của bạn </span>
      <QRCode
        value={bienNhan ? bienNhan?.id : ""}
        bgColor="#fff"
        style={{ marginBottom: 16 }}
      />
      <Button onClick={handleClick}>In</Button>
    </div>
  );
}

export default PrintBienNhan;
