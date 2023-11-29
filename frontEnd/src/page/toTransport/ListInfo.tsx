import { Card } from "antd";
import { TransportInfo } from "../../interface/TransportInterface";
import { ReactElement, useEffect, useState } from "react";

const contentStyle: React.CSSProperties = {
  width: "45%",
  margin: "5px 0px",
};
const containerTitleStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-around",
};
const containerStyle: React.CSSProperties = {
  display: "flex",
  width: "700px",
  justifyContent: "center",
  alignItems: "space-around",
  flexDirection: "column",
};

const titleStyle: React.CSSProperties = {
  fontStyle: "normal",
  fontWeight: "bold",
};

const cardStyle: React.CSSProperties = {
  height: "170px",
};

interface Props {
  data: TransportInfo[];
}

function ListInfo(props: Props) {
  const { data } = props;
  const [content, setContent] = useState<ReactElement[]>([<></>]);
  useEffect(() => {
    const res: ReactElement[] = [];
    const forMap = (e: TransportInfo) => {
      let toContent = <></>;
      if (e.to.name === "ship") {
        toContent = (
          <>
            <div
              style={{
                color: "blue",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <b>SHIPPING</b>
            </div>
          </>
        );
      } else {
        toContent = (
          <>
            <div style={{ color: "blue" }}>
              <b>{e.to.name}</b>
            </div>
            <div>{e.to.type.name}</div>
            <div>{`${e.to.address.address}, ${e.to.address.ward}, ${e.to.address.district}, ${e.to.address.province}`}</div>
          </>
        );
      }
      const tem = (
        <div style={containerTitleStyle}>
          <div style={contentStyle}>
            <Card style={cardStyle}>
              <div style={{ color: "blue" }}>
                <b>{e.bienNhan.id}</b>
              </div>
              <div>{e.bienNhan.tenNgNhan}</div>
              <div>{`${e.bienNhan.addressNgNhan.address}, ${e.bienNhan.addressNgNhan.ward}, ${e.bienNhan.addressNgNhan.district}, ${e.bienNhan.addressNgNhan.province}`}</div>
              <div>{e.bienNhan.sdtNgNhan}</div>
            </Card>
          </div>
          <div style={contentStyle}>
            <Card style={cardStyle}>{toContent}</Card>
          </div>
        </div>
      );
      res.push(tem);
    };
    data.map(forMap);
    setContent(res);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "fit-content",
        maxHeight: "500px",
        overflow: "auto",
      }}
    >
      <div style={containerTitleStyle}>
        <div style={contentStyle}>
          <span style={titleStyle}>BienNhan:</span>
        </div>
        <div style={contentStyle}>
          <span style={titleStyle}>To:</span>
        </div>
      </div>
      <div style={containerStyle}>{content}</div>
    </div>
  );
}

export default ListInfo;
