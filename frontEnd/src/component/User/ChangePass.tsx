import { Button, Form, Input } from "antd";
import React, { useState } from "react";

const labelStyle: React.CSSProperties = {
  width: "150px",
};

function ChangePass() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const submit = async () => {
    const data = new FormData();
    data.append("old_password", oldPass);
    data.append("password", newPass);
    data.append("password_confirmation", confirmPass);
  };
  return (
    <div>
      <Form name="changePass">
        <Form.Item
          colon={false}
          label={<span style={labelStyle}>old Password</span>}
        >
          <Input
            type="password"
            value={oldPass}
            onChange={(e) => setOldPass(e.currentTarget.value)}
          ></Input>
        </Form.Item>
        <Form.Item
          colon={false}
          label={<span style={labelStyle}>new Password</span>}
        >
          <Input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.currentTarget.value)}
          ></Input>
        </Form.Item>
        <Form.Item
          colon={false}
          label={<span style={labelStyle}>confirm Password</span>}
        >
          <Input
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.currentTarget.value)}
          ></Input>
        </Form.Item>
        <Button onClick={submit}>OK</Button>
        <Button>Cancel</Button>
      </Form>
    </div>
  );
}

export default ChangePass;
