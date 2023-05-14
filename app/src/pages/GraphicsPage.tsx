import { formatStopwatchTime } from "@/lib/utils";
import ActivityType from "@/modules/activities/enums/ActivityType";
import useEntries from "@/modules/entries/hooks/useEntries";
import { Typography, useTheme } from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
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

export default function GraphicsPage() {
  const { entries } = useEntries();
  const theme = useTheme();
  const breastfeedingEntries = entries.filter((entry) => {
    return entry.activity?.type == ActivityType.BreastFeeding;
  });
  const options = {
    indexAxis: "y" as const,
    aspectRatio: 0.1,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        // position: "right" as const,
        display: false,
      },
      // title: {
      //   display: true,
      //   text: "Chart.js Horizontal Bar Chart",
      // },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.data[context.dataIndex].y;
            const time = context.dataset.data[context.dataIndex].time;
            return formatStopwatchTime(time, true);
          },
          title: function (context: any) {
            const label = context[0].dataset.data[context[0].dataIndex].y;
            const originalDate =
              context[0].dataset.data[context[0].dataIndex].originalDate;
            return new Date(originalDate).toLocaleString();
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: true,
        ticks: {
          callback: function (value: any, index: any) {
            const correspondingDate = dates[index];
            return correspondingDate.toLocaleString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h23",
              day: "numeric",
              month: "short",
            });
          },
        },
      },
    },
  };

  let labels: string[] = [];

  // Create an array of 24 dates, one for each hour of the day

  const now = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    new Date().getHours(),
    30
  );
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
    now.getHours(),
    30
  );
  let dates: Date[] = [];

  for (let i = 0; i < 48; i++) {
    const date = new Date(yesterday);
    date.setHours(i);
    const firstDate = new Date(date);
    firstDate.setMinutes(0);
    dates.push(firstDate);
    dates.push(date);
  }

  dates = dates.filter((date) => {
    return date.getTime() <= now.getTime();
  });

  const dateOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    day: "numeric",
    month: "long",
    weekday: "long",
  };

  const datapoints: object[] = [];

  if (breastfeedingEntries.length > 0) {
    breastfeedingEntries.forEach((entry) => {
      const entryDate = new Date(entry.startDate);
      let entryMinutes = entryDate.getMinutes();
      if (entryMinutes > 30) {
        entryDate.setMinutes(30);
      } else {
        entryDate.setMinutes(0);
      }
      const entryLabel = entryDate.toLocaleString(
        undefined,
        dateOptions as any
      );
      if (!dates.includes(entryDate)) {
        dates.push(entryDate);
      }
      const entryDatapoint = {
        x: entry.time,
        y: entryLabel,
        time: entry.time,
        originalDate: entry.startDate,
      };
      datapoints.push(entryDatapoint);
    });
  }

  dates = dates.sort((a, b) => {
    return b.getTime() - a.getTime();
  });

  labels = dates.map((date) => {
    return date.toLocaleString(undefined, dateOptions as any);
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Entrées",
        data: datapoints,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    ],
  };
  return (
    <>
      <Typography variant={"h6"} textAlign={"center"} fontWeight={"bold"}>
        Allaitements
      </Typography>
      <Bar options={options} data={data} />
    </>
  );
}
