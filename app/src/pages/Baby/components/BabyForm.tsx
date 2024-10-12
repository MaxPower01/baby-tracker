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
  Modal,
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
import { Baby } from "@/types/Baby";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { CustomBottomBar } from "@/components/CustomBottomBar";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { PageId } from "@/enums/PageId";
import { ReactSVG } from "react-svg";
import { SexId } from "@/enums/SexId";
import { SizeInput } from "@/components/SizeInput";
import { WeightInput } from "@/components/WeightInput";
import dayjsLocaleFrCa from "@/lib/dayjs/dayjsLocaleFrCa";
import { getDefaultActivityContexts } from "@/pages/Activities/utils/getDefaultActivityContexts";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAuthentication } from "@/components/Authentication/AuthenticationProvider";
import { useBabies } from "@/pages/Baby/components/BabiesProvider";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{
            color: theme.customPalette.text.tertiary,
          }}
        >{`${Math.round(props.value)}%`}</Typography>
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
      <Typography
        variant="body1"
        sx={{
          color: theme.customPalette.text.secondary,
        }}
      >
        {props.label}
      </Typography>
    </Stack>
  );
}

type Props = {
  baby?: Baby;
};

export default function BabyForm(props: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const avatarWidth = 150;
  const avatarFontSize = avatarWidth / 2.5;
  const { user, setUser } = useAuthentication();

  const initialBaby: Baby = props.baby ?? {
    id: "",
    name: "",
    birthDate: new Date(),
    parents: [],
    sex: "",
    birthHeadCircumference: 0,
    birthSize: 0,
    birthWeight: 0,
    avatar: "",
    activityContexts: getDefaultActivityContexts(),
  };

  const [baby, setBaby] = useState<Baby>(initialBaby);

  const { saveBaby } = useBabies();

  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(baby.name);
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

  const [avatar, setAvatar] = useState(baby.avatar);
  const [imageIsUploading, setImageIsUploading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const uploadImage = useCallback(
    async (image: File) => {
      const babyId = user?.babyId ?? "";
      if (image == null || isNullOrWhiteSpace(babyId)) return;
      const storageRef = ref(
        storage,
        `child/${babyId}/images/profile-pictures/${image.name}` // TODO: Eventually, rename "child" to "baby"
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

  const [sex, setSex] = useState(baby.sex);
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

  const [birthDate, setBirthDate] = useState<Dayjs>(dayjs(baby.birthDate));
  const handleBirthDateChange = (date: Dayjs | null) => {
    if (date) {
      setBirthDate(date);
    }
  };

  const [weight, setWeight] = useState(
    baby.birthWeight == null || baby.birthWeight == 0
      ? 0
      : baby.birthWeight / 1000
  );
  const [size, setSize] = useState(baby.birthSize ?? 0);
  const [headCircumference, setHeadCircumference] = useState(
    baby.birthHeadCircumference ?? 0
  );

  const save = useCallback(async () => {
    const newBaby = Object.assign({}, baby);
    newBaby.name = name;
    newBaby.birthDate = birthDate.toDate();
    newBaby.sex = sex;
    newBaby.birthSize = size == 0 ? 0 : Math.round(size * 100) / 100;
    newBaby.birthWeight =
      weight == 0 ? 0 : Math.round(weight * 1000 * 100) / 100;
    newBaby.birthHeadCircumference =
      headCircumference == 0 ? 0 : Math.round(headCircumference * 100) / 100;
    newBaby.avatar = avatar;
    if (newBaby.activityContexts == null) {
      newBaby.activityContexts = getDefaultActivityContexts();
    }
    setIsSaving(true);
    saveBaby(newBaby)
      .then(() => {
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
        console.error("Error saving baby: ", error);
        // enqueueSnackbar("Erreur lors de la sauvegarde de l'enfant", {
        //     variant: "error",
        // });
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [
    saveBaby,
    baby,
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
    const newBaby: Baby = {
      id: "",
      name: name,
      birthDate: birthDate.toDate(),
      parents: [user.uid],
      sex,
      avatar,
      birthHeadCircumference: headCircumference,
      birthSize: size,
      birthWeight: weight,
      activityContexts: getDefaultActivityContexts(),
    };
    const { id, birthDate: newBirthDate, ...rest } = newBaby;
    addDoc(collection(db, "babies"), {
      birthDate: Timestamp.fromDate(newBirthDate),
      ...rest,
    })
      .then((docRef) => {
        const userRef = doc(db, "users", user.uid);
        updateDoc(userRef, {
          babyId: docRef.id,
          babies: arrayUnion(docRef.id),
        }).then(() => {
          setUser((prev) => {
            if (!prev) {
              return null;
            }
            return {
              ...prev,
              babyId: docRef.id,
              babies: [...prev.babies, docRef.id] as string[],
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
        console.error("Error creating baby: ", error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [
    saveBaby,
    baby,
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
    if (!baby || !saveBaby || isSaving) {
      return;
    }

    if (isNullOrWhiteSpace(baby.id)) {
      await create();
    } else {
      await save();
    }
  }, [
    saveBaby,
    baby,
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

  const handleUploadImageButtonClick = () => {
    if (document && document.getElementById) {
      const input = document.getElementById("baby-form-image-upload");
      if (input) {
        input.click();
      }
    }
  };

  const [modalImageURL, setModalImageURL] = useState<string | null>(null);

  const handleCloseModal = () => {
    setModalImageURL(null);
  };

  const handleAvatarClick = useCallback(() => {
    if (!avatar || isNullOrWhiteSpace(avatar)) {
      handleUploadImageButtonClick();
      return;
    }
    setModalImageURL(avatar);
  }, [avatar]);

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
              cursor: "pointer",
            }}
            src={avatar}
            onClick={handleAvatarClick}
          >
            {initials}
          </Avatar>
          {imageIsUploading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgressWithLabel value={imageUploadProgress} />
            </Box>
          )}
          {!isNullOrWhiteSpace(user?.babyId) && (
            <>
              <input
                id="baby-form-image-upload"
                type="file"
                accept="image/*"
                multiple={true}
                onChange={async (e) => await handleImageInputClick(e)}
                style={{ display: "none" }}
              />
              <label htmlFor="baby-form-image-upload">
                <Button
                  variant="text"
                  onClick={handleUploadImageButtonClick}
                  fullWidth
                >
                  Définir une photo de profil
                </Button>
              </label>
            </>
          )}
        </Stack>

        <FormControl fullWidth variant="outlined">
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

        <FormControl fullWidth variant="outlined">
          <Stack spacing={1.5}>
            <ItemLabel label="Sexe" icon="gender-symbols" />
            <Stack>
              <Select
                id="sex"
                value={sex}
                onChange={handleSexChange}
                error={sexError !== ""}
              >
                <MenuItem value={SexId.Male}>Garçon</MenuItem>
                <MenuItem value={SexId.Female}>Fille</MenuItem>
              </Select>
              <FormHelperText error={sexError !== ""}>
                {sexError !== "" ? sexError : ""}
              </FormHelperText>
            </Stack>
          </Stack>
        </FormControl>

        <FormControl fullWidth variant="outlined">
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

        <FormControl fullWidth variant="outlined">
          <Stack spacing={1.5}>
            <ItemLabel label="Poids à la naissance" icon="weight" />
            <WeightInput value={weight} setValue={setWeight} />
          </Stack>
        </FormControl>

        <FormControl fullWidth variant="outlined">
          <Stack spacing={1.5}>
            <ItemLabel label="Taille à la naissance" icon="size" />
            <SizeInput value={size} setValue={setSize} />
          </Stack>
        </FormControl>

        <FormControl fullWidth variant="outlined">
          <Stack spacing={1.5}>
            <ItemLabel label="Tour de tête à la naissance" icon="size" />
            <SizeInput
              value={headCircumference}
              setValue={setHeadCircumference}
            />
          </Stack>
        </FormControl>
      </Stack>

      <Modal
        open={modalImageURL !== null}
        onClose={handleCloseModal}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            outline: "none",
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <img
            src={modalImageURL ?? ""}
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
      </Modal>

      <CustomBottomBar
        onSaveButtonClick={handleSubmit}
        saveButtonDisabled={isSaving}
        saveButtonLoading={isSaving}
      />
    </>
  );
}
