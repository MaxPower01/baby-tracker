import { Box, Button, Stack, Typography, useTheme } from "@mui/material";

import GoogleIcon from "@mui/icons-material/Google";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { PageId } from "@/enums/PageId";
import getPath from "@/utils/getPath";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AuthenticationForm() {
  const [isAuthenticating, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const { googleSignInWithPopup } = useAuthentication();
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    googleSignInWithPopup()
      .then(({ user, isNewUser }) => {
        if (isNewUser == true) {
          navigate(
            getPath({
              page: PageId.NewBaby,
            })
          );
        } else {
          navigate(
            getPath({
              page: PageId.Home,
            })
          );
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Stack spacing={2}>
      <Button
        disabled={isAuthenticating}
        variant="contained"
        onClick={handleGoogleSignIn}
        fullWidth
        color="primary"
        sx={{
          minHeight: `calc(${theme.typography.button.fontSize} * 2.5)`,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={"center"}
        >
          <GoogleIcon />
          <Typography variant="button">Continuer avec Google</Typography>
          <Box
            sx={{
              display: isAuthenticating ? "flex" : "none",
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
        </Stack>
      </Button>
    </Stack>
  );
}
