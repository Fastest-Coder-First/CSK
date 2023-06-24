import React from "react";
import { useNavigate } from "react-router-dom";

import { Button, Result } from "antd";

export default function NoPage() {
  const navigate = useNavigate();
  return (
    //Create antd Result component with status 404 and button
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button onClick={() => navigate("/")} type="primary">
          Back Home
        </Button>
      }
    />
  );
}
