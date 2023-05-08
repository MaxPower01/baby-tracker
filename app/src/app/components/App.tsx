import BottomBar from "@/common/components/BottomBar";
import PrivateRoutes from "@/common/components/PrivateRoutes";
import PublicRoutes from "@/common/components/PublicRoutes";
import TopBar from "@/common/components/TopBar";
import CSSBreakpoint from "@/common/enums/CSSBreakpoint";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import { Container } from "@mui/material";
import "./App.scss";

export default function App() {
  const { user } = useAuthentication();

  return (
    <>
      {user != null && user.selectedChild != "" && (
        <TopBar component={"header"} />
      )}

      <Container
        component={"main"}
        maxWidth={CSSBreakpoint.Small}
        sx={{
          paddingTop: 2,
          paddingBottom: 8,
        }}
      >
        {user == null ? <PublicRoutes /> : <PrivateRoutes />}
      </Container>

      {user != null && user.selectedChild != "" && (
        <BottomBar component={"footer"} />
      )}
    </>
  );
}
