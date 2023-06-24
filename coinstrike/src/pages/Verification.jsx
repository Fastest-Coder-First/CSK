import { useState, useEffect } from "react";

import { verify, wrongEmail } from "./../Redux/Actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Space, Card, Input, Button, message } from "antd";

export default function Verification() {
  const navigate = useNavigate();

  const [Otp, setOtp] = useState("");
  const [Loading, setLoading] = useState(false);

  //ERRORRR Manager
  const [messageApi, contextHolder] = message.useMessage();
  const success = (msg) => {
    messageApi.open({
      type: "success",
      content: msg,
    });
  };
  const popError = (msg) => {
    messageApi.open({
      type: "error",
      content: msg,
    });
  };

  //Submit Api Management
  const dispatch = useDispatch();
  const handleSubmit = () => {
    if (Otp.length > 3) {
      console.log(userEmail);
      setLoading(true);
      dispatch(verify(Otp, userEmail));
      return;
    }
    popError("Enter Otp!");
  };
  //Selector
  const { userEmail, id } = useSelector((state) => state.userRegister);
  const userLogin = useSelector((state) => state.userLogin);
  const { userToken, error, loading } = userLogin;
  useEffect(() => {
    console.log(userToken, loading);
    setLoading(false);
    if (userToken && Object.keys(userToken).length > 0) {
      success("Verified!");
      setTimeout(() => navigate("/user"), 2000);
    }
    if (error) popError(error);
  }, [error, userToken]);

  return (
    <section className="d-full">
      {contextHolder}
      <Space
        align="center"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Card
          title="Otp Verfication"
          style={{ width: 300, textAlign: "center" }}
        >
          <form className="login-form">
            <label htmlFor="name" style={{ marginBottom: "3px" }}>
              Otp
            </label>
            <Input
              id="name"
              placeholder="otp"
              value={Otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{ backgroundColor: "rgb(20 67 140)" }}
              loading={Loading}
            >
              Verify
            </Button>
          </form>
          <p
            onClick={() => {
              if (id) dispatch(wrongEmail(id));
              console.log(id, userEmail)
              navigate("/signup");
            }}
            style={{
              cursor: "pointer",
              color: "grey",
              marginTop: "5px",
              fontSize: "11px",
            }}
          >
            Wrong Email?
          </p>
        </Card>
      </Space>
    </section>
  );
}
