import {
  AddressInfo,
  BienNhanInfo,
  UserInfo,
  WorkPlateInfo,
} from "../interface/ResponseInterface";
import {
  RESET,
  SET_BN,
  SET_CHOOSE_ACC,
  SET_LOGIN,
  SET_TOKEN,
  SET_USER,
  SET_WORK_PLATE,
  SET_WORK_PLATE_ID,
} from "./constain";
interface StateInterface {
  user: UserInfo | null;
  bienNhan: BienNhanInfo | null;
  login: boolean;
  loading: boolean;
  token: string;
  workPlateId: string;
  workPlate: WorkPlateInfo | null;
  address: AddressInfo | null;
  chooseUser: UserInfo | null;
  // bienNhan: BienNhanInfo
}

const initState: StateInterface = {
  user: null,
  bienNhan: null,
  login: false,
  loading: false,
  token: "",
  workPlateId: "",
  workPlate: null,
  address: null,
  chooseUser: null,
};

const reducer = (
  state: StateInterface,
  action: { payload: object; type: string }
) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case SET_LOGIN:
      return {
        ...state,
        login: action.payload,
      };
    case SET_WORK_PLATE_ID:
      return {
        ...state,
        workPlateId: action.payload,
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case SET_WORK_PLATE:
      return {
        ...state,
        workPlate: action.payload,
      };
    case RESET:
      return {
        ...initState,
      };
    case SET_BN:
      return {
        ...state,
        bienNhan: action.payload,
      };
    case SET_CHOOSE_ACC:
      return {
        ...state,
        chooseUser: action.payload,
      };
    default:
      throw new Error("invalid action");
  }
};

export { initState };
export type { StateInterface };
export default reducer;
