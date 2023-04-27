import React from "react";
import LayoutContext from "../components/LayoutContext";

export default function useLayout() {
  const layoutContext = React.useContext(LayoutContext);
  if (!layoutContext) {
    throw new Error(
      "No MenuContext provided. Make sure to call useLayout() inside a LayoutProvider."
    );
  }

  const { shouldRenderDeleteButton, setShouldRenderDeleteButton } =
    layoutContext;

  return {
    shouldRenderDeleteButton,
    setShouldRenderDeleteButton,
  };
}
