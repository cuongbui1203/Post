/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Card, DatePicker } from "antd";
import { DoughnutChart } from "../Chart/DoughnutChart";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import {
  handleGetInfoThongKeHang,
  handleGetTotalBNToday,
} from "../../api/thongKeApi";
import { StatusEnum } from "../../enums/enum";

const { RangePicker } = DatePicker;

function EmployeeThongKeComponent() {
  const [timeStart, setTimeStart] = useState<Dayjs>(dayjs());
  const [timeEnd, setTimeEnd] = useState<Dayjs>(dayjs());
  const dateFormat = "DD/MM/YYYY";
  const [totalBn, setTotalBn] = useState(0);
  const [dataChart, setDataChart] = useState<number[]>([0, 0, 0]);
  const handle = async () => {
    try {
      const res = await handleGetInfoThongKeHang(
        timeStart.format("YYYY-MM-DD"),
        timeEnd.format("YYYY-MM-DD")
      );

      console.log(res?.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tem = [
        res?.data[StatusEnum.Done],
        res?.data[StatusEnum.Return],
        res?.data[StatusEnum.Fail],
      ];
      setDataChart(tem);
      // setGroupedData([]);
      // console.log(groupedData);
    } catch (err) {
      console.log(err);
      return;
    }
  };
  useEffect(() => {
    const handle = async () => {
      const res = await handleGetTotalBNToday(dayjs().format("YYYY-MM-DD"));
      setTotalBn(res);
    };
    handle();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>THỐNG KÊ CÁC ĐƠN HÀNG</h2>
      <div
        style={{
          width: "100%",
          height: "fit-content",
          display: "flex",
          justifyContent: "space-around",
          // alignContent: "center",
        }}
      >
        <Card style={{ width: "500px", height: "fit-content" }}>
          <div>
            <h2>Tổng số đơn hàng đã tạo: {totalBn}</h2>
          </div>
        </Card>
        <Card style={{ width: "500px", height: "fit-content" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
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
            <DoughnutChart
              data={dataChart}
              labels={["Done", "Fail", "Return"]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default EmployeeThongKeComponent;
