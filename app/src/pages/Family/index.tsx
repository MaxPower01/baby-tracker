import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import PageId from "@/enums/PageId";
import { formatDateTime } from "@/utils/utils";
import getPath from "@/utils/getPath";
import useAuthentication from "@/pages/Authentication/hooks/useAuthentication";
import useChildren from "@/pages/Baby/hooks/useChildren";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function FamilyPage() {
  const { user } = useAuthentication();
  const { children } = useChildren();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Stack
      spacing={2}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        width: "100%",
      }}
    >
      {children != null &&
        children.map((child) => (
          <Card
            key={child.id}
            sx={{
              width: "100%",
            }}
          >
            <CardActionArea
              onClick={() => {
                navigate(
                  getPath({
                    page: PageId.Child,
                    id: child.id,
                  })
                );
              }}
            >
              <CardContent>
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
                      color={theme.customPalette.text.secondary}
                      sx={
                        {
                          // opacity: 0.8,
                        }
                      }
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
                      })}
                      {child.birthWeight != null && child.birthWeight > 0 && (
                        <span>
                          {" "}
                          • Poids de naissance:{" "}
                          {Math.round((child.birthWeight / 1000) * 100) /
                            100}{" "}
                          kg /{" "}
                          {Math.round((child.birthWeight / 453.592) * 100) /
                            100}{" "}
                          lbs
                        </span>
                      )}
                      {child.birthSize != null && child.birthSize > 0 && (
                        <span>
                          {" "}
                          • Taille de naissance:{" "}
                          {Math.round((child.birthSize / 10) * 100) / 100} cm /{" "}
                          {Math.round((child.birthSize / 25.4) * 100) / 100}{" "}
                          pouces
                        </span>
                      )}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
    </Stack>
  );
}
