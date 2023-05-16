import PageName from "@/common/enums/PageName";
import { db } from "@/firebase";
import dayjsLocaleFrCa from "@/lib/dayjs/dayjsLocaleFrCa";
import { getPath } from "@/lib/utils";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import {
  Button,
  FormControl,
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChildWizard() {
  const navigate = useNavigate();
  const { user, setChildren } = useAuthentication();
  const [step, setStep] = useState(1);
  const [sex, setSex] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Dayjs | null>(dayjs());

  const goToNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const goToPreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSexChange = (event: SelectChangeEvent<string>) => {
    console.log(event);
    setSex(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

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
        setChildren((prev) => [
          ...prev,
          { id: docRef.id, name: name, isSelected: true },
        ]);
        navigate(
          getPath({
            page: PageName.Home,
          })
        );
      });
    });
  }, [user, name, birthDate, setChildren, navigate]);

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
                autoFocus
              >
                <MenuItem value="male">Garçon</MenuItem>
                <MenuItem value="female">Fille</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={goToNextStep} variant="contained">
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
                autoFocus
              />
            </FormControl>
            <Button onClick={goToNextStep} variant="contained">
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
              adapterLocale={dayjsLocaleFrCa}
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
              Ajouter l'enfant
            </Button>
            <Button onClick={goToPreviousStep} variant="outlined">
              Précédent
            </Button>
          </>
        );
      default:
        return null;
    }
  }, [step, sex, name, birthDate]);

  return <Stack spacing={2}>{renderStep()}</Stack>;
}
