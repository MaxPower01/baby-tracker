import { Avatar, Stack, Typography } from "@mui/material";
import React, { useMemo } from "react";

import LoadingIndicator from "@/common/components/LoadingIndicator";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import useChildren from "@/modules/children/hooks/useChildren";

type Props = {};

export default function ChildInformation(props: Props) {
  const { user } = useAuthentication();
  const { children } = useChildren();

  const getAgeLabel = (birthDate: Date) => {
    const ageInDays = Math.floor(
      (new Date().getTime() - birthDate.getTime()) / (1000 * 3600 * 24)
    );

    // If the child is less than 1 day old, we display the age in hours

    if (ageInDays < 1) {
      const ageInHours = Math.floor(
        (new Date().getTime() - birthDate.getTime()) / (1000 * 3600)
      );
      return `${ageInHours} heure${ageInHours > 1 ? "s" : ""}`;
    }

    // If the child is less than 1 week old, we display the age in days

    if (ageInDays < 7) {
      return `${ageInDays} jour${ageInDays > 1 ? "s" : ""}`;
    }

    // If the child is less than 1 year old, we display the age in weeks and days

    if (ageInDays < 365) {
      const weeks = Math.floor(ageInDays / 7);
      const days = ageInDays % 7;
      if (days === 0) return `${weeks} semaine${weeks > 1 ? "s" : ""}`;
      return `${weeks} semaine${weeks > 1 ? "s" : ""} et ${days} jour${
        days > 1 ? "s" : ""
      }`;
    }

    // If the child is more than 1 year old, we display the age in years and months

    const years = Math.floor(ageInDays / 365);
    const months = Math.floor((ageInDays % 365) / 30);
    if (months === 0) return `${years} an${years > 1 ? "s" : ""}`;
    return `${years} an${years > 1 ? "s" : ""} et ${months} mois`;
  };

  if (user == null || children == null) {
    return <LoadingIndicator />;
  }

  return (
    <Stack>
      {children.map((child) => {
        return (
          <Stack
            key={child.id}
            spacing={1}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
              }}
            >
              {child.name?.split(" ").map((name) => name[0].toUpperCase())}
            </Avatar>
            <Typography variant="h5">
              {child.name} a {getAgeLabel(child.birthDate)}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}
