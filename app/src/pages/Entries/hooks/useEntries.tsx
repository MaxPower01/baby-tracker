import {
  fetchInitialEntries,
  selectEntries,
  selectEntriesStatus,
} from "@/state/entriesSlice";
import { useContext, useEffect } from "react";

import EntriesContext from "@/pages/Entries/components/EntriesContext";
import { RootState } from "@/state/store";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useSelector } from "react-redux";

export function useEntries() {
  const dispatch = useAppDispatch();
  const entries = useSelector(selectEntries);
  const status = useSelector(selectEntriesStatus);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchInitialEntries());
    }
  }, [dispatch]);

  return {
    entries,
    status: "idle",
  };
}
