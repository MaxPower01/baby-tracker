import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Entry } from "../models/Entry";
import { selectEntries } from "../state/entriesSlice";

const useEntries = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState<Entry[]>([]);

  const localStateEntries = useSelector(selectEntries);

  useEffect(() => {
    if (localStateEntries) {
      setEntries(localStateEntries);
      setIsLoading(false);
    }
  }, [localStateEntries]);

  const getEntries = () => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setEntries(localStateEntries);
        setIsLoading(false);
        resolve(localStateEntries);
      }, 2000); // Simulate 2 seconds delay
    });
  };

  return { entries, isLoading, getEntries };
};

export default useEntries;
