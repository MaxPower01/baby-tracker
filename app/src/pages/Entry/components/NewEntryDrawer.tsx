import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  SwipeableDrawer,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import ActivityType from "@/pages/Activity/enums/ActivityType";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import CloseIcon from "@mui/icons-material/Close";
import { EntryTypeIcon } from "@/pages/Activities/components/EntryTypeIcon";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { PageId } from "@/enums/PageId";
import SettingsIcon from "@mui/icons-material/Settings";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import getPath from "@/utils/getPath";
import { selectEntryTypesOrder } from "@/state/slices/settingsSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function NewEntryDrawer(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const handleItemClick = (entryType: EntryTypeId) => {
    navigate(
      getPath({
        page: PageId.Entry,
        params: { type: entryType.toString() },
      })
    );
    props.onClose();
  };

  const entryTypesOrder = useSelector(selectEntryTypesOrder);

  if ((entryTypesOrder?.length ?? 0) === 0) {
    return null;
  }

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={props.isOpen}
      onOpen={() => {}}
      onClose={() => props.onClose()}
      disableSwipeToOpen={true}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "inherit",
          backgroundImage: "inherit",
        }}
      >
        <Container maxWidth={CSSBreakpoint.Small} disableGutters>
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                color: theme.customPalette.text.primary,
              }}
            >
              Ajouter une entrée
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              onClick={() => {
                navigate(getPath({ page: PageId.Activities }));
                props.onClose();
              }}
            >
              <SettingsIcon />
            </IconButton>
            <IconButton onClick={() => props.onClose()}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <Divider
            sx={{
              marginLeft: 2,
              marginRight: 2,
            }}
          />
        </Container>
      </Box>
      <Container maxWidth={CSSBreakpoint.Small} disableGutters>
        <Box
          sx={{
            maxHeight: "70vh",
            "& .ActivityIcon": {
              fontSize: "4em",
            },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
            }}
          >
            {entryTypesOrder.map((entryType) => {
              const buttonLabel = getEntryTypeName(entryType);
              return (
                <Button
                  key={entryType}
                  onClick={() => {
                    handleItemClick(entryType);
                  }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    color: theme.customPalette.text.primary,
                    paddingTop: 2,
                    paddingBottom: 2,
                  }}
                >
                  <Stack
                    spacing={1}
                    justifyContent={"center"}
                    alignItems={"center"}
                    sx={{
                      flexGrow: 1,
                    }}
                  >
                    <>
                      <EntryTypeIcon
                        type={entryType}
                        sx={{
                          flexShrink: 0,
                        }}
                      />
                      <Box
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          className="ActivityButton__Typography"
                          variant="button"
                          textAlign="center"
                          fontWeight={"bold"}
                          lineHeight={1.2}
                          sx={{
                            wordBreak: "break-word",
                            color: theme.customPalette.text.primary,
                          }}
                        >
                          {buttonLabel}
                        </Typography>
                      </Box>
                    </>
                  </Stack>
                </Button>
              );
            })}
          </Box>
        </Box>
      </Container>
    </SwipeableDrawer>
  );
}
