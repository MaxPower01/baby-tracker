import Child from "@/modules/authentication/types/Child";

export default interface ChildrenContextValue {
  children: Child[] | null;
  isLoading: boolean;
  saveChild: (child: Child) => Promise<Child>;
}
