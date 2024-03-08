import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback } from "react";

import ActivityButtons from "@/pages/Activities/components/ActivityButtons";
import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { PageId } from "@/enums/PageId";
import { getActivityContextDrawerAddItemPlaceholder } from "@/pages/Activity/utils/getActivityContextDrawerAddItemPlaceholder";
import { getActivityContextDrawerTitle } from "@/pages/Activity/utils/getActivityContextDrawerTitle";
import { getActivityContextTypeFromEntryType } from "@/pages/Activity/utils/getActivityContextTypeFromEntryType";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";

type Props = {
  type: EntryType;
  isOpen: boolean;
  onClose: () => void;
  activityContextId: string | null;
  setActivityContextId: React.Dispatch<React.SetStateAction<string | null>>;
};

export function ActivityContextDrawer(props: Props) {
  const theme = useTheme();
  const [isSaving, setIsSaving] = React.useState(false);
  const drawerTitle = getActivityContextDrawerTitle(props.type);
  const activityContextType = getActivityContextTypeFromEntryType(props.type);
  const [newActivityContextName, setNewActivityContextName] =
    React.useState("");
  // TODO: fetch activity contexts
  const [activityContexts, setActivityContexts] = React.useState<
    ActivityContext[]
  >([
    // TODO: Remove mock data
    {
      id: "1",
      name: "Context 1",
      type: activityContextType as any,
      createdAtTimestamp: undefined,
    },
    {
      id: "2",
      name: "Context 2",
      type: activityContextType as any,
      createdAtTimestamp: undefined,
    },
    {
      id: "3",
      name: "Context 3",
      type: activityContextType as any,
      createdAtTimestamp: undefined,
    },
  ]);
  const handleSubmit = () => {};
  const addActivityContext = useCallback(() => {
    // TODO: Implement
    const lastItem = activityContexts[activityContexts.length - 1];
    setActivityContexts([
      ...activityContexts,
      {
        id: (parseInt(lastItem.id) + 1).toString(),
        name: newActivityContextName,
        type: activityContextType as any,
        createdAtTimestamp: undefined,
      },
    ]);
    setNewActivityContextName("");
    props.setActivityContextId((parseInt(lastItem.id) + 1).toString());
  }, [activityContexts, activityContextType, newActivityContextName]);

  if (activityContextType === null) {
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
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <ActivityIcon
                type={props.type}
                sx={{
                  flexShrink: 0,
                  fontSize: "1.75em",
                }}
              />
              <Typography variant="h6">{drawerTitle}</Typography>
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              onClick={() => {
                // TODO: Set edit mode to true
                props.onClose();
              }}
            >
              <EditIcon />
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
      <Container
        maxWidth={CSSBreakpoint.Small}
        sx={{
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        <Box
          sx={{
            maxHeight: "70vh",
          }}
        >
          <Stack
            spacing={2}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{ width: "100%" }}
            flexGrow={1}
          >
            <FormControl fullWidth variant="outlined">
              <Stack
                direction={"row"}
                spacing={1}
                justifyContent={"center"}
                alignItems={"center"}
                sx={{
                  width: "100%",
                }}
              >
                <TextField
                  id="new-activity-context"
                  placeholder={getActivityContextDrawerAddItemPlaceholder(
                    props.type
                  )}
                  value={newActivityContextName}
                  onChange={(event) =>
                    setNewActivityContextName(event.target.value)
                  }
                  fullWidth
                />
                <IconButton
                  color="primary"
                  disabled={isNullOrWhiteSpace(newActivityContextName)}
                  onClick={addActivityContext}
                >
                  <AddIcon />
                </IconButton>
              </Stack>
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <RadioGroup
                value={props.activityContextId ?? ""}
                onChange={(event) =>
                  props.setActivityContextId(event.target.value)
                }
                sx={{
                  width: "100%",
                  marginTop: 2,
                }}
              >
                {activityContexts.map((activityContext) => {
                  return (
                    <FormControlLabel
                      key={activityContext.id}
                      value={activityContext.id}
                      control={<Radio />}
                      label={
                        <Stack
                          direction={"row"}
                          spacing={1}
                          alignItems={"center"}
                        >
                          <Typography variant={"body1"} fontWeight={500}>
                            {activityContext.name}
                          </Typography>
                        </Stack>
                      }
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>
          </Stack>

          <Box
            sx={{
              flexShrink: 0,
              position: "sticky",
              bottom: 0,
              // opacity:
              //   isCurrentPage == false
              //     ? theme.opacity.tertiary
              //     : theme.opacity.primary,
            }}
          >
            <Button
              variant="contained"
              onClick={handleSubmit}
              fullWidth
              size="large"
              disabled={isSaving || isNullOrWhiteSpace(props.activityContextId)}
              sx={{
                height: `calc(${theme.typography.button.fontSize} * 2.5)`,
              }}
            >
              <Typography variant="button">Sélectionner</Typography>
              <Box
                sx={{
                  display: isSaving ? "flex" : "none",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LoadingIndicator
                  size={`calc(${theme.typography.button.fontSize} * 2)`}
                />
              </Box>
            </Button>
          </Box>
          {/* TODO: List all activity context items */}
        </Box>
      </Container>
    </SwipeableDrawer>
  );
}
