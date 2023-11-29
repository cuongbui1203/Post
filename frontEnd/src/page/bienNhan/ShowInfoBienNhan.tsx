import { ReactElement, useEffect, useState } from "react";
import { handelGetBienNhan } from "../../api/bienNhan";
import { HistoryInfo } from "../../interface/ResponseInterface";
import { Card } from "antd";
import CheckmarkIcon from "../../icon/CheckmarkIcon";
import PendingIcon from "../../icon/PendingIcon";
import { StatusEnum } from "../../enums/enum";
import { getAddress } from "../../component/address/AddressConvert";
import dayjs from "dayjs";
import CancelIcon from "../../icon/CancelIcon";

interface Props {
  id: string;
}

// const Icons = [StatusEnum.AtTransportPoint];

const infoStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  // alignItems: "center",
  flexDirection: "column",
  width: "45%",
};
const titleStyle: React.CSSProperties = {
  fontWeight: "bold",
};
function ShowInfoBienNhan(props: Props) {
  const { id } = props;
  const [content, setContent] = useState(<></>);
  // const [histories, setHistories] = useState<ReactElement[]>([]);
  // const [data, setData] = useState<BienNhanInfo>({});
  useEffect(() => {
    const handleHistories = (data: HistoryInfo[]) => {
      const res: ReactElement[] = [];
      const forMap = (e: HistoryInfo) => {
        let icon = <CheckmarkIcon size={50} />;
        switch (e.status_id) {
          case StatusEnum.Done:
          case StatusEnum.Complete:
          case StatusEnum.Create:
            icon = <CheckmarkIcon size={50} />;
            break;
          case StatusEnum.Fail:
            icon = <CancelIcon size={50} />;
            break;
          default:
            icon = <PendingIcon size={50} />;
        }
        let time = "";
        if (
          e.status_id === StatusEnum.Done ||
          e.status_id === StatusEnum.Complete ||
          e.status_id === StatusEnum.Create ||
          e.status_id === StatusEnum.Fail
        )
          time = dayjs(e.updated_at).format("DD/MM/YYYY HH:mm:ss");
        // const time = e.status_id == StatusEnum.Done ? dayjs(e.updated_at).format("DD/MM/YYYY HH:mm:ss");
        res.push(
          <>
            <Card>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                }}
              >
                <span style={{ margin: "0px 20px 0px 0px" }}>{icon}</span>
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <b>{e.from.name}</b>
                    <span style={{ color: "rgba(0,0,0,0.4)" }}>{time}</span>
                  </div>
                  <div>{getAddress(e.from.address)}</div>
                  <div>
                    <span>Hành động: </span>
                    <span>{e.description}</span>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </Card>
          </>
        );
      };

      data.map(forMap);
      return res;
    };

    const handle = async () => {
      const res = await handelGetBienNhan(id);
      if (res) {
        console.log(res.data);
        // setData(res.data);
        const histories = handleHistories(res.data.histories);
        setContent(
          <div>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <div style={infoStyle}>
                <span style={titleStyle}>Người Gửi</span>
                <div>
                  <div>
                    <span>Tên: </span>
                    <span>{res.data.ten_ng_gui}</span>
                  </div>
                  <div>
                    <span>Số điện thoại: </span>
                    <span>{res.data.sdt_ng_gui}</span>
                  </div>
                  <div>
                    <span>Địa chỉ: </span>
                    <span>{getAddress(res.data.address_ng_gui.address)}</span>
                  </div>
                </div>
              </div>
              <div style={infoStyle}>
                <span style={titleStyle}>Người Nhận</span>
                <div>
                  <div>
                    <div>
                      <span>Tên: </span>
                      <span>{res.data.ten_ng_nhan}</span>
                    </div>
                    <div>
                      <span>Số điện thoại: </span>
                      <span>{res.data.sdt_ng_nhan}</span>
                    </div>
                    <div>
                      <span>Địa chỉ: </span>
                      {/* <span>{`${res.data.address_ng_nhan.address.address}, ${res.data.address_ng_nhan.address.ward}, ${res.data.address_ng_nhan.address.district}, ${res.data.address_ng_nhan.address.province}`}</span> */}
                      <span>
                        {getAddress(res.data.address_ng_nhan.address)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ margin: "30px 0px 0px 0px" }}>
              <span style={titleStyle}>Lịch sử hoạt động</span>
              <div
                style={{
                  display: "grid",
                  gap: "20px",
                  maxHeight: "500px",
                  overflow: "auto",
                }}
              >
                {histories}
              </div>
            </div>
          </div>
        );
      }
    };
    handle();
  }, []);
  // setContent(<div></div>);
  return <> {content}</>;
}

export default ShowInfoBienNhan;
