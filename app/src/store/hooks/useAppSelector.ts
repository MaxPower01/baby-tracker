import { TypedUseSelectorHook, useSelector } from "react-redux";
import store, { RootState } from "@/store/store";

export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
