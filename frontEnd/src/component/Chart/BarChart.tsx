import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Data = { label: string; data: number[]; backgroundColor: string };

interface Props {
  labels: string[];
  data: Data[];
  title: string;
}

function BarChartStack(props: Props) {
  const { labels, data, title } = props;
  const options = {
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
  const datasets: Data[] = [];
  data.map((e) => {
    datasets.push({
      label: e.label,
      data: e.data,
      backgroundColor: e.backgroundColor,
    });
  });
  const dataChart = {
    labels,
    datasets: datasets,
  };

  return <Bar options={options} data={dataChart} />;
}

export { BarChartStack };
