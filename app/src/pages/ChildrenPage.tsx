import { resources } from "@/lib/utils";
import ChildrenForm from "@/modules/children/components/ChildrenForm";
import { Stack, Typography } from "@mui/material";

export default function ChildrenPage() {
  return (
    <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
      <Typography variant={"h4"} textAlign={"center"}>
        {resources.appName}
      </Typography>
      <Typography variant={"body1"} textAlign={"center"}>
        Quel est le nom de votre enfant ?
      </Typography>
      <ChildrenForm />
    </Stack>
  );
}
