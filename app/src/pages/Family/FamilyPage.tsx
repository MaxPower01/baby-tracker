import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import { PageId } from "@/enums/PageId";
import { PageLayout } from "@/components/PageLayout";
import getPageTitle from "@/utils/getPageTitle";
import getPath from "@/utils/getPath";
import { useAuthentication } from "@/components/Authentication/AuthenticationProvider";
import { useNavigate } from "react-router-dom";

export function FamilyPage() {
  const { user } = useAuthentication();
  const theme = useTheme();
  const navigate = useNavigate();
  const baby = user?.baby;

  return (
    <PageLayout
      topBarProps={{
        pageTitle: getPageTitle(PageId.Family),
        renderBackButton: true,
      }}
      bottomBarProps={{ hide: true }}
    >
      <Stack
        spacing={2}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          width: "100%",
        }}
      >
        {baby != null && (
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
                    paths: [baby.id],
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
                    <Typography
                      variant={"h6"}
                      sx={{
                        color: theme.customPalette.text.primary,
                      }}
                    >
                      {baby.name}
                    </Typography>
                    <Typography
                      variant={"body2"}
                      sx={{
                        color: theme.customPalette.text.secondary,
                      }}
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
        )}
      </Stack>
    </PageLayout>
  );
}
