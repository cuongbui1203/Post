import { Button, Image, Popover, Select } from "antd";
import React, { useEffect, useState } from "react";
import map from "../map.png";
import { GetProvinces } from "../api/addressApi";
import { handleSearchTransactionPoint } from "../api/workPlateApi";
// import { imgSrcMap } from "../ConstVar";
import ItemWPListComponent from "./ItemWPListComponent";

interface SelectOptionType {
  value: string;
  label: string;
}

const container: React.CSSProperties = {
  display: "flex",
  width: "100%",
  height: "100%",
  justifyContent: "center",
};

const listContainer: React.CSSProperties = {
  overflow: "auto",
  maxHeight: "400px",
  width: "500px",
  display: "flex",
  // justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};
const h1Style: React.CSSProperties = {
  fontSize: "100px",
};
const textStyle: React.CSSProperties = {
  display: "block",
  fontSize: "large",
  width: "100px",
};
const textContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
};

const searchStyle: React.CSSProperties = {
  display: "flex",
  width: "100%",
  justifyContent: "center",
};

export default function ContentComponent() {
  const [idProvince, setIdProvince] = useState("");
  const [opt, setOpt] = useState<SelectOptionType[]>([]);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState([<></>]);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const handleChange = (e: string) => {
    console.log(e);
    setIdProvince(e);
  };

  const handleClick = async () => {
    if (!idProvince) return;
    setOpen(true);
    const res = await handleSearchTransactionPoint(idProvince);
    if (!res) return;
    const ress: JSX.Element[] = [];
    res.data.map((e) => {
      ress.push(<ItemWPListComponent workPlate={e} />);
    });
    setContent(ress);
  };

  useEffect(() => {
    const handle = async () => {
      const res = await GetProvinces();
      console.log(res);
      if (res) {
        const tem: SelectOptionType[] = [];
        res.data.map((e) => {
          tem.push({
            value: e.id,
            label: e.name,
          });
        });
        setOpt(tem);
      }
    };
    handle();
  }, []);

  return (
    <div style={container}>
      <Image src={map} width={350} preview={false} />
      <div>
        <div style={searchStyle}>
          <Select
            placeholder="Tinh thanh pho"
            style={{ width: 360 }}
            onChange={handleChange}
            options={opt}
          />
          <Popover
            content={
              <div style={listContainer}>
                {content.length > 0 ? content : "k co thong tin"}
              </div>
            }
            title="Diem giao dich"
            trigger={"contextMenu"}
            placement="bottomRight"
            open={open}
            onOpenChange={handleOpenChange}
          >
            <Button
              onClick={handleClick}
              type="primary"
              style={{
                margin: "0px 10px",
                padding: "auto",
                alignItems: "center",
                textAlign: "center",
                backgroundColor: "#69b76c",
              }}
              icon={
                <img
                  width={"15px"}
                  src="https://giaohangtietkiem.vn/wp-content/plugins/ghtk-post-offices/assets/img/icon-search.png"
                />
              }
            >
              tim kiem diem giao hang
            </Button>
          </Popover>
        </div>
        <div style={textContainerStyle}>
          <h1 style={h1Style}>1000+++</h1>
          <div>
            <span style={textStyle}>diem giao dich ...</span>
            <span style={textStyle}>... tren toan quoc</span>
          </div>
        </div>
      </div>
    </div>
  );
}
