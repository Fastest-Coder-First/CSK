import { useState, useEffect } from "react";

import { login } from "./../Redux/Actions/userActions";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { Space, Card, Input, Button, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

export default function Login() {
  const navigate = useNavigate();

  //Create State for [Email, Password] and set default value of ""
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
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
        setLoading(true);
        dispatch(login(Email, Password));
        // success("All Good!");
        return;
      }
      popError("Password Should have minimum 8 characters!");
      return;
    }
    popError("Please provide valid Email!");
  };

  //Selector
  //get userToken, error, loading from useSelector from userLogin
  const userLogin = useSelector((state) => state.userLogin);
  const { userToken, error } = userLogin;

  useEffect(() => {
    console.log(userToken);
    // if userToken is present then show success message and navigate to home page
    if (userToken) {
      success("Logged In Successfully!");
      setLoading(false);
      setTimeout(() => navigate("/"), 2000);
    }
    if (error) {
      setLoading(false);
      return popError(error);
    }
  }, [error, userToken]);

  return (
    <>
      {contextHolder}
      {/* //should be full screen and center */}
      <section className="d-full">
        <Space
          align="center"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Card title="Login" style={{ width: 300, textAlign: "center" }}>
            <form className="login-form">
              <label htmlFor="name">Email</label>
              <Input
                id="name"
                placeholder="User email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="name">Password</label>
              <Input.Password
                placeholder="password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
              <Button
                type="primary"
                onClick={handleSubmit}
                style={{ backgroundColor: "rgb(20 67 140)" }}
                loading={Loading}
              >
                Login
              </Button>
            </form>
            <p style={{ color: "grey", marginTop: "5px", fontSize: "12px" }}>
              Not Registered?{" "}
              <Button
                size="small"
                type="dashed"
                onClick={() => navigate("/signup")}
              >
                Signup
              </Button>
            </p>
          </Card>
        </Space>
      </section>
    </>
  );
}
