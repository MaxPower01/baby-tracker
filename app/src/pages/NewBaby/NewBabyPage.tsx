import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  LinearProgress,
  LinearProgressProps,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
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
import { useCallback, useMemo, useState } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AuthenticationForm from "@/pages/Authentication/components/AuthenticationForm";
import { Baby } from "@/pages/Authentication/types/Baby";
import { CustomBottomBar } from "@/components/CustomBottomBar";
import { CustomTopBar } from "@/components/CustomTopBar";
import { PageId } from "@/enums/PageId";
import { ReactSVG } from "react-svg";
import { SexId } from "@/enums/SexId";
import { SizeInput } from "@/components/SizeInput";
import { WeightInput } from "@/components/WeightInput";
import dayjsLocaleFrCa from "@/lib/dayjs/dayjsLocaleFrCa";
import { getDefaultActivityContexts } from "@/pages/Activities/utils/getDefaultActivityContexts";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useNavigate } from "react-router-dom";

// function LinearProgressWithLabel(
//   props: LinearProgressProps & { value: number }
// ) {
//   const theme = useTheme();
//   return (
//     <Box sx={{ display: "flex", alignItems: "center" }}>
//       <Box sx={{ width: "100%", mr: 1 }}>
//         <LinearProgress variant="determinate" {...props} />
//       </Box>
//       <Box sx={{ minWidth: 35 }}>
//         <Typography
//           variant="body2"
//           sx={{
//             color: theme.customPalette.text.tertiary,
//           }}
//         >{`${Math.round(props.value)}%`}</Typography>
//       </Box>
//     </Box>
//   );
// }

