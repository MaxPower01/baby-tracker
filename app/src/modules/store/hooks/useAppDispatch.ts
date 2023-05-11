import { useDispatch } from "react-redux";


import store from "@/modules/store/store";

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch; // Export a hook that can be reused to resolve types
