import { Avatar, Stack, SxProps, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";

import LoadingIndicator from "@/common/components/LoadingIndicator";
import { isNullOrWhiteSpace } from "@/utils/utils";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import useChildren from "@/modules/children/hooks/useChildren";

type Props = {
  sx?: SxProps;
};

export default function ChildInformation(props: Props) {
  const { user } = useAuthentication();
  const { children } = useChildren();
  const theme = useTheme();

  const getAgeLabels = (birthDate: Date, sex: string) => {
    const now = new Date();
    const ageInDays = Math.floor(
      (now.setHours(0, 0, 0, 0) - new Date(birthDate).setHours(0, 0, 0, 0)) /
        (1000 * 3600 * 24) +
        0
    );

    const weekDays = 7;
    const monthDays = weekDays * 4;

    const ageInWeeks = Math.floor(ageInDays / weekDays);

    const nextLabelPrefix =
      sex == "male" ? "Il aura" : sex == "female" ? "Elle aura" : "";

    // If the child is less than 1 day old, we display the age in hours

    if (ageInDays < 1) {
      const ageInHours = Math.floor(
        (new Date().getTime() - birthDate.getTime()) / (1000 * 3600)
      );

      if (ageInHours === 0) {
        return {
          current: `quelques minutes`,
          next: ``,
        };
      }

      return {
        current: `${ageInHours} heure${ageInHours > 1 ? "s" : ""}`,
        next: `${nextLabelPrefix} 1 jour dans ${24 - ageInHours} heure${
          24 - ageInHours > 1 ? "s" : ""
        }`,
      };
    }

    // If the child is less than 1 week old, we display the age in days

    if (ageInDays < weekDays) {
      const remainingDays = weekDays - ageInDays;

      const nextLabelSuffix =
        remainingDays === 1
          ? "demain"
          : `dans ${weekDays - ageInDays} jour${
              weekDays - ageInDays > 1 ? "s" : ""
            }`;

      return {
        current: `${ageInDays} jour${ageInDays > 1 ? "s" : ""}`,
        next: `${nextLabelPrefix} 1 semaine ${nextLabelSuffix}`,
      };
    }

    // If the child is less than 1 month old, we display the age in weeks and days

    if (ageInDays < monthDays) {
      const days = ageInDays % weekDays;
      const nextAgeInWeeks = ageInWeeks + 1;
      const remainingDays = weekDays - days;
      const nextLabelSuffixIfLessThanFourWeeks = `dans ${remainingDays} jour${
        remainingDays > 1 ? "s" : ""
      }`;
      const next =
        nextAgeInWeeks === 4
          ? `${nextLabelPrefix} 1 mois dans 1 semaine`
          : `${nextLabelPrefix} ${nextAgeInWeeks} semaine${
              nextAgeInWeeks > 1 ? "s" : ""
            } ${nextLabelSuffixIfLessThanFourWeeks}`;

      if (days === 0) {
        return {
          current: `${ageInWeeks} semaine${ageInWeeks > 1 ? "s" : ""}`,
          next: `${nextLabelPrefix} ${next}`,
        };
      }
      return {
        current: `${ageInWeeks} semaine${
          ageInWeeks > 1 ? "s" : ""
        } et ${days} jour${days > 1 ? "s" : ""}`,
        next: `${nextLabelPrefix} ${next}`,
      };
    }

    // If the child is less than 1 year old, we display the age in months and weeks

    if (ageInDays < 365) {
      const ageInMonths = Math.floor(ageInDays / monthDays);
      const weeks = Math.floor((ageInDays % monthDays) / weekDays);
      const nextAgeInMonths = ageInMonths + 1;
      const nextAgeInWeeks = weeks + 1;
      const remainingWeeks = 52 - ageInWeeks;
      let next = "";

      if (nextAgeInMonths === 12) {
        next = `${nextLabelPrefix} 1 an dans ${remainingWeeks} semaine${
          remainingWeeks > 1 ? "s" : ""
        }`;
      } else if (weeks === 3) {
        const remainingDays = monthDays - (ageInDays % monthDays);
        if (remainingDays === weekDays) {
          next = `${nextLabelPrefix} ${nextAgeInMonths} mois dans 1 semaine`;
        } else {
          const nextLabelSuffix =
            remainingDays === 1
              ? "demain"
              : `dans ${remainingDays} jour${remainingDays > 1 ? "s" : ""}`;
          next = `${nextLabelPrefix} ${nextAgeInMonths} mois ${nextLabelSuffix}`;
        }
      } else {
        const remainingDays = weekDays - (ageInDays % weekDays);
        const nextLabelSuffix =
          remainingDays === 1
            ? "demain"
            : `dans ${remainingDays} jour${remainingDays > 1 ? "s" : ""}`;
        next = `${nextLabelPrefix} ${ageInMonths} mois et ${nextAgeInWeeks} semaine${
          nextAgeInWeeks > 1 ? "s" : ""
        } ${nextLabelSuffix}`;
      }

      if (weeks === 0) {
        return {
          current: `${ageInMonths} mois`,
          next: `${next}`,
        };
      }

      return {
        current: `${ageInMonths} mois et ${weeks} semaine${
          weeks > 1 ? "s" : ""
        }`,
        next: `${next}`,
      };
    }

    // If the child is more than 1 year old, we display the age in years and months

    const years = Math.floor(ageInDays / 365);
    const months = Math.floor((ageInDays % 365) / 30);
    if (months === 0) {
      return {
        current: `${years} an${years > 1 ? "s" : ""}`,
        next: "",
      };
    }

    return {
      current: `${years} an${years > 1 ? "s" : ""} et ${months} mois`,
      next: "",
    };
  };

  if (user == null || children == null) {
    return <LoadingIndicator />;
  }

  return (
    <Stack
      sx={{
        ...props.sx,
      }}
    >
      {children.map((child) => {
        let avatarBackgroundColor = "#62CB5C";
        if (child.sex == "female") {
          avatarBackgroundColor = "#EE64EC";
        } else if (child.sex == "male") {
          avatarBackgroundColor = "#4F89E8";
        }
        const ageLabels = getAgeLabels(child.birthDate, child.sex);
        const avatarWidth = isNullOrWhiteSpace(child.avatar) ? 100 : 150;
        const avatarFontSize = avatarWidth / 2.5;
        return (
          <Stack
            key={child.id}
            spacing={1}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Avatar
              sx={{
                width: avatarWidth,
                height: avatarWidth,
                fontSize: avatarFontSize,
                backgroundColor: isNullOrWhiteSpace(child.avatar)
                  ? avatarBackgroundColor
                  : theme.palette.divider,
                border: "2px solid",
                borderColor: "transparent",
              }}
              src={child.avatar}
            >
              {child.name.split(" ").map((name) => name[0].toUpperCase())}
            </Avatar>
            <Stack>
              <Typography variant="h6" textAlign={"center"}>
                {child.name.split(" ")[0]} a {ageLabels.current}
              </Typography>
              {!isNullOrWhiteSpace(ageLabels.next) && (
                <Typography
                  variant="body1"
                  color={theme.customPalette.text.secondary}
                  textAlign={"center"}
                >
                  {ageLabels.next}
                </Typography>
              )}
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}