export function NewBabyPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthentication();
  const babyId = useMemo(() => {
    return user?.babyId ?? "";
  }, [user]);
  const theme = useTheme();
  const [step, setStep] = useState(0);

  const [sex, setSex] = useState<SexId | null>(null);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setNameError("");
  };

  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
  const handleBirthDateChange = (date: Dayjs | null) => {
    if (date) {
      setBirthDate(date);
    }
  };

  const [weight, setWeight] = useState(0);

  const [size, setSize] = useState(0);

  const [headCircumference, setHeadCircumference] = useState(0);

  const [isSaving, setIsSaving] = useState(false);

  //   const [avatar, setAvatar] = useState("");
  //   const [imageIsUploading, setImageIsUploading] = useState(false);
  //   const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const saveButtonDisabled = useMemo(() => {
    if (step === 0) {
      return sex === null;
    } else if (step === 1) {
      return isNullOrWhiteSpace(name);
    } else if (step === 2) {
      return birthDate == null;
    } else if (step === 3) {
      return false;
    }
    return false;
  }, [sex, name, birthDate, step]);

  //   const uploadImage = useCallback(
  //     async (image: File) => {
  //       const babyId = user?.babyId ?? "";
  //       if (image == null || isNullOrWhiteSpace(babyId)) return;
  //       const storageRef = ref(
  //         storage,
  //         `child/${babyId}/images/profile-pictures/${image.name}` // TODO: Eventually, rename "child" to "baby"
  //       );
  //       const uploadTask = uploadBytesResumable(storageRef, image);
  //       setImageUploadProgress(0);
  //       setImageIsUploading(true);
  //       uploadTask.on(
  //         "state_changed",
  //         (snapshot) => {
  //           // Progress function ...
  //           const progress = Math.round(
  //             (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //           );
  //           setImageUploadProgress(progress);
  //         },
  //         (error) => {
  //           // Error function ...
  //           console.error(error);
  //           setImageIsUploading(false);
  //         },
  //         () => {
  //           // Complete function ...
  //           getDownloadURL(uploadTask.snapshot.ref)
  //             .then((downloadURL) => {
  //               setAvatar(downloadURL);
  //             })
  //             .catch((error) => {
  //               console.error(error);
  //             })
  //             .finally(() => {
  //               setImageIsUploading(false);
  //               setImageUploadProgress(0);
  //             });
  //         }
  //       );
  //     },
  //     [user]
  //   );

  //   const handleImageInputClick = useCallback(
  //     async (event: React.ChangeEvent<HTMLInputElement>) => {
  //       if (imageIsUploading) return;
  //       if (event.target.files == null || event.target.files.length === 0) return;
  //       const image = event.target.files[0];
  //       await uploadImage(image);
  //     },
  //     [imageIsUploading, user, uploadImage]
  //   );

  //   const handleUploadImageButtonClick = () => {
  //     if (document && document.getElementById) {
  //       const input = document.getElementById("baby-form-image-upload");
  //       if (input) {
  //         input.click();
  //       }
  //     }
  //   };

  const handleStepIncrement = useCallback(() => {
    if (step === 1) {
      if (isNullOrWhiteSpace(name)) {
        setNameError("Veuillez entrer un nom");
        return;
      }
    }
    if (step === 3) {
      return;
    }
    setStep((prev) => prev + 1);
  }, [step, name]);

  const handleStepDecrement = useCallback(() => {
    if (step === 0) {
      return;
    }

    setStep((prev) => prev - 1);
  }, [step]);

  const createBaby = useCallback(async () => {
    if (!user || sex == null || birthDate == null) {
      return;
    }
    setIsSaving(true);
    const newBaby: Baby = {
      id: "",
      name: name,
      birthDate: birthDate.toDate(),
      parents: [user.uid],
      sex: sex.toString().toLowerCase(),
      avatar: "",
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
              babies: [
                ...prev.babies,
                {
                  id: docRef.id,
                  name: name,
                  birthDate: birthDate.toDate(),
                  sex: sex,
                },
              ] as Baby[],
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
    isSaving,
    name,
    birthDate,
    sex,
    size,
    weight,
    headCircumference,
    user,
    setUser,
  ]);

  return (
    <>
      <CustomTopBar
        renderBackButton={step !== 0}
        onBackButtonClick={() => {
          handleStepDecrement();
        }}
      />

      <Stack
        spacing={4}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <Stack
          spacing={2}
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          sx={{
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              fontSize: "8em",
            }}
          >
            {step === 0 && (
              <ReactSVG
                src="/icons/gender-symbols.svg"
                className="ActivityIcon"
              />
            )}

            {step === 1 && (
              <>
                {sex == SexId.Female && (
                  <ReactSVG
                    src="/icons/baby-girl.svg"
                    className="ActivityIcon"
                  />
                )}

                {sex == SexId.Male && (
                  <ReactSVG
                    src="/icons/baby-boy.svg"
                    className="ActivityIcon"
                  />
                )}
              </>
            )}

            {step === 2 && (
              <ReactSVG src="/icons/calendar.svg" className="ActivityIcon" />
            )}

            {step === 3 && sex == SexId.Female && (
              <ReactSVG src="/icons/baby-girl.svg" className="ActivityIcon" />
            )}

            {step === 3 && sex == SexId.Male && (
              <ReactSVG src="/icons/baby-boy.svg" className="ActivityIcon" />
            )}

            {/* {step === 3 && (
              <>
                {imageIsUploading == true && (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgressWithLabel value={imageUploadProgress} />
                  </Box>
                )}

                {imageIsUploading == false && (
                  <>
                    {isNullOrWhiteSpace(avatar) == false ? (
                      <Avatar
                        sx={{
                          width: 150,
                          height: 150,
                          border: isNullOrWhiteSpace(avatar)
                            ? "2px solid"
                            : null,
                          borderColor: isNullOrWhiteSpace(avatar)
                            ? theme.palette.divider
                            : null,
                          cursor: "pointer",
                        }}
                        src={avatar}
                      ></Avatar>
                    ) : (
                      <>
                        {sex == SexId.Female && (
                          <ReactSVG
                            src="/icons/baby-girl.svg"
                            className="ActivityIcon"
                          />
                        )}

                        {sex == SexId.Male && (
                          <ReactSVG
                            src="/icons/baby-boy.svg"
                            className="ActivityIcon"
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )} */}
          </Box>
          <Typography
            variant={"h4"}
            fontWeight={600}
            sx={{
              color: theme.customPalette.text.primary,
            }}
          >
            {step === 0 && "Avez-vous une fille ou un garçon?"}

            {step === 1 &&
              sex == SexId.Female &&
              "Quel est le nom de votre fille?"}

            {step === 1 &&
              sex == SexId.Male &&
              "Quel est le nom de votre fils?"}

            {step === 2 && sex == SexId.Female && "Quand est-elle née?"}

            {step === 2 && sex == SexId.Male && "Quand est-il né?"}

            {step === 3 &&
              sex == SexId.Female &&
              "Complétez le profil de votre fille"}

            {step === 3 &&
              sex == SexId.Male &&
              "Complétez le profil de votre fils"}
          </Typography>
        </Stack>

        {step === 0 && (
          <Stack
            spacing={2}
            direction={"row"}
            sx={{
              width: "100%",
            }}
          >
            <Card
              sx={{
                flexGrow: 1,
                borderWidth: 2,
                borderStyle: "solid",
                borderColor:
                  sex == SexId.Female
                    ? theme.customPalette.pink[200]
                    : "transparent",
              }}
            >
              <CardActionArea
                onClick={() => {
                  setSex(SexId.Female);
                }}
              >
                <CardContent>
                  <Stack spacing={2} direction={"column"} alignItems={"center"}>
                    <Box
                      sx={{
                        fontSize: "6em",
                        opacity:
                          sex === null
                            ? theme.opacity.secondary
                            : sex == SexId.Female
                            ? undefined
                            : theme.opacity.tertiary,
                      }}
                    >
                      <ReactSVG
                        src="/icons/baby-girl.svg"
                        className="ActivityIcon"
                      />
                    </Box>
                    <Typography
                      variant={"body1"}
                      textAlign={"center"}
                      sx={{
                        color:
                          sex === null
                            ? theme.customPalette.text.secondary
                            : sex == SexId.Female
                            ? theme.customPalette.pink[200]
                            : theme.customPalette.text.tertiary,
                        fontWeight: sex == SexId.Female ? 600 : undefined,
                      }}
                    >
                      Bébé fille
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>

            <Card
              sx={{
                flexGrow: 1,
                borderWidth: 2,
                borderStyle: "solid",
                borderColor:
                  sex == SexId.Male
                    ? theme.customPalette.blue[200]
                    : "transparent",
              }}
            >
              <CardActionArea
                onClick={() => {
                  setSex(SexId.Male);
                }}
              >
                <CardContent>
                  <Stack spacing={2} direction={"column"} alignItems={"center"}>
                    <Box
                      sx={{
                        fontSize: "6em",
                        opacity:
                          sex === null
                            ? theme.opacity.secondary
                            : sex == SexId.Male
                            ? undefined
                            : theme.opacity.tertiary,
                      }}
                    >
                      <ReactSVG
                        src="/icons/baby-boy.svg"
                        className="ActivityIcon"
                      />
                    </Box>
                    <Typography
                      variant={"body1"}
                      textAlign={"center"}
                      sx={{
                        color:
                          sex === null
                            ? theme.customPalette.text.secondary
                            : sex == SexId.Male
                            ? theme.customPalette.blue[200]
                            : theme.customPalette.text.tertiary,
                        fontWeight: sex == SexId.Male ? 600 : undefined,
                      }}
                    >
                      Bébé garçon
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Stack>
        )}

        {step === 1 && (
          <FormControl fullWidth variant="outlined">
            <Stack spacing={1.5}>
              <TextField
                id="name"
                label={
                  sex == SexId.Female
                    ? "Nom de votre fille"
                    : "Nom de votre fils"
                }
                value={name}
                onChange={handleNameChange}
                helperText={nameError}
                error={nameError !== ""}
              />
            </Stack>
          </FormControl>
        )}

        {step === 2 && (
          <FormControl fullWidth variant="outlined">
            <Stack spacing={1.5}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={dayjsLocaleFrCa as any}
              >
                <MobileDateTimePicker
                  value={birthDate}
                  onChange={handleBirthDateChange}
                  disableFuture={true}
                  label="Date de naissance"
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
        )}

        {step === 3 && (
          <Stack spacing={4}>
            {/* <input
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
                  Définir la photo de profil
                </Button>
              </label> */}

            <FormControl fullWidth variant="outlined">
              <Stack spacing={2}>
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Box
                    sx={{
                      fontSize: "1.5em",
                    }}
                  >
                    <ReactSVG src={`/icons/weight.svg`} className="Icon" />
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.customPalette.text.primary,
                    }}
                  >
                    Poinds à la naissance
                  </Typography>
                </Stack>

                <WeightInput value={weight} setValue={setWeight} />
              </Stack>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <Stack spacing={2}>
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Box
                    sx={{
                      fontSize: "1.5em",
                    }}
                  >
                    <ReactSVG src={`/icons/size.svg`} className="Icon" />
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.customPalette.text.primary,
                    }}
                  >
                    Taille à la naissance
                  </Typography>
                </Stack>

                <SizeInput value={size} setValue={setSize} />
              </Stack>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <Stack spacing={2}>
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Box
                    sx={{
                      fontSize: "1.5em",
                    }}
                  >
                    <ReactSVG src={`/icons/size.svg`} className="Icon" />
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.customPalette.text.primary,
                    }}
                  >
                    Tour de tête à la naissance
                  </Typography>
                </Stack>

                <SizeInput
                  value={headCircumference}
                  setValue={setHeadCircumference}
                />
              </Stack>
            </FormControl>
          </Stack>
        )}
      </Stack>

      <CustomBottomBar
        overrideSaveButtonlabel={step === 3 ? "Créer le profil" : "Suivant"}
        onSaveButtonClick={() => {
          if (step === 3) {
            createBaby();
          } else {
            handleStepIncrement();
          }
        }}
        saveButtonDisabled={saveButtonDisabled || isSaving}
        saveButtonLoading={isSaving}
      />
    </>
  );
}
