import { useContext } from "react";
import Context from "./Context";

export function useStore() {
  const [state, dispatch] = useContext(Context);
  return [state, dispatch];
}
