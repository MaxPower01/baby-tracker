import { Chip, Stack, Typography, useTheme } from "@mui/material";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityModel from "@/pages/Activity/models/ActivityModel";
import CheckIcon from "@mui/icons-material/Check";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { getActivityChipLabel } from "@/utils/getActivityChipLabel";
import { getActivityName } from "@/utils/getActivityName";
import { useSelector } from "react-redux";

type Props = {
  entryType: EntryTypeId;
  onClick?: (type: EntryTypeId) => void;
  isSelected?: boolean;
  /**
   * If provided, will override the text of the chip
   * with a summary of the entries. If not provided,
   * the activity name will be used.
   */
  entries?: Entry[];

  readonly?: boolean;
};

export default function ActivityChip(props: Props) {
  const theme = useTheme();
  const label = props.entries?.length
    ? getActivityChipLabel(props.entries)
    : getActivityName(props.entryType);
  return (
    <Chip
      icon={
        <ActivityIcon
          type={props.entryType as any}
          sx={{
            fontSize: "1.75em",
            marginLeft: 0.5,
            opacity: props.isSelected
              ? theme.opacity.primary
              : theme.opacity.tertiary,
          }}
        />
      }
      label={label}
      sx={{
        borderColor: props.readonly ? "transparent" : undefined,
        "& .MuiChip-label": {
          color: props.isSelected
            ? theme.customPalette.text.primary
            : theme.customPalette.text.tertiary,
          paddingLeft: 0.5,
        },
      }}
      variant={props.isSelected ? "filled" : "outlined"}
      onClick={
        props.readonly
          ? undefined
          : () => {
              if (props.onClick) {
                props.onClick(props.entryType);
              }
            }
      }
    />
  );
}
