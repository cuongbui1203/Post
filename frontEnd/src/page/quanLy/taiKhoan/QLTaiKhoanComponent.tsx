import { ReactElement, useEffect, useState } from "react";
import ListItem, { Data } from "../ListItem";
import net from "../../../api/net";

const createContent = (name: string, data: Data[]) => {
  return (
    <div>
      <h2>{name}</h2>
      <ListItem data={data} />
    </div>
  );
};

function QLTaiKhoanComponent() {
  const [listContent, setListContent] = useState<ReactElement[]>([]);
  useEffect(() => {
    const handle = async () => {
      const res = await net.get("quanLy/users");
      console.group("data quan ly");
      console.log(res.data.data);
      const wps = res.data.data.workPlate;
      const users = res.data.data.users;
      const size = wps.length;
      console.log(wps);
      console.log(users);
      console.log(size);
      const tg: ReactElement[] = [];
      for (let i = 0; i < size; i++) {
        const dataUsers: Data[] = [];
        for (let t = 0; t < users[i].length; t++) {
          const tg2: Data = {
            name: users[i][t].name,
            type: "user",
            detail: users[i][t].roleName,
            uuid: users[i][t].uuid,
          };
          dataUsers.push(tg2);
        }
        tg.push(createContent(wps[i].name, dataUsers));
      }
      console.groupEnd();
      setListContent(tg);
    };
    handle();
  }, []);
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h2>Quản lý tài khoản</h2>
      <div>{listContent}</div>
    </div>
  );
}

export default QLTaiKhoanComponent;
