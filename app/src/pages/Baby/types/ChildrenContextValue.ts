import Child from "@/pages/Authentication/types/Child";

export default interface ChildrenContextValue {
  children: Child[] | null;
  isLoading: boolean;
  saveChild: (child: Child) => Promise<Child>;
}
