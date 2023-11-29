import { Button, Card, DatePicker } from "antd";
import { BarChartStack } from "../Chart/BarChart";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
// import { handleGetInfoThongKeHang } from "../../api/thongKeApi";
import net from "../../api/net";
const { RangePicker } = DatePicker;

function ManagerThongKeComponent() {
  const [timeStart, setTimeStart] = useState<Dayjs>(dayjs());
  const [timeEnd, setTimeEnd] = useState<Dayjs>(dayjs());
  const [totalHang, setTotalHang] = useState({
    hangGui: 0,
    hangNhan: 0,
  });

  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<
    { label: string; data: number[]; backgroundColor: string }[]
  >([]);
  const dateFormat = "DD/MM/YYYY";
  const handle = async () => {
    const res = await net.get("/thongKe", {
      params: {
        timeStart: timeStart.format("DD-MM-YYYY"),
        timeEnd: timeEnd.format("DD-MM-YYYY"),
      },
    });
    console.log(res.data.data);
    const num = {
      hangGui: [],
      hangNhan: [],
    };
    const l = [];
    for (const key in res.data.data) {
      l.push(key);
      const e = res.data.data[key];
      console.log(e[0].hangGui);

      num.hangGui.push(e[0].hangGui);
      num.hangNhan.push(e[0].hangNhan);
    }
    setLabels(l);
    setData([
      {
        label: "Hàng gửi",
        data: num.hangGui,
        backgroundColor: "#4c8aed",
      },

      {
        label: "Hàng nhận",
        data: num.hangNhan,
        backgroundColor: "#3bbdd1",
      },
    ]);
  };
  // const handleGetInfo = async () => {};
  useEffect(() => {
    const handle = async () => {
      const tem = {
        hangGui: 0,
        hangNhan: 0,
      };
      const res = await net.get("/thongKe", {
        params: {
          timeStart: timeStart.format("DD-MM-YYYY"),
          timeEnd: timeEnd.format("DD-MM-YYYY"),
        },
      });
      console.log(res.data.data);
      const num = {
        hangGui: [],
        hangNhan: [],
      };
      const l = [];
      for (const key in res.data.data) {
        l.push(key);
        const e = res.data.data[key];
        console.log(e[0].hangGui);
        tem.hangGui = e[0].hangGui;
        tem.hangNhan = e[0].hangNhan;
        num.hangGui.push(e[0].hangGui);
        num.hangNhan.push(e[0].hangNhan);
      }
      setLabels(l);
      setData([
        {
          label: "Hàng gửi",
          data: num.hangGui,
          backgroundColor: "#4c8aed",
        },

        {
          label: "Hàng nhận",
          data: num.hangNhan,
          backgroundColor: "#3bbdd1",
        },
      ]);
      setTotalHang(tem);
    };
    handle();
    console.log(totalHang);
    console.log(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Card style={{ width: "500px", height: "fit-content" }}>
          <div>
            <h2>Tổng số đơn hàng gửi: {totalHang.hangGui}</h2>
          </div>
        </Card>

        <Card style={{ width: "500px", height: "fit-content" }}>
          <div>
            <h2>Tổng số đơn hàng nhận: {totalHang.hangNhan}</h2>
          </div>
        </Card>
      </div>
      <div style={{ width: "90%" }}>
        <div>
          <RangePicker
            format={dateFormat}
            allowClear={false}
            showTime={false}
            // defaultValue={[null, null]}
            value={[timeStart, timeEnd]}
            onChange={(_, s: string[]) => {
              setTimeStart(dayjs(s[0], dateFormat));
              setTimeEnd(dayjs(s[1], dateFormat));
            }}
          />
          <Button onClick={handle}>Get info</Button>
        </div>
        <BarChartStack
          labels={labels}
          data={data}
          title="Thống kê hàng gửi nhận"
        />
      </div>
    </div>
  );
}

export default ManagerThongKeComponent;
