import store from "@/modules/store/store";
import { Provider } from "react-redux";

export default function StoreProvider(props: React.PropsWithChildren<{}>) {
  return <Provider store={store}>{props.children}</Provider>;
}
