import { Button, Card, DatePicker, Select } from "antd";
import { BarChartStack } from "../Chart/BarChart";
import dayjs, { Dayjs } from "dayjs";
import { SetStateAction, useEffect, useState } from "react";
import net from "../../api/net";
import { PieChart } from "../Chart/PieChart";
const { RangePicker } = DatePicker;

function BossThongKeComponent() {
  const [timeStart, setTimeStart] = useState<Dayjs>(dayjs());
  const [timeEnd, setTimeEnd] = useState<Dayjs>(dayjs());
  const [totalHang, setTotalHang] = useState({
    hangGui: 0,
    hangNhan: 0,
  });
  const [type, setType] = useState("all");
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<
    { label: string; data: number[]; backgroundColor: string }[]
  >([]);
  const dateFormat = "DD/MM/YYYY";

  const [labelPie, setLabelPie] = useState<string[]>([]);
  const [dataNhanPie, setDataNhanPie] = useState<number[]>([]);
  const [dataGuiPie, setDataGuiPie] = useState<number[]>([]);

  const handle = async () => {
    const res = await net.get("/thongKe", {
      params: {
        timeStart: timeStart.format("DD-MM-YYYY"),
        timeEnd: timeEnd.format("DD-MM-YYYY"),
        type: type,
      },
    });
    const num = {
      hangGui: [],
      hangNhan: [],
    };
    const l: SetStateAction<string[]> = [];
    console.log(res.data.data);
    const labelTem: string[] = [];
    const guiTem: number[] = [];
    const nhanTem: number[] = [];
    const data = res.data.data;
    data.labels.map((e: { id: string; name: string }) => {
      labelTem.push(e.name);
      l.push(e.name);
      console.log(data.data[`${e.id}`][0]);
      guiTem.push(data.data[`${e.id}`][0].hangGui);
      nhanTem.push(data.data[`${e.id}`][0].hangNhan);
      num.hangGui.push(data.data[`${e.id}`][0].hangGui);
      num.hangNhan.push(data.data[`${e.id}`][0].hangNhan);
    });
    console.log(labelTem);
    setLabelPie(labelTem);
    setDataNhanPie(nhanTem);
    setDataGuiPie(guiTem);
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
          type: "none",
        },
      });
      // console.log(res.data.data.da/ta["9ab10dfb-3451-4b02-9092-a6d4e3db2e87"]);
      const num = {
        hangGui: [],
        hangNhan: [],
      };
      const l = [];
      for (const key in res.data.data) {
        l.push(key);
        const e = res.data.data[key];
        // console.log(e[0].hangGui);
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Thống kê hôm nay</h2>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
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
      </div>
      <div style={{ width: "90%" }}>
        <div>
          <RangePicker
            format={dateFormat}
            allowClear={false}
            showTime={false}
            // defaultValue={[null, null]}
            style={{ width: 400 }}
            value={[timeStart, timeEnd]}
            onChange={(_, s: string[]) => {
              setTimeStart(dayjs(s[0], dateFormat));
              setTimeEnd(dayjs(s[1], dateFormat));
            }}
          />
          <Select
            value={type}
            style={{
              width: "200px",
            }}
            options={[
              {
                label: "Tất cả",
                value: "all",
              },
              {
                label: "Điểm chung chuyển",
                value: "transport",
              },
              {
                label: "Điểm giao dịch",
                value: "transaction",
              },
            ]}
            onChange={(e) => setType(e)}
          />
          <Button onClick={handle}>Get info</Button>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              // margin: "50px 0px",
              // display: "flex",
              width: "60%",
            }}
          >
            <BarChartStack
              labels={labels}
              data={data}
              title="Thống kê hàng gửi nhận trên toàn quốc"
            />
          </div>
          <div
            style={{
              width: "30%",
              // margin: "50px 0px",
            }}
          >
            <PieChart
              labels={labelPie}
              data={dataGuiPie}
              title="Thống kê hàng gửi theo từng điểm"
            />
          </div>
          <div
            style={{
              width: "30%",
              // margin: "50px 0px",
            }}
          >
            <PieChart
              labels={labelPie}
              data={dataNhanPie}
              title="Thống kê hàng nhận theo từng điểm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BossThongKeComponent;
