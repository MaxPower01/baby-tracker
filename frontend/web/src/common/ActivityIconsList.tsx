import { Box } from "@mui/material";
import { ActivityIconType } from "../lib/enums";
import ActivityIcon from "./ActivityIcon";

type Props = {
  onActivityIconClick?: (type: ActivityIconType) => void;
};

export default function ActivityIconsList({ onActivityIconClick }: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 1,
      }}
    >
      {Object.values(ActivityIconType).map((key) => (
        <ActivityIcon
          key={key}
          type={key as ActivityIconType}
          showLabel
          sx={{ paddingTop: 4, paddingBottom: 4 }}
          onClick={() => {
            if (onActivityIconClick) {
              onActivityIconClick(key as ActivityIconType);
            }
          }}
        />
      ))}
    </Box>
  );
}
