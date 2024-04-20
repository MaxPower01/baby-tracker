import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo } from "react";

import CheckIcon from "@mui/icons-material/Check";
import { PageId } from "@/enums/PageId";
import { formatDateTime } from "@/utils/utils";
import getPath from "@/utils/getPath";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useBabies } from "@/pages/Baby/components/BabiesProvider";
import { useLayout } from "@/components/LayoutProvider";
import { useNavigate } from "react-router-dom";

export function FamilyPage() {
  const { user } = useAuthentication();
  const { babies } = useBabies();
  const theme = useTheme();
  const navigate = useNavigate();
  const layout = useLayout();
  useEffect(() => {
    layout.setBottomBarVisibility("hidden");
    return () => {
      layout.setBottomBarVisibility("visible");
    };
  }, []);

  return (
    <Stack
      spacing={2}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        width: "100%",
      }}
    >
      {babies != null &&
        babies.map((baby) => (
          <Card
            key={baby.id}
            sx={{
              width: "100%",
            }}
          >
            <CardActionArea
              onClick={() => {
                navigate(
                  getPath({
                    page: PageId.Baby,
                    id: baby.id,
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
                  {baby.id == user?.babyId && (
                    <CheckIcon
                      sx={{
                        marginLeft: 1,
                        color: theme.palette.primary.main,
                      }}
                    />
                  )}
                  <Stack
                    key={baby.id}
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Typography variant={"h6"}>{baby.name}</Typography>
                    <Typography
                      variant={"body2"}
                      color={theme.customPalette.text.secondary}
                      sx={
                        {
                          // opacity: 0.8,
                        }
                      }
                    >
                      {baby.sex == "male" ? "Garçon" : "Fille"} •{" "}
                      {baby.sex == "male" ? "Né" : "Née"} le{" "}
                      {baby.birthDate.toLocaleString("fr-ca", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                      {baby.birthWeight != null && baby.birthWeight > 0 && (
                        <span>
                          {" "}
                          • Poids de naissance:{" "}
                          {Math.round((baby.birthWeight / 1000) * 100) / 100} kg
                          /{" "}
                          {Math.round((baby.birthWeight / 453.592) * 100) / 100}{" "}
                          lbs
                        </span>
                      )}
                      {baby.birthSize != null && baby.birthSize > 0 && (
                        <span>
                          {" "}
                          • Taille de naissance:{" "}
                          {Math.round((baby.birthSize / 10) * 100) / 100} cm /{" "}
                          {Math.round((baby.birthSize / 25.4) * 100) / 100}{" "}
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
