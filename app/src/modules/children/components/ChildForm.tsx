import {
  AppBar,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
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
import dayjs, { Dayjs } from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CSSBreakpoint from "@/common/enums/CSSBreakpoint";
import Child from "@/modules/authentication/types/Child";
import LoadingIndicator from "@/common/components/LoadingIndicator";
import PageId from "@/common/enums/PageId";
import Sex from "@/common/enums/Sex";
import dayjsLocaleFrCa from "@/lib/dayjs/dayjsLocaleFrCa";
import getPath from "@/utils/getPath";
import useChidlren from "@/modules/children/hooks/useChildren";

type Props = {
  child: Child;
};

export default function ChildForm(props: Props) {
  const theme = useTheme();
  const navigate = useNavigate();

  const [child, setChild] = useState<Child>(props.child);

  const { saveChild } = useChidlren();

  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(child.name);
  const [nameError, setNameError] = useState("");
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setNameError("");
  };

  const [sex, setSex] = useState(child.sex);
  const [sexError, setSexError] = useState("");
  const handleSexChange = (event: SelectChangeEvent<string>) => {
    setSex(event.target.value);
    setSexError("");
  };

  const [birthDate, setBirthDate] = useState<Dayjs>(dayjs(child.birthDate));
  const handleBirthDateChange = (date: Dayjs | null) => {
    if (date) {
      setBirthDate(date);
    }
  };

  const [weight, setWeight] = useState(child.birthWeight ?? 0);

  const kilograms = useMemo(() => {
    if (weight == null || isNaN(weight) || weight === 0) return 0;
    // Make sure that it's no more than 2 decimal places
    return Math.round((weight / 1000) * 100) / 100;
  }, [weight]);

  const pounds = useMemo(() => {
    if (weight == null || isNaN(weight) || weight === 0) return 0;
    // Make sure that it's no more than 2 decimal places
    return Math.round((weight / 453.592) * 100) / 100;
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
    // Make sure that it's no more than 2 decimal places
    return Math.round((size / 10) * 100) / 100;
  }, [size]);

  const sizeInInches = useMemo(() => {
    if (size == null || isNaN(size) || size === 0) return 0;
    // Make sure that it's no more than 2 decimal places
    return Math.round((size / 25.4) * 100) / 100;
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
    // Make sure that it's no more than 2 decimal places
    return Math.round((headCircumference / 10) * 100) / 100;
  }, [headCircumference]);

  const headCircumferenceInInches = useMemo(() => {
    if (
      headCircumference == null ||
      isNaN(headCircumference) ||
      headCircumference === 0
    )
      return 0;
    // Make sure that it's no more than 2 decimal places
    return Math.round((headCircumference / 25.4) * 100) / 100;
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

  const handleSubmit = useCallback(async () => {
    if (!child || !saveChild || isSaving) {
      return;
    }
    console.log("Saving child: ", child);
    const newChild = Object.assign({}, child);
    newChild.name = name;
    newChild.birthDate = birthDate.toDate();
    newChild.sex = sex;
    newChild.birthSize = size == 0 ? 0 : Math.round(size * 100) / 100;
    newChild.birthWeight = weight == 0 ? 0 : Math.round(weight * 100) / 100;
    newChild.birthHeadCircumference =
      headCircumference == 0 ? 0 : Math.round(headCircumference * 100) / 100;
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
  ]);

  return (
    <>
      <Stack spacing={3}>
        <FormControl fullWidth variant="standard">
          <Stack spacing={1.5}>
            <Typography variant="body1" color={"text.secondary"}>
              Nom
            </Typography>
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
            <Typography variant="body1" color={"text.secondary"}>
              Sexe
            </Typography>
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
            <Typography variant="body1" color={"text.secondary"}>
              Date de naissance
            </Typography>
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
            <Typography variant="body1" color={"text.secondary"}>
              Poids à la naissance
            </Typography>
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
            <Typography variant="body1" color={"text.secondary"}>
              Taille à la naissance
            </Typography>
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
            <Typography variant="body1" color={"text.secondary"}>
              Tour de tête à la naissance
            </Typography>
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
                ) : (
                  "Enretistrer"
                )}
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
