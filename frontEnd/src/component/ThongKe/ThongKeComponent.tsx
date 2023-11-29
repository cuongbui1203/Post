import { TypeEnum, UserRole } from "../../enums/enum";
import { useStore } from "../../state/hooks";
import ManagerThongKeComponent from "./ManagerThongKeComponent";
import EmployeeThongKeComponent from "./EmployeeThongKeComponent";
import BossThongKeComponent from "./BossThongKeComponent";

function ThongKeComponent() {
  const [state] = useStore();
  let content = <></>;
  switch (state.user.role.name) {
    case UserRole.Employee:
      if (state.workPlate.type.id === TypeEnum.TransactionPoint) {
        content = <EmployeeThongKeComponent />; /// thong ke cua nhan vien diem giao dich
      } /// thong ke cua nhan vien diem chung chuyen
      break;
    case UserRole.Manager:
      content = <ManagerThongKeComponent />;
      break;
    case UserRole.Boss:
      content = <BossThongKeComponent />;
      break;
  }
  return <>{content}</>;
}

export default ThongKeComponent;
