import { createContext } from "react";
import { StateInterface } from "./Reusecer";

const Context = createContext<Partial<StateInterface>>({});

export default Context;
