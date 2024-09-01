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
import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisType } from "@/types/YAxisType";
import { getChartCardSubtitle } from "@/pages/Charts/utils/getChardCardSubtitle";
import { getEntryTypeName } from "@/utils/getEntryTypeName";

type Props = {
  entries: Entry[];
  entryTypeId: EntryTypeId;
  timePeriod: TimePeriodId;
  yAxisType: YAxisType;
};

export function ChartCard(props: Props) {
  const theme = useTheme();

  const hoursTimePeriodIds = [TimePeriodId.Last24Hours, TimePeriodId.Last2Days];

  const xAxisUnit: XAxisUnit = hoursTimePeriodIds.includes(props.timePeriod)
    ? "hours"
    : "days";

  const title = getEntryTypeName(props.entryTypeId);
  const subtitle = getChartCardSubtitle(xAxisUnit, props.yAxisType);

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
                type={props.entryTypeId}
                sx={{
                  fontSize: "2.75em",
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
            entries={props.entries}
            entryTypeId={props.entryTypeId}
            timePeriod={props.timePeriod}
            xAxisUnit={xAxisUnit}
            yAxisType={props.yAxisType}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
