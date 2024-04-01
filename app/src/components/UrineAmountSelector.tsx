import { Rating, Stack, Typography, styled, useTheme } from "@mui/material";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import React from "react";
import { getUrineAmountSelectorLegend } from "@/components/getUrineAmountSelectorLegend";

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

export default function UrineAmountSelector(props: Props) {
  const theme = useTheme();
  const legend = getUrineAmountSelectorLegend(props.value);
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
        name="urine-amount-selector"
        size="large"
        icon={
          <ActivityIcon type={EntryTypeId.Urine} sx={{ fontSize: "1.5em" }} />
        }
        emptyIcon={
          <ActivityIcon
            type={EntryTypeId.Urine}
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
