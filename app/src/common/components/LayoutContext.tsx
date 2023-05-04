import React from "react";

const LayoutContext = React.createContext<{
  shouldRenderDeleteButton: boolean;
  setShouldRenderDeleteButton: (shouldRender: boolean) => void;
}>({
  shouldRenderDeleteButton: false,
  setShouldRenderDeleteButton: () => {},
});

export default LayoutContext;
