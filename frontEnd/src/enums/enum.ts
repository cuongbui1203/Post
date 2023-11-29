export const enum TypeEnum {
  Document = 1,
  TransportPoint = 2,
  TransactionPoint = 3,
  RegisteredOffice = 8,
  Goods = 4,
  Ward = 5,
  District = 6,
  Province = 7,
}

export const enum StatusEnum {
  WaitFDelivery = 1,
  RDelivery = 2,
  Done = 3,
  LeaveTransportPoint = 4,
  AtTransportPoint = 5,
  Shipping = 6,
  ToTheTransportPoint = 7,
  ToTheTransactionPoint = 8,
  Return = 9,
  Create = 10,
  Complete = 11,
  Fail = 12,
}

export const enum UserRole {
  Guest = "GUEST",
  Employee = "EMPLOYEE",
  Manager = "MANAGER",
  Boss = "BOSS",
  Shipper = "SHIPPER",
  Staff = "STAFF",
}

export const enum ActionEnum {
  ReturnNow = "RETURN_NOW",
  ReturnBefore = "RETURN_BEFORE",
  Return = "RETURN",
  Call = "CALL",
}
