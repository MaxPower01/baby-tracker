import BottomBar from "@/components/BottomBar";
import PrivateRoutes from "@/components/PrivateRoutes";
import PublicRoutes from "@/components/PublicRoutes";
import TopBar from "@/components/TopBar";
import CSSBreakpoint from "@/enums/CSSBreakpoint";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import MenuProvider from "@/modules/menu/components/MenuProvider";
import { Container } from "@mui/material";

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
