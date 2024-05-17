import { Chip, useTheme } from "@mui/material";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { EntryTypeIcon } from "@/pages/Activities/components/EntryTypeIcon";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

type Props = {
  entryTypeId?: EntryTypeId | null;
  activityContext: ActivityContext;
  onClick?: (type: ActivityContext) => void;
  isSelected?: boolean;
  /**
   * If provided, will override the text of the chip
   * with a summarActivityContext of the entries. If not provided,
   * the activity name will be used.
   */
  readonly?: boolean;
};

export function ActivityContextChip(props: Props) {
  const theme = useTheme();
  const label = props.activityContext.name;
  return (
    <Chip
      icon={
        props.entryTypeId == null ? undefined : (
          <EntryTypeIcon
            type={props.entryTypeId as any}
            sx={{
              fontSize: "1.75em",
              marginLeft: 0.5,
              opacity: props.isSelected
                ? theme.opacity.primary
                : theme.opacity.tertiary,
            }}
          />
        )
      }
      label={label}
      sx={{
        borderColor: props.readonly ? "transparent" : undefined,
        "& .MuiChip-label": {
          color: props.isSelected
            ? theme.customPalette.text.primary
            : theme.customPalette.text.tertiary,
          paddingLeft: props.entryTypeId == null ? undefined : 0.5,
        },
      }}
      variant={props.isSelected ? "filled" : "outlined"}
      onClick={
        props.readonly
          ? undefined
          : () => {
              if (props.onClick) {
                props.onClick(props.activityContext);
              }
            }
      }
    />
  );
}
