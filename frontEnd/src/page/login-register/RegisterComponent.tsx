import { Button, DatePicker, Form, Input, Select } from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import { useEffect, useState } from "react";
import { GetDistricts, GetProvinces, GetWards } from "../../api/addressApi";
import styles from "./login.module.scss";
import { Dayjs } from "dayjs";
import { Link } from "react-router-dom";
import { UserRole } from "../../enums/enum";
import { useStore } from "../../state/hooks";
import { handleRegister } from "../../api/authApi";
import net from "../../api/net";
const { Item } = Form;

interface FormResults {
  email: string;
  password: string;
  password2: string;
  address: string;
  ward: string;
  phone: string;
  name: string;
  dob: Dayjs;
  wpId: string;
}
interface SelectOptionType {
  value: string;
  label: string;
}

const inputStyle: React.CSSProperties = {
  width: 400,
  // backgroundColor: "transparent",
  border: "none",
  borderBottom: "2px solid #d1d1d4",
  // background: 'none',
  padding: "10px",
  paddingLeft: "24px",
  fontWeight: "700",
  // color: "white",
  // // width: 75%,
  // transition: 0.2s;
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "65%",
  height: "90vh",
  padding: "15px",
  // backgroundColor: "linear-gradient(90deg, #5d54a4, #7c78b8)",
  backgroundColor: "white",
  borderRadius: "15px",
  boxShadow: "0px 0px 24px #5c5696",
};

// const formStyle: React.CSSProperties = {
//   backgroundColor: "red",
// };

