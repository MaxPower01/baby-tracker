import ActivityType from "@/modules/activities/enums/ActivityType";
import ActivityBarChart from "@/modules/graphics/components/ActivityBarChart";
import { Box } from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function GraphicsPage() {
  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <ActivityBarChart activityType={ActivityType.BreastFeeding} />
    </Box>
  );
}
