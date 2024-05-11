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
import { EntrySubtitle } from "@/pages/Entry/components/EntrySubtitle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React from "react";
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
  const theme = useTheme();

  return (
    <>
      <TableRow
        key={entry.id ?? uuid()}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
        }}
        // onClick={() => setOpen(!open)}
      >
        <TableCell
          scope="row"
          align="left"
          sx={{
            padding: 0,
            // borderBottom: "unset",
          }}
        >
          <CardActionArea
            sx={{
              paddingTop: 1,
              paddingBottom: 1,
              paddingLeft: 2,
              paddingRight: 2,
            }}
          >
            <Stack spacing={1} direction={"row"} alignItems={"center"}>
              <ActivityIcon
                type={entry.entryTypeId}
                sx={{
                  fontSize: "1.75em",
                }}
              />
              <Typography variant="body2">{title}</Typography>
              <EntrySubtitle
                entry={entry}
                textColor={theme.customPalette.text.tertiary}
              />
            </Stack>
          </CardActionArea>
        </TableCell>
      </TableRow>
      {/* <TableRow
        key={entry.id ?? uuid()}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell
          scope="row"
          align="left"
          sx={{
            padding: 0,
          }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Stack
              spacing={1}
              direction={"row"}
              alignItems={"center"}
              sx={{
                paddingTop: 1,
                paddingBottom: 1,
                paddingLeft: 2,
                paddingRight: 2,
              }}
            >
              <ActivityIcon
                type={entry.entryTypeId}
                sx={{
                  fontSize: "1.75em",
                }}
              />
              <Typography variant="body2">{title}</Typography>
              <EntrySubtitle
                entry={entry}
                textColor={theme.customPalette.text.tertiary}
              />
            </Stack>
          </Collapse>
        </TableCell>
      </TableRow> */}
    </>
  );
}
