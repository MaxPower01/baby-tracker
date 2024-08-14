import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import { BarChart } from "@/pages/Charts/components/BarChart";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntrySubtitle } from "@/pages/Entry/components/EntrySubtitle";
import { EntryTypeIcon } from "@/pages/Activities/components/EntryTypeIcon";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import React from "react";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { getEntryTypeName } from "@/utils/getEntryTypeName";

type XAxisUnit = "hours" | "days";
type YAxisUnit = "count" | "duration" | "volume";

type Props = {
  entries: Entry[];
  timePeriod: TimePeriodId;
  yAxisUnit: YAxisUnit;
};

function getSubtitle(xAxisUnit: XAxisUnit, yAxisUnit: YAxisUnit) {
  let result;

  switch (yAxisUnit) {
    case "count":
      result = "Nombre par";
      break;
    case "duration":
      result = "Durée par";
      break;
    case "volume":
      result = "Volume par";
      break;
    default:
      break;
  }

  if (xAxisUnit === "days") {
    result += " jour";
  } else {
    result += " heure";
  }
  return result;
}

export function ChartCard(props: Props) {
  const theme = useTheme();

  const entryTypeId = props.entries[0].entryTypeId;

  const hoursTimePeriodIds = [TimePeriodId.Today, TimePeriodId.Last2Days];

  const xAxisUnit: XAxisUnit = hoursTimePeriodIds.includes(props.timePeriod)
    ? "hours"
    : "days";

  const title = getEntryTypeName(entryTypeId);
  const subtitle = getSubtitle(xAxisUnit, props.yAxisUnit);

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction={"row"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            spacing={2}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "3.5em",
                height: "3.5em",
                borderRadius: "50%",
                border: "1px solid",
                backgroundColor: "transparent",
                flexShrink: 0,
                zIndex: 1,
                borderColor: "transparent",
                boxShadow: "",
              }}
            >
              <EntryTypeIcon
                type={entryTypeId}
                sx={{
                  fontSize: "3em",
                }}
              />
            </Box>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              spacing={2}
              sx={{
                flexGrow: 1,
              }}
            >
              <Stack spacing={0.25}>
                <Typography
                  variant={"body1"}
                  fontWeight={600}
                  sx={{
                    opacity: theme.opacity.primary,
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  variant={"body2"}
                  fontWeight={400}
                  sx={{
                    opacity: theme.opacity.secondary,
                  }}
                >
                  {subtitle}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <BarChart
            backgroundColor={theme.palette.background.paper}
            barColor={theme.palette.primary.main}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
