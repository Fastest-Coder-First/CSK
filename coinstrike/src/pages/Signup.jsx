import { useState, useEffect } from "react";

import { register } from "./../Redux/Actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Space, Card, Input, Button, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

export default function Signup() {
  const navigate = useNavigate();

  //Create State for [Email, Password] and set default value of ""
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  //and PasswordConfirm with default value of ""
  const [PasswordConfirm, setPasswordConfirm] = useState("");
  const [Loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

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
    //if email is valid then check for password, use validateEmail function
    if (validateEmail(Email)) {
      //if password is less than 8 characters then show error
      if (Password.length > 7) {
        //if password and confirm password matches then dispatch register action
        if (Password === PasswordConfirm) {
          //dispatch register action with Email and Password
          setLoading(true);
          dispatch(register(Email, Password));
          // success("All Good!");
          return;
        }
        popError("Password doesn't mastch Confirm Password!");
        return;
      }
      popError("Password Should have minimum 8 characters!");
      return;
    }
    popError("Please provide valid Email!");
  };

  //Selector
  //get userToken, error, loading from useSelector from userLogin
  const userRegister = useSelector((state) => state.userRegister);
  const { userEmail, isRegister, error, loading } = userRegister;
  useEffect(() => {
    //if userToken is true then navigate to home
    if (userEmail) {
      setLoading(false);
      success("Registered Successfully! Now Verify");
      //set a timeout of 2 seconds
      setTimeout(() => navigate("/verify"), 2000);
    }
    if (error) return popError(error);
  }, [error, userEmail]);

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
        <Card title="Signup" style={{ width: 300, textAlign: "center" }}>
          <form className="login-form">
            <label htmlFor="name">Email</label>
            <Input
              id="name"
              placeholder="Email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="name">Password</label>
            <Input.Password
              placeholder="Password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <p style={{ fontSize: "10px", marginTop: "-10px", color: "grey" }}>
              Note: Min 8 letters
            </p>
            <label htmlFor="name">Confirm Password</label>
            <Input.Password
              placeholder="Confirm Password"
              value={PasswordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <Button
              style={{ backgroundColor: "rgb(20 67 140)" }}
              type="primary"
              onClick={handleSubmit}
              loading={Loading}
            >
              Signup
            </Button>
          </form>
          <p style={{ color: "grey", marginTop: "5px", fontSize: "12px" }}>
            Registered Already?{" "}
            <Button
              size="small"
              type="dashed"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </p>
        </Card>
      </Space>
    </section>
  );
}
