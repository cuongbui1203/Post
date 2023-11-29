import { Image } from "antd";
import React from "react";
import { WorkPlate } from "../interface/ResponseInterface";
import { imgSrcWP } from "../ConstVar";

const styleContainer: React.CSSProperties = {
  width: "95%",
  // backgroundColor: "blue",
  display: "flex",
};

const styleInfo: React.CSSProperties = {
  display: "flex",
  width: "75%",
  flexDirection: "column",
};

interface Props {
  workPlate: WorkPlate;
}

function ItemWPListComponent(props: Props) {
  // console.log();
  const { workPlate } = props;
  const address =
    workPlate.address.address +
    "," +
    workPlate.address.ward +
    "," +
    workPlate.address.district +
    "," +
    workPlate.address.province;
  return (
    <div style={styleContainer}>
      <Image src={imgSrcWP} preview={false} width={"25%"} height={100} />
      <div style={styleInfo}>
        <div style={{ color: "blue" }}>
          <strong>{workPlate.name}</strong>
        </div>
        <div>{address}</div>
      </div>
    </div>
  );
}

export default ItemWPListComponent;
