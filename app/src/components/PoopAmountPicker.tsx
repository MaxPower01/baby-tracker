import { Rating, Stack, Typography, styled, useTheme } from "@mui/material";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import React from "react";
import { getPoopAmountSelectorLegend } from "@/components/getPoopAmountSelectorLegend";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

type Props = {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
};

export function PoopAmountPicker(props: Props) {
  const theme = useTheme();
  const legend = getPoopAmountSelectorLegend(props.value);
  return (
    <Stack direction={"column"} justifyContent={"center"} alignItems={"center"}>
      <Typography
        variant="body1"
        sx={{
          color:
            props.value === 0
              ? theme.customPalette.text.tertiary
              : theme.customPalette.text.primary,
          textAlign: "center",
        }}
        gutterBottom
      >
        {legend}
      </Typography>
      <StyledRating
        name="poop-amount-selector"
        size="large"
        icon={<ActivityIcon type={EntryType.Poop} sx={{ fontSize: "1.5em" }} />}
        emptyIcon={
          <ActivityIcon
            type={EntryType.Poop}
            monochrome
            sx={{ fontSize: "1.5em", opacity: theme.opacity.disabled }}
          />
        }
        value={props.value}
        onChange={(_, newValue) => {
          props.setValue(newValue ?? 0);
        }}
      />
    </Stack>
  );
}