export default function RegisterComponent() {
  let idProvince = "";

  const [idDistrict, setIdDistrict] = useState<string | null>(null);
  const [idWard, setIdWard] = useState<string | null>(null);
  const [state] = useStore();
  const [showDistrict, setShowDistrict] = useState(false);
  const [showWard, setShowWard] = useState(false);
  const [listProvince, setListProvince] = useState<SelectOptionType[]>([]);
  const [listDistrict, setListDistrict] = useState<SelectOptionType[]>([]);
  const [listWard, setListWard] = useState<SelectOptionType[]>([]);
  const [listWP, setListWP] = useState<SelectOptionType[]>([]);
  const [wpId, setWpId] = useState<string>(state.workPlateId);
  // const handleChange = (e: unknown) => {
  //   console.log(e);
  // };
  useEffect(() => {
    const handle = async () => {
      const res = await GetProvinces();
      console.log(state);
      const res2 = await net.get("/works");
      const tem2: SelectOptionType[] = [];
      const tem: SelectOptionType[] = [];
      res?.data.map((e) => {
        tem.push({
          label: e.name,
          value: e.id,
        });
      });
      res2.data.data.map((e: { name: string; id: string }) => {
        tem2.push({
          label: e.name,
          value: e.id,
        });
      });
      setListProvince(tem);
      setListWP(tem2);
      setWpId(state.workPlateId);
    };

    return () => {
      handle();
    };
  }, []);
  const handleGetDistrict = async (id: string) => {
    console.log(idProvince);
    const res = await GetDistricts(id);
    console.log(res);
    const tem: SelectOptionType[] = [];
    res?.data.map((e) => {
      tem.push({
        label: e.name,
        value: e.id,
      });
    });
    setListDistrict(tem);
    setShowDistrict(true);
  };

  const handleGetWard = async (id: string) => {
    const res = await GetWards(id);
    const tem: SelectOptionType[] = [];
    res?.data.map((e) => {
      tem.push({
        label: e.name,
        value: e.id,
      });
    });
    setListWard(tem);
    setShowWard(true);
  };

  const onFinish = async (values: FormResults) => {
    const form = new FormData();
    form.append("email", values.email);
    form.append("password", values.password);
    form.append("password_confirmation", values.password2);
    form.append("name", values.name);
    form.append("address", values.address);
    form.append("address_id", values.ward);
    form.append("role", UserRole.Employee);
    form.append("phone", values.phone);
    form.append("dob", values.dob.format("YYYY-MM-DD"));
    form.append("idWorkPlate", values.wpId);
    console.log(values.dob.format("YYYY-MM-DD"));
    console.log(form.entries());
    const res = await handleRegister(form);
    if (res) {
      console.log(res.name);
    } else {
      console.log("fail");
    }
    // const res = await handleLogin(form);
    // if (res?.success) {
    //   console.log("thanh cong");
    // } else {
    //   console.log("that bai");
    // }
    // handleOk();
  };

  return (
    <div
      className={styles.main}
      style={{
        height: "98vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#71c571",
      }}
    >
      <Form
        name="register"
        style={containerStyle}
        initialValues={{
          remember: true,
        }}
        validateTrigger="onChange"
        onFinish={onFinish}
      >
        <h1>Register</h1>
        <div
          style={{
            display: "flex",
            // flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div>
            <Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Khong duoc bo trong",
                },
              ]}
            >
              <Input style={inputStyle} placeholder="name" />
            </Item>
            <Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Khong duoc bo trong",
                },
                {
                  type: "email",
                  message: "vui long dien email hop le",
                },
              ]}
            >
              <Input style={inputStyle} placeholder="email" />
            </Item>
            <Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Khong duoc bo trong",
                },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                  message: "8 characters, 1 uppercase, 1 lowercase, 1 number.",
                },
              ]}
            >
              <Input
                style={inputStyle}
                placeholder="password"
                type="password"
              />
            </Item>
            <Item
              name="password2"
              rules={[
                {
                  required: true,
                  message: "Khong duoc bo trong",
                },
                // {
                //   pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                //   message: "8 characters, 1 uppercase, 1 lowercase, 1 number.",
                // },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
              dependencies={["password"]}
            >
              <Input
                style={inputStyle}
                placeholder="password"
                type="password"
              />
            </Item>
            <Item
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Khong duoc bo trong",
                },
              ]}
            >
              <Input style={inputStyle} placeholder="phone" />
            </Item>
          </div>
          <div>
            <Item
              name="dob"
              rules={[
                {
                  required: true,
                  message: "Khong duoc bo trong",
                },
              ]}
            >
              <DatePicker
                style={inputStyle}
                onChange={(e) => console.log(e?.format("YYYY-m-d"))}
                locale={locale}
                showToday={false}
                showTime={false}
                allowClear={false}
              />
            </Item>
            <Item
              name="wpId"
              rules={[
                {
                  required: true,
                  message: "Khong duoc bo trong",
                },
              ]}
            >
              <Select
                // style={inputStyle}
                onChange={(v: string) => {
                  setWpId(v);
                }}
                // dropdownStyle={{
                //   backgroundColor: "transparent",
                // }}
                // className={styles.login__input}
                options={listWP}
                value={wpId}
                defaultValue={state.workPlateId}
                placeholder="Chọn noi lm vc"
              />
            </Item>
            <Item
              name="province"
              rules={[
                {
                  required: true,
                  message: "Khong duoc bo trong",
                },
              ]}
            >
              <Select
                // style={inputStyle}
                onChange={(v: string) => {
                  idProvince = v;
                  handleGetDistrict(v);
                  setIdDistrict(null);
                  setIdWard(null);
                }}
                // dropdownStyle={{
                //   backgroundColor: "transparent",
                // }}
                // className={styles.login__input}
                options={listProvince}
                placeholder="Chọn tỉnh"
              />
            </Item>
            <Item
              name="district"
              rules={[
                {
                  required: true,
                  message: "Khong duoc bo trong",
                },
              ]}
            >
              <Select
                // style={inputStyle}
                value={idDistrict}
                disabled={!showDistrict}
                onChange={(v: string) => {
                  setIdDistrict(v);
                  handleGetWard(v);
                  setIdWard(null);
                }}
                options={listDistrict}
                placeholder="Chọn Quận huyện thành phố"
              />
            </Item>
            <Item
              name="ward"
              rules={[
                {
                  required: true,
                  message: "Khong duoc bo trong",
                },
              ]}
            >
              <Select
                // style={inputStyle}
                value={idWard}
                disabled={!showWard}
                options={listWard}
                placeholder="Chọn Phường"
              />
            </Item>
            <Item
              name="address"
              rules={[
                {
                  required: true,
                  message: "Khong duoc bo trong",
                },
              ]}
            >
              <Input style={inputStyle} placeholder="Địa chỉ cụ thể"></Input>
            </Item>
          </div>
        </div>
        <div>
          <Item
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ background: "green", margin: "0px 10px" }}
            >
              Register
            </Button>
            <span>
              or{" "}
              <Link className={styles.link} to={"/login"}>
                have a account
              </Link>
            </span>
            <br />
            <div style={{ width: "100%", textAlign: "center" }}>
              <Link className={styles.link} to={"/"}>
                cancel
              </Link>
            </div>
          </Item>
        </div>
      </Form>
    </div>
  );
}
