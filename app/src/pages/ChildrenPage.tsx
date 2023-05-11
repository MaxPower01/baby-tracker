import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import ChildrenForm from "@/modules/children/components/ChildrenForm";
import { Stack, Typography } from "@mui/material";

export default function ChildrenPage() {
  const { children } = useAuthentication();
  return (
    <Stack
      spacing={2}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        width: "100%",
      }}
    >
      {children.length > 0 && (
        <>
          <Typography variant={"h4"}>Mes enfants</Typography>
          {children.map((child) => (
            <Stack
              key={child.id}
              sx={{
                width: "100%",
              }}
            >
              <Typography variant={"h6"}>{child.name}</Typography>
              <Typography
                variant={"body2"}
                sx={{
                  opacity: 0.5,
                }}
              >
                {child.id}
              </Typography>
            </Stack>
          ))}
        </>
      )}
      <Typography variant={"h4"}>Ajouter un enfant</Typography>
      <ChildrenForm />
    </Stack>
  );
}
