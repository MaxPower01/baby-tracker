import { Stack, Typography, useTheme } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import { formatDateTime } from "@/utils/utils";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import { useMemo } from "react";

export default function ChildrenPage() {
  const { user, children } = useAuthentication();
  const theme = useTheme();

  return (
    <Stack
      spacing={2}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        width: "100%",
      }}
    >
      {children.length > 0 && (
        <>
          <Typography variant={"h4"}>Mes enfants</Typography>
          {children.map((child) => (
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              sx={{
                width: "100%",
              }}
              spacing={1}
            >
              {child.id == user?.selectedChild && (
                <CheckIcon
                  sx={{ marginLeft: 1, color: theme.palette.primary.main }}
                />
              )}
              <Stack
                key={child.id}
                sx={{
                  width: "100%",
                }}
              >
                <Typography variant={"h6"}>{child.name}</Typography>
                <Typography
                  variant={"body2"}
                  sx={{
                    opacity: 0.8,
                  }}
                >
                  {child.sex == "male" ? "Garçon" : "Fille"} •{" "}
                  {child.sex == "male" ? "Né" : "Née"} le{" "}
                  {child.birthDate.toLocaleString("fr-ca", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                    hour: "numeric",
                    minute: "numeric",
                  })}{" "}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </>
      )}
    </Stack>
  );
}
