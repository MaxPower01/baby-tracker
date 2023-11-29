import { useContext, useEffect } from "react";

import EntriesContext from "@/pages/Entries/components/EntriesContext";
import { EntryHelper } from "@/pages/Entries/utils/EntryHelper";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { useAppSelector } from "@/store/hooks/useAppSelector";

export function useEntries() {
  const dispatch = useAppDispatch();
  const entries = useAppSelector((state) => state.entriesReducer.entries);
  const status = useAppSelector((state) => state.entriesReducer.status);

  useEffect(() => {}, [dispatch, status]);

  return {
    entries,
    status,
  };
}
