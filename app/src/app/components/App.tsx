import BottomBar from "@/components/BottomBar";
import CSSBreakpoint from "@/enums/CSSBreakpoint";
import { Container } from "@mui/material";
import MenuProvider from "@/components/Menu/MenuProvider";
import PrivateRoutes from "@/components/PrivateRoutes";
import PublicRoutes from "@/components/PublicRoutes";
import TopBar from "@/components/TopBar";
import useAuthentication from "@/pages/Authentication/hooks/useAuthentication";

export default function App() {
  const { user } = useAuthentication();

  return (
    <>
      {user != null && <TopBar component={"header"} />}

      <Container
        component={"main"}
        maxWidth={CSSBreakpoint.Small}
        sx={{
          paddingTop: 2,
          paddingBottom: 20,
        }}
      >
        {user == null ? <PublicRoutes /> : <PrivateRoutes />}
      </Container>

      {user != null && (
        <MenuProvider>
          <BottomBar component={"footer"} />
        </MenuProvider>
      )}
    </>
  );
}
