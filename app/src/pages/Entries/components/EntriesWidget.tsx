import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { Entry } from "@/pages/Entry/types/Entry";
import React from "react";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import { selectOrderedEntryTypes } from "@/state/slices/entriesSlice";
import { useSelector } from "react-redux";

type Props = {
  entries: Entry[];
};

export function EntriesWidget(props: Props) {
  const theme = useTheme();
  const orderedEntryTypes = useSelector(selectOrderedEntryTypes);
  const itemPadding = 4;
  const itemWidth = "10em";
  if (orderedEntryTypes.length === 0) {
    return null;
  }
  return (
    <Stack
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          overflowX: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Stack
          direction={"row"}
          sx={{
            display: "grid",
            gap: 0.5,
            gridTemplateColumns: `${orderedEntryTypes
              .map(() => "1fr")
              .join(" ")}`,
          }}
        >
          {orderedEntryTypes.map((entryType, index) => {
            const name = getEntryTypeName(entryType);
            const inProgress = false;
            return (
              <Box
                sx={{
                  borderRadius: 1,
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  padding: `${itemPadding}px`,
                  width: itemWidth,
                }}
              >
                <Card
                  sx={{
                    border: "1px solid",
                    borderColor: inProgress
                      ? (`${theme.palette.primary.main}50` as string)
                      : "transparent",
                    backgroundColor: inProgress
                      ? `${theme.palette.primary.main}30`
                      : undefined,
                    boxShadow: inProgress
                      ? `0 0 5px 0px ${theme.palette.primary.main}`
                      : undefined,
                    borderRadius: 1,
                    flexGrow: 1,
                    width: "100%",
                  }}
                >
                  <CardActionArea
                    sx={{
                      height: "100%",
                    }}
                  >
                    <CardContent
                      sx={{
                        height: "100%",
                        padding: 1,
                      }}
                    >
                      <Stack
                        sx={{
                          height: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            flexShrink: 0,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <ActivityIcon
                            type={entryType}
                            sx={{
                              fontSize: "3.5em",
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            flexGrow: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant={"button"}
                            sx={{
                              textAlign: "center",
                              color: theme.customPalette.text.primary,
                              lineHeight: 1.4,
                            }}
                          >
                            {name}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            );
          })}
        </Stack>
        <Stack
          direction={"row"}
          sx={{
            display: "grid",
            gap: 0.5,
            gridTemplateColumns: `${orderedEntryTypes
              .map(() => "1fr")
              .join(" ")}`,
          }}
        >
          {orderedEntryTypes.map((entryType, index) => {
            const name = getEntryTypeName(entryType);
            return (
              <Box
                sx={{
                  width: itemWidth,
                }}
              >
                <Typography
                  variant={"body1"}
                  sx={{
                    textAlign: "center",
                    color: theme.customPalette.text.primary,
                  }}
                >
                  {name}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Stack>
  );
}
