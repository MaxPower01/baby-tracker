import { Provider } from "react-redux";
import store from "@/store/store";

export function StoreProvider(props: React.PropsWithChildren<{}>) {
  return <Provider store={store}>{props.children}</Provider>;
}
