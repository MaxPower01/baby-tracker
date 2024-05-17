import { Box, IconButton, SxProps } from "@mui/material";
import React, { useState } from "react";

import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { FiltersDrawer } from "@/components/Filters/FiltersDrawer";
import { SortOrderId } from "@/enums/SortOrderId";

type Props = {
  sx?: SxProps;
};

export function FiltersPicker(props: Props) {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          ...props.sx,
        }}
      >
        <IconButton
          size="large"
          onClick={() => {
            setDrawerIsOpen(true);
          }}
        >
          <FilterAltIcon />
        </IconButton>
      </Box>

      <FiltersDrawer
        isOpen={drawerIsOpen}
        onClose={() => {
          setDrawerIsOpen(false);
        }}
      />
    </>
  );
}
