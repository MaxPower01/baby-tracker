import {
  Box,
  CardActionArea,
  CardContent,
  Collapse,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryBody } from "@/pages/Entry/components/EntryBody";
import { EntrySubtitle } from "@/pages/Entry/components/EntrySubtitle";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React from "react";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import { getEntryTitle } from "@/utils/getEntryTitle";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import { v4 as uuid } from "uuid";

type Props = {
  entry: Entry;
};

export function EntriesTableRow(props: Props) {
  const { entry } = props;
  const [open, setOpen] = React.useState(false);
  const title = getEntryTitle(entry);
  const startDate = getDateFromTimestamp(entry.startTimestamp);
  const endDate = getDateFromTimestamp(entry.endTimestamp);
  let caption = startDate.toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (entry.startTimestamp !== entry.endTimestamp) {
    if (
      props.entry.leftStopwatchIsRunning ||
      props.entry.rightStopwatchIsRunning
    ) {
      caption += " - en cours";
    } else {
      const isDifferentDay = startDate.getDate() !== endDate.getDate();
      const isDifferentMonth = startDate.getMonth() !== endDate.getMonth();
      const isDifferentYear = startDate.getFullYear() !== endDate.getFullYear();
      caption += ` – ${endDate.toLocaleTimeString("fr-CA", {
        minute: "2-digit",
        hour: "2-digit",
        day: isDifferentDay || isDifferentMonth ? "numeric" : undefined,
        month: isDifferentDay || isDifferentMonth ? "long" : undefined,
        year: isDifferentYear ? "numeric" : undefined,
      })}`;
    }
  }
  const theme = useTheme();

  return (
    <>
      <TableRow
        key={entry.id ?? uuid()}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
          cursor: "pointer",
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell
          scope="row"
          align="left"
          sx={{
            // padding: 0,
            paddingLeft: 0.5,
            borderBottom: "unset",
          }}
        >
          {/* <CardActionArea
            component={Box}
            sx={{
              paddingTop: 1,
              paddingBottom: 1,
              paddingLeft: 0.5,
              paddingRight: 1.5,
            }}
          > */}
          <Stack
            spacing={1}
            direction={"row"}
            alignItems={"center"}
            sx={{
              width: "100%",
            }}
          >
            <IconButton
              aria-label="expand row"
              size="small"
              sx={{
                flexShrink: 0,
              }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            <Stack
              spacing={4}
              direction={"row"}
              alignItems={"center"}
              sx={{
                width: "100%",
              }}
            >
              <Stack
                spacing={1}
                direction={"row"}
                alignItems={"center"}
                sx={{
                  flexGrow: 1,
                }}
              >
                <ActivityIcon
                  type={entry.entryTypeId}
                  sx={{
                    fontSize: "1.75em",
                  }}
                />

                <Stack>
                  <Typography
                    variant={"caption"}
                    sx={{
                      lineHeight: 1,
                      opacity: theme.opacity.tertiary,
                      fontWeight: 300,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {caption}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "nowrap",
                    }}
                  >
                    {title}
                  </Typography>
                </Stack>
              </Stack>

              <EntrySubtitle
                entry={entry}
                textColor={theme.customPalette.text.tertiary}
                sx={{
                  // whiteSpace: "nowrap",
                  textAlign: "right",
                }}
              />
            </Stack>
          </Stack>
          {/* </CardActionArea> */}
        </TableCell>
        {/* <TableCell
          scope="row"
          align="left"
          sx={{
            borderBottom: "unset",
          }}
        >
          <EntrySubtitle
            entry={entry}
            textColor={theme.customPalette.text.tertiary}
            sx={{
              whiteSpace: "nowrap",
            }}
          />
        </TableCell> */}
      </TableRow>
      <TableRow
        key={`${entry.id ?? uuid()}-collapse`}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell
          scope="row"
          align="left"
          // colSpan={2}
          sx={{
            padding: 0,
          }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <EntryBody
              entry={entry}
              sx={{
                width: "100%",
                padding: 2,
              }}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
