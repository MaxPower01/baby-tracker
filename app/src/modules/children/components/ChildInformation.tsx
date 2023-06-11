import { Avatar, Stack, Typography } from "@mui/material";
import React, { useMemo } from "react";

import useAuthentication from "@/modules/authentication/hooks/useAuthentication";

type Props = {
  childId: string;
};

export default function ChildInformation(props: Props) {
  const { childId } = props;
  const { children } = useAuthentication();
  const child = useMemo(() => {
    return children.find((child) => child.id === childId);
  }, [children, childId]);
  const ageInDays = useMemo(() => {
    if (child?.birthDate) {
      return Math.floor(
        (new Date().getTime() - child.birthDate.getTime()) / (1000 * 3600 * 24)
      );
    }
    return 0;
  }, [child]);

  const ageInWeeks = useMemo(() => {
    if (child?.birthDate) {
      return Math.floor(ageInDays / 7);
    }
    return 0;
  }, [ageInDays]);

  const ageInMonths = useMemo(() => {
    if (child?.birthDate) {
      return Math.floor(ageInDays / 30);
    }
    return 0;
  }, [ageInDays]);

  const ageInYears = useMemo(() => {
    if (child?.birthDate) {
      return Math.floor(ageInDays / 365);
    }
    return 0;
  }, [ageInDays]);

  const ageLabel = useMemo(() => {
    if (ageInYears > 0) {
      return `${ageInYears} an${ageInYears > 1 ? "s" : ""}`;
    } else if (ageInMonths > 6) {
      return `${ageInMonths} mois`;
    } else if (ageInWeeks > 1) {
      return `${ageInWeeks} semaine${ageInWeeks > 1 ? "s" : ""}`;
    } else {
      return `${ageInDays} jour${ageInDays > 1 ? "s" : ""}`;
    }
  }, [ageInDays, ageInMonths, ageInWeeks, ageInYears]);

  if (child?.name == null || child?.birthDate == null) {
    return null;
  }

  return (
    <Stack spacing={1} justifyContent={"center"} alignItems={"center"}>
      <Avatar
        sx={{
          width: 64,
          height: 64,
        }}
      >
        {child.name?.split(" ").map((name) => name[0].toUpperCase())}
      </Avatar>
      <Typography variant="h5">
        {child.name} a {ageLabel}
      </Typography>
    </Stack>
  );
}
