// import { Button, Stack, TextField } from "@mui/material";
// import {
//   addDoc,
//   arrayUnion,
//   collection,
//   doc,
//   updateDoc,
// } from "firebase/firestore";

// import PageName from "@/common/enums/PageName";
// import { db } from "@/firebase";
// import { getPath } from "@/utils/utils";
// import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

export default function ChildrenForm() {
  // const { user, setChildren } = useAuthentication();
  // const [name, setName] = useState("");
  // const navigate = useNavigate();
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setName(event.target.value);
  // };

  // const handleSubmit = () => {
  //   if (!user) {
  //     return;
  //   }
  //   addDoc(collection(db, "children"), {
  //     name: name,
  //     parents: [user.uid],
  //   }).then((docRef) => {
  //     const userRef = doc(db, "users", user.uid);
  //     updateDoc(userRef, {
  //       selectedChild: docRef.id,
  //       children: arrayUnion(docRef.id),
  //     }).then(() => {
  //       setChildren((prev) => [
  //         ...prev,
  //         { id: docRef.id, name: name, isSelected: true },
  //       ]);
  //       navigate(
  //         getPath({
  //           page: PageName.Home,
  //         })
  //       );
  //     });
  //   });
  // };

  // return (
  //   <Stack
  //     spacing={2}
  //     sx={{
  //       width: "100%",
  //     }}
  //   >
  //     <TextField
  //       label="Nom de l'enfant"
  //       name="name"
  //       type="text"
  //       value={name}
  //       onChange={handleChange}
  //       fullWidth
  //     />
  //     <Button
  //       variant="contained"
  //       color="primary"
  //       fullWidth
  //       disabled={name.trim().length === 0}
  //       onClick={(e) => handleSubmit()}
  //     >
  //       Ajouter un enfant
  //     </Button>
  //   </Stack>
  // );

  return null;
}
