import { Box, IconButton, SxProps } from "@mui/material";
import React, { useState } from "react";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { FiltersDrawer } from "@/pages/History/components/FiltersDrawer";

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
