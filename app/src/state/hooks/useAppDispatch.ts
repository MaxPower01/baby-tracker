import store from "@/state/store";
import { useDispatch } from "react-redux";

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch; // Export a hook that can be reused to resolve types
