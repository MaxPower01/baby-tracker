import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
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
import { useCallback, useState } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Child from "@/pages/Authentication/types/Child";
import ChildForm from "@/pages/Baby/components/ChildForm";
import PageId from "@/enums/PageId";
import Sex from "@/enums/Sex";
import dayjsLocaleFrCa from "@/lib/dayjs/dayjsLocaleFrCa";
import { db } from "@/firebase";
import getPath from "@/utils/getPath";
import useAuthentication from "@/pages/Authentication/hooks/useAuthentication";
import { useNavigate } from "react-router-dom";

export default function ChildWizard() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthentication();
  const [step, setStep] = useState(1);
  const [sex, setSex] = useState("");
  const [sexError, setSexError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [birthDate, setBirthDate] = useState<Dayjs | null>(dayjs());
  const [birthWeight, setBirthWeight] = useState<number | null>(null);
  const [birthSize, setBirthSize] = useState<number | null>(null);
  const [birthHeadSize, setBirthHeadSize] = useState<number | null>(null);

  const goToNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const goToPreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSexChange = (event: SelectChangeEvent<string>) => {
    setSex(event.target.value);
    setSexError("");
  };

  const handleSubmitSex = useCallback(() => {
    if (sex === "") {
      setSexError("Veuillez sélectionner un sexe pour continuer");
      return;
    }
    goToNextStep();
  }, [sex]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleNameSubmit = useCallback(() => {
    if (name === "") {
      setNameError("Veuillez entrer un nom pour continuer");
      return;
    }
    goToNextStep();
  }, [name]);

  const handleBirthDateChange = (newBirdhDate: Dayjs | null) => {
    setBirthDate(newBirdhDate);
  };

  const handleSubmit = useCallback(() => {
    if (!user || !birthDate) {
      return;
    }
    addDoc(collection(db, "children"), {
      name: name,
      birthDate: Timestamp.fromDate(birthDate.toDate()),
      sex,
      parents: [user.uid],
    }).then((docRef) => {
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
    });
  }, [user, name, birthDate, navigate]);

  const renderStep = useCallback(() => {
    switch (step) {
      case 1:
        return (
          <>
            <FormControl fullWidth variant="standard">
              <InputLabel id="sex-label">Sexe</InputLabel>
              <Select
                id="sex"
                labelId="sex-label"
                value={sex}
                SelectDisplayProps={{
                  style: {
                    padding: "0.5em",
                  },
                }}
                onChange={handleSexChange}
                error={sexError !== ""}
              >
                <MenuItem value={Sex.male}>Garçon</MenuItem>
                <MenuItem value={Sex.female}>Fille</MenuItem>
              </Select>
              <FormHelperText error={sexError !== ""}>
                {sexError !== "" ? sexError : ""}
              </FormHelperText>
            </FormControl>
            <Button onClick={handleSubmitSex} variant="contained">
              Suivant
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <FormControl fullWidth variant="standard">
              <TextField
                id="name"
                label="Nom"
                value={name}
                onChange={handleNameChange}
                helperText={nameError}
                error={nameError !== ""}
              />
            </FormControl>
            <Button onClick={handleNameSubmit} variant="contained">
              Suivant
            </Button>
            <Button onClick={goToPreviousStep} variant="outlined">
              Précédent
            </Button>
          </>
        );
      case 3:
        return (
          <>
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
            <Button onClick={handleSubmit} variant="contained">
              Ajouter {name}
            </Button>
            <Button onClick={goToPreviousStep} variant="outlined">
              Précédent
            </Button>
          </>
        );
      default:
        return null;
    }
  }, [
    step,
    sex,
    name,
    birthDate,
    sexError,
    handleSexChange,
    handleSubmitSex,
    handleNameChange,
    handleNameSubmit,
    handleBirthDateChange,
    handleSubmit,
    goToPreviousStep,
  ]);

  return <Stack spacing={2}>{renderStep()}</Stack>;
}
