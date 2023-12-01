import { useContext, useEffect } from "react";

import EntriesContext from "@/pages/Entries/components/EntriesContext";
import { EntryHelper } from "@/pages/Entries/utils/EntryHelper";
import { fetchInitialEntries } from "@/pages/Entries/state/entriesSlice";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { useAppSelector } from "@/store/hooks/useAppSelector";

export function useEntries() {
  const dispatch = useAppDispatch();
  const entries = useAppSelector((state) => state.entriesReducer.entries);
  const status = useAppSelector((state) => state.entriesReducer.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchInitialEntries());
    }
  }, [dispatch]);

  return {
    entries,
    status,
  };
}
