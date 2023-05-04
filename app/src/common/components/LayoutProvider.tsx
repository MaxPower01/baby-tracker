import React, { useCallback } from "react";
import LayoutContext from "./LayoutContext";

export default function LayoutProvider(props: React.PropsWithChildren<{}>) {
  const [shouldRenderDeleteButton, setShouldRenderDeleteButton] =
    React.useState(false);

  return (
    <LayoutContext.Provider
      value={{
        shouldRenderDeleteButton,
        setShouldRenderDeleteButton: useCallback(
          (value: boolean) => setShouldRenderDeleteButton(value),
          []
        ),
      }}
    >
      {props.children}
    </LayoutContext.Provider>
  );
}
