import {
  RESET,
  SET_ADDRESS,
  SET_BN,
  SET_CHOOSE_ACC,
  SET_LOGIN,
  SET_TOKEN,
  SET_USER,
  SET_WORK_PLATE,
  SET_WORK_PLATE_ID,
} from "./constain";

const setUser = (payload: unknown) => {
  return {
    type: SET_USER,
    payload,
  };
};

const setLoginState = (payload: unknown) => {
  return {
    type: SET_LOGIN,
    payload,
  };
};

const setWorkPlateId = (payload: string) => {
  return {
    type: SET_WORK_PLATE_ID,
    payload,
  };
};

const setToken = (payload: string) => {
  return {
    type: SET_TOKEN,
    payload,
  };
};

const setWorkPlate = (payload: unknown) => {
  return {
    type: SET_WORK_PLATE,
    payload,
  };
};

const resetStore = () => {
  return {
    type: RESET,
  };
};

const setAddress = (payload: unknown) => {
  return {
    type: SET_ADDRESS,
    payload,
  };
};
const setBienNhan = (payload: unknown) => {
  return {
    type: SET_BN,
    payload,
  };
};
const setChooseAcc = (payload: unknown) => {
  return {
    type: SET_CHOOSE_ACC,
    payload,
  };
};
export {
  setToken,
  setUser,
  setLoginState,
  setWorkPlateId,
  setWorkPlate,
  setAddress,
  resetStore,
  setBienNhan,
  setChooseAcc,
};
