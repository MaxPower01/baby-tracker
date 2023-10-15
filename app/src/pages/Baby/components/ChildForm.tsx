import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  LinearProgressProps,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { Form, useNavigate } from "react-router-dom";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import React, { useCallback, useMemo, useState } from "react";
import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import dayjs, { Dayjs } from "dayjs";
import { db, storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CSSBreakpoint from "@/enums/CSSBreakpoint";
import Child from "@/pages/Authentication/types/Child";
import LoadingIndicator from "@/components/LoadingIndicator";
import PageId from "@/enums/PageId";
import { ReactSVG } from "react-svg";
import Sex from "@/enums/Sex";
import dayjsLocaleFrCa from "@/lib/dayjs/dayjsLocaleFrCa";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import useAuthentication from "@/pages/Authentication/hooks/useAuthentication";
import useChidlren from "@/pages/Baby/hooks/useChildren";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

type ItemLabelProps = {
  label: string;
  icon?: string;
};

function ItemLabel(props: ItemLabelProps) {
  const theme = useTheme();
  return (
    <Stack
      spacing={1}
      direction={"row"}
      justifyContent={"flex-start"}
      alignItems={"center"}
    >
      {props.icon != null && (
        <Box
          sx={{
            fontSize: "1.5rem",
          }}
        >
          <ReactSVG src={`/icons/${props.icon}.svg`} className="Icon" />
        </Box>
      )}
      <Typography variant="body1" color={theme.customPalette.text.secondary}>
        {props.label}
      </Typography>
    </Stack>
  );
}

type Props = {
  child?: Child;
};

export default function ChildForm(props: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const avatarWidth = 150;
  const avatarFontSize = avatarWidth / 2.5;
  const { user, setUser } = useAuthentication();

  const initialChild: Child = props.child ?? {
    id: "",
    name: "",
    birthDate: new Date(),
    parents: [],
    sex: "",
    birthHeadCircumference: 0,
    birthSize: 0,
    birthWeight: 0,
    avatar: "",
  };

  const [child, setChild] = useState<Child>(initialChild);

  const { saveChild } = useChidlren();

  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(child.name);
  const [nameError, setNameError] = useState("");
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setNameError("");
  };

  const initials = useMemo(() => {
    try {
      return isNullOrWhiteSpace(name)
        ? null
        : name
            .split(" ")
            .slice(0, 2)
            .map((name) => (name ? name[0].toUpperCase() : ""));
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [name]);

  const [avatar, setAvatar] = useState(child.avatar);
  const [imageIsUploading, setImageIsUploading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const uploadImage = useCallback(
    async (image: File) => {
      const selectedChild = user?.selectedChild ?? "";
      if (image == null || isNullOrWhiteSpace(selectedChild)) return;
      const storageRef = ref(
        storage,
        `child/${selectedChild}/images/profile-pictures/${image.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, image);
      setImageUploadProgress(0);
      setImageIsUploading(true);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress function ...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setImageUploadProgress(progress);
        },
        (error) => {
          // Error function ...
          console.error(error);
          setImageIsUploading(false);
        },
        () => {
          // Complete function ...
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log("File available at", downloadURL);
              setAvatar(downloadURL);
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              setImageIsUploading(false);
              setImageUploadProgress(0);
            });
        }
      );
    },
    [user]
  );

  const handleImageInputClick = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (imageIsUploading) return;
      if (event.target.files == null || event.target.files.length === 0) return;
      const image = event.target.files[0];
      await uploadImage(image);
    },
    [imageIsUploading, user, uploadImage]
  );

  const [sex, setSex] = useState(child.sex);
  const [sexError, setSexError] = useState("");
  const handleSexChange = (event: SelectChangeEvent<string>) => {
    setSex(event.target.value);
    setSexError("");
  };

  let avatarBackgroundColor = useMemo(() => {
    if (sex == "female") {
      return "#EE64EC";
    } else if (sex == "male") {
      return "#4F89E8";
    }
    return theme.palette.divider;
  }, [sex]);

  const [birthDate, setBirthDate] = useState<Dayjs>(dayjs(child.birthDate));
  const handleBirthDateChange = (date: Dayjs | null) => {
    if (date) {
      setBirthDate(date);
    }
  };

  const [weight, setWeight] = useState(child.birthWeight ?? 0);

  const kilograms = useMemo(() => {
    if (weight == null || isNaN(weight) || weight === 0) return 0;
    return Math.round((weight / 1000) * 100) / 100; // 2 decimal places
  }, [weight]);

  const pounds = useMemo(() => {
    if (weight == null || isNaN(weight) || weight === 0) return 0;
    return Math.round((weight / 453.592) * 100) / 100; // 2 decimal places
  }, [weight]);

  const handleKilogramsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newKilograms = 0;
    try {
      newKilograms = parseFloat(event.target.value);
    } catch (error) {
      console.error("Error parsing kilograms: ", error);
    }
    setWeight(newKilograms * 1000);
  };

  const handlePoundsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newPounds = 0;
    try {
      newPounds = parseFloat(event.target.value);
    } catch (error) {
      console.error("Error parsing pounds: ", error);
    }
    setWeight(newPounds * 453.592);
  };

  const [size, setSize] = useState(child.birthSize ?? 0);
  const [headCircumference, setHeadCircumference] = useState(
    child.birthHeadCircumference ?? 0
  );

  const sizeInCentimeters = useMemo(() => {
    if (size == null || isNaN(size) || size === 0) return 0;
    return Math.round((size / 10) * 100) / 100; // 2 decimal places
  }, [size]);

  const sizeInInches = useMemo(() => {
    if (size == null || isNaN(size) || size === 0) return 0;
    return Math.round((size / 25.4) * 100) / 100; // 2 decimal places
  }, [size]);

  const handleSizeInCentimetersChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newCentimeters = 0;
    try {
      newCentimeters = parseFloat(event.target.value);
    } catch (error) {
      console.error("Error parsing centimeters: ", error);
    }
    setSize(newCentimeters * 10);
  };

  const handleSizeInInchesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newInches = 0;
    try {
      newInches = parseFloat(event.target.value);
    } catch (error) {
      console.error("Error parsing inches: ", error);
    }
    setSize(newInches * 25.4);
  };
  const headCircumferenceInCentimeters = useMemo(() => {
    if (
      headCircumference == null ||
      isNaN(headCircumference) ||
      headCircumference === 0
    )
      return 0;
    return Math.round((headCircumference / 10) * 100) / 100; // 2 decimal places
  }, [headCircumference]);

  const headCircumferenceInInches = useMemo(() => {
    if (
      headCircumference == null ||
      isNaN(headCircumference) ||
      headCircumference === 0
    )
      return 0;
    return Math.round((headCircumference / 25.4) * 100) / 100; // 2 decimal places
  }, [headCircumference]);

  const handleHeadCircumferenceInCentimetersChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newCentimeters = 0;
    try {
      newCentimeters = parseFloat(event.target.value);
    } catch (error) {
      console.error("Error parsing centimeters: ", error);
    }
    setHeadCircumference(newCentimeters * 10);
  };

  const handleHeadCircumferenceInInchesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newInches = 0;
    try {
      newInches = parseFloat(event.target.value);
    } catch (error) {
      console.error("Error parsing inches: ", error);
    }
    setHeadCircumference(newInches * 25.4);
  };

  const save = useCallback(async () => {
    const newChild = Object.assign({}, child);
    newChild.name = name;
    newChild.birthDate = birthDate.toDate();
    newChild.sex = sex;
    newChild.birthSize = size == 0 ? 0 : Math.round(size * 100) / 100;
    newChild.birthWeight = weight == 0 ? 0 : Math.round(weight * 100) / 100;
    newChild.birthHeadCircumference =
      headCircumference == 0 ? 0 : Math.round(headCircumference * 100) / 100;
    newChild.avatar = avatar;
    setIsSaving(true);
    saveChild(newChild)
      .then((savedChild) => {
        console.log("Child saved: ", savedChild);
        navigate(
          getPath({
            page: PageId.Home,
          })
        );
        // enqueueSnackbar("Enfant sauvegardé", {
        //     variant: "success",
        // });
      })
      .catch((error) => {
        console.error("Error saving child: ", error);
        // enqueueSnackbar("Erreur lors de la sauvegarde de l'enfant", {
        //     variant: "error",
        // });
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [
    saveChild,
    child,
    isSaving,
    name,
    birthDate,
    sex,
    size,
    weight,
    headCircumference,
    avatar,
    user,
  ]);

  const create = useCallback(async () => {
    if (!user) {
      return;
    }
    setIsSaving(true);
    const newChild: Child = {
      id: "",
      name: name,
      birthDate: birthDate.toDate(),
      parents: [user.uid],
      sex,
      avatar,
      birthHeadCircumference: headCircumference,
      birthSize: size,
      birthWeight: weight,
    };
    const { id, birthDate: newBirthDate, ...childData } = newChild;
    addDoc(collection(db, "children"), {
      birthDate: Timestamp.fromDate(newBirthDate),
      ...childData,
    })
      .then((docRef) => {
        const userRef = doc(db, "users", user.uid);
        updateDoc(userRef, {
          selectedChild: docRef.id,
          children: arrayUnion(docRef.id),
        }).then(() => {
          setUser((prev) => {
            if (!prev) {
              return null;
            }
            return {
              ...prev,
              selectedChild: docRef.id,
              children: [
                ...prev.children,
                {
                  id: docRef.id,
                  name: name,
                  birthDate: birthDate.toDate(),
                  sex: sex,
                },
              ] as Child[],
            };
          });
          navigate(
            getPath({
              page: PageId.Home,
            })
          );
        });
      })
      .catch((error) => {
        console.error("Error creating child: ", error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [
    saveChild,
    child,
    isSaving,
    name,
    birthDate,
    sex,
    size,
    weight,
    headCircumference,
    user,
  ]);

  const handleSubmit = useCallback(async () => {
    if (!child || !saveChild || isSaving) {
      return;
    }

    if (isNullOrWhiteSpace(child.id)) {
      await create();
    } else {
      await save();
    }
  }, [
    saveChild,
    child,
    isSaving,
    name,
    birthDate,
    sex,
    size,
    weight,
    headCircumference,
    save,
    create,
  ]);

  return (
    <>
      <Stack spacing={4}>
        <Stack justifyContent={"center"} alignItems={"center"} spacing={1}>
          <Avatar
            sx={{
              width: avatarWidth,
              height: avatarWidth,
              fontSize: avatarFontSize,
              backgroundColor: avatarBackgroundColor,
              border: isNullOrWhiteSpace(avatar) ? "2px solid" : null,
              borderColor: isNullOrWhiteSpace(avatar)
                ? theme.palette.divider
                : null,
            }}
            src={avatar}
          >
            {initials}
          </Avatar>
          {imageIsUploading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgressWithLabel value={imageUploadProgress} />
            </Box>
          )}
          {!isNullOrWhiteSpace(user?.selectedChild) && (
            <>
              <input
                id="child-form-image-upload"
                type="file"
                accept="image/*"
                multiple={true}
                onChange={async (e) => await handleImageInputClick(e)}
                style={{ display: "none" }}
              />
              <label htmlFor="child-form-image-upload">
                <Button
                  variant="text"
                  onClick={() => {
                    if (document && document.getElementById) {
                      const input = document.getElementById(
                        "child-form-image-upload"
                      );
                      if (input) {
                        input.click();
                      }
                    }
                  }}
                >
                  Définir la photo de profil
                </Button>
              </label>
            </>
          )}
        </Stack>

        <FormControl fullWidth variant="standard">
          <Stack spacing={1.5}>
            <ItemLabel label="Nom" icon="user" />
            <TextField
              id="name"
              value={name}
              onChange={handleNameChange}
              helperText={nameError}
              error={nameError !== ""}
            />
          </Stack>
        </FormControl>

        <FormControl fullWidth variant="standard">
          <Stack spacing={1.5}>
            <ItemLabel label="Sexe" icon="gender-symbols" />
            <Stack>
              <Select
                id="sex"
                value={sex}
                onChange={handleSexChange}
                variant="outlined"
                error={sexError !== ""}
              >
                <MenuItem value={Sex.male}>Garçon</MenuItem>
                <MenuItem value={Sex.female}>Fille</MenuItem>
              </Select>
              <FormHelperText error={sexError !== ""}>
                {sexError !== "" ? sexError : ""}
              </FormHelperText>
            </Stack>
          </Stack>
        </FormControl>

        <FormControl fullWidth variant="standard">
          <Stack spacing={1.5}>
            <ItemLabel label="Date de naissance" icon="calendar" />
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={dayjsLocaleFrCa as any}
            >
              <MobileDateTimePicker
                value={birthDate}
                onChange={handleBirthDateChange}
                disableFuture={true}
                //   label="Date de naissance"
                ampm={false}
                localeText={{
                  toolbarTitle: "",
                  okButtonLabel: "OK",
                  cancelButtonLabel: "Annuler",
                  nextMonth: "Mois suivant",
                  previousMonth: "Mois précédent",
                }}
              />
            </LocalizationProvider>
          </Stack>
        </FormControl>

        <FormControl fullWidth variant="standard">
          <Stack spacing={1.5}>
            <ItemLabel label="Poids à la naissance" icon="weight" />
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={1.5}
            >
              <TextField
                label="Kg"
                name="weight"
                type="number"
                value={kilograms}
                onChange={handleKilogramsChange}
                fullWidth
              />

              <TextField
                label="Lbs"
                name="weight"
                type="number"
                value={pounds}
                onChange={handlePoundsChange}
                fullWidth
              />
            </Stack>
          </Stack>
        </FormControl>

        <FormControl fullWidth variant="standard">
          <Stack spacing={1.5}>
            <ItemLabel label="Taille à la naissance" icon="size" />
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={1.5}
            >
              <TextField
                label="Centimètres"
                name="size-in-cm"
                type="number"
                value={sizeInCentimeters}
                onChange={handleSizeInCentimetersChange}
                fullWidth
              />
              <TextField
                label="Pouces"
                name="size-in-inches"
                type="number"
                value={sizeInInches}
                onChange={handleSizeInInchesChange}
                fullWidth
              />
            </Stack>
          </Stack>
        </FormControl>

        <FormControl fullWidth variant="standard">
          <Stack spacing={1.5}>
            <ItemLabel label="Tour de tête à la naissance" icon="size" />
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={1.5}
            >
              <TextField
                label="Centimètres"
                name="head-circumference-in-cm"
                type="number"
                value={headCircumferenceInCentimeters}
                onChange={handleHeadCircumferenceInCentimetersChange}
                fullWidth
              />
              <TextField
                label="Pouces"
                name="head-circumference-in-inches"
                type="number"
                value={headCircumferenceInInches}
                onChange={handleHeadCircumferenceInInchesChange}
                fullWidth
              />
            </Stack>
          </Stack>
        </FormControl>
      </Stack>

      <AppBar
        position="fixed"
        component={"footer"}
        sx={{
          top: "auto",
          bottom: 0,
          backgroundColor: "background.default",
          zIndex: (theme) => theme.zIndex.appBar + 1,
        }}
        color="transparent"
      >
        <Container maxWidth={CSSBreakpoint.Small}>
          <Toolbar disableGutters>
            <Stack
              flexGrow={1}
              sx={{
                paddingTop: 2,
                paddingBottom: 2,
              }}
              spacing={1.5}
            >
              <Button
                variant="contained"
                onClick={handleSubmit}
                fullWidth
                size="large"
                disabled={isSaving}
                sx={{
                  height: `calc(${theme.typography.button.fontSize} * 2.5)`,
                }}
              >
                {isSaving == true ? (
                  <LoadingIndicator size={theme.typography.button.fontSize} />
                ) : isNullOrWhiteSpace(child.id) == true ? (
                  "Enregistrer"
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
