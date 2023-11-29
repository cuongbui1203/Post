import React from "react";
import { Image } from "antd";

function InfoCard() {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Image
          src="https://wallpapers.com/images/hd/anime-profile-picture-jioug7q8n43yhlwn.jpg"
          width={200}
          height={200}
        />
      </div>
      <div style={{ margin: "0px 30px" }}>
        <div>Name: </div>
        <div>DOB: </div>
        <div>Address: </div>
      </div>
    </div>
  );
}

export default InfoCard;
