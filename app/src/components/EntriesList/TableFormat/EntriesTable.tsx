import {
  Box,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { DateHeader } from "@/components/DateHeader";
import { EntriesTableRow } from "@/components/EntriesList/TableFormat/EntriesTableRow";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeChips } from "@/pages/Activities/components/EntryTypeChips";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import { v4 as uuid } from "uuid";

type Props = {
  entries: Entry[];
};

export function EntriesTable(props: Props) {
  const theme = useTheme();

  const [topHeight, setTopHeight] = useState<{
    topbarHeight: number;
    filterChipsHeight: number;
    totalHeight: number;
  } | null>(null);

  useEffect(() => {
    function handleResize() {
      requestAnimationFrame(() => {
        const result = {
          topbarHeight: 0,
          filterChipsHeight: 0,
          totalHeight: 0,
        };
        const topbar = document.getElementById("topbar");
        let topbarHeight = topbar?.clientHeight;
        if (topbarHeight != null) {
          topbarHeight -= 1;
        }
        result.topbarHeight = topbarHeight ?? 0;
        const filterChips =
          document.getElementsByClassName("EntriesFilterChips");
        if (filterChips.length > 0) {
          const filterChipsHeight = filterChips[0].clientHeight - 1;
          result.filterChipsHeight = filterChipsHeight;
        }
        result.totalHeight = result.topbarHeight + result.filterChipsHeight;
        setTopHeight(result);
      });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (props.entries.length === 0) {
    return null;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="entries-table" size="small">
        {/* <TableHead>
          <TableRow>
            <TableCell
              sx={{
                border: 0,
                paddingBottom: 0,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                {getDateFromTimestamp(
                  props.entries[0].startTimestamp
                ).toLocaleDateString("fr-CA", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{
                paddingLeft: 1,
                paddingRight: 1,
                paddingTop: 0,
              }}
            >
              <EntryTypeChips entries={props.entries} readonly />
            </TableCell>
          </TableRow>
        </TableHead> */}
        <TableBody>
          {props.entries.map((entry) => (
            <EntriesTableRow key={entry.id ?? uuid()} entry={entry} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
