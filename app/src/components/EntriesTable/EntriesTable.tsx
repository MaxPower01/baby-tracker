import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { Entry } from "@/pages/Entry/types/Entry";

type Props = {
  entries: Entry[];
};

export function EntriesTable(props: Props) {
  if (props.entries.length === 0) {
    return null;
  }
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

  return <div>EntriesTable</div>;
}
