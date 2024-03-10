import { Avatar, Stack, SxProps, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";

import Child from "@/pages/Authentication/types/Child";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import formatBabyAge from "@/utils/formatBabyAge";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useChildren } from "@/pages/Baby/components/ChildrenProvider";

type Props = {
  sx?: SxProps;
};

export function BabyWidget(props: Props) {
  const { user } = useAuthentication();
  const { children } = useChildren();
  const theme = useTheme();

  if (user == null || children == null) {
    return <LoadingIndicator />;
  }
  const getBabyAgeLabel = (baby: Child) => {
    const age = formatBabyAge(baby.birthDate);
    if (isNullOrWhiteSpace(age)) {
      return baby.name;
    }
    return `${baby.name.split(" ")[0]} a ${age}`;
  };

  return (
    <Stack
      sx={{
        ...props.sx,
      }}
    >
      {children.map((baby) => {
        let avatarBackgroundColor = "#62CB5C";
        if (baby.sex == "female") {
          avatarBackgroundColor = "#EE64EC";
        } else if (baby.sex == "male") {
          avatarBackgroundColor = "#4F89E8";
        }
        const avatarWidth = isNullOrWhiteSpace(baby.avatar) ? 100 : 150;
        const avatarFontSize = avatarWidth / 2.5;
        return (
          <Stack
            key={baby.id}
            spacing={1}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Avatar
              sx={{
                width: avatarWidth,
                height: avatarWidth,
                fontSize: avatarFontSize,
                backgroundColor: isNullOrWhiteSpace(baby.avatar)
                  ? avatarBackgroundColor
                  : theme.palette.divider,
                border: "2px solid",
                borderColor: "transparent",
              }}
              src={baby.avatar}
            >
              {baby.name
                .split(" ")
                .map((name) => (name[0] ?? "").toUpperCase())}
            </Avatar>
            <Stack>
              <Typography variant="h6" textAlign={"center"}>
                {getBabyAgeLabel(baby)}
              </Typography>
              {/* {!isNullOrWhiteSpace(ageLabels.next) && (
                <Typography
                  variant="body1"
                  color={theme.customPalette.text.secondary}
                  textAlign={"center"}
                >
                  {ageLabels.next}
                </Typography>
              )} */}
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}
