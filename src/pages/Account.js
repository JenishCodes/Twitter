import React, { useContext } from "react";
import { AuthContext } from "../config/context";
import Header from "../components/Header";
import List from "../components/List";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <Header title="Your Account" backArrow />
      <div className="border-bottom">
        <List
          data={{
            title: "Username",
            subtitle: "@" + user.account_name,
          }}
          className="hover"
          onClick={() => navigate("account_name")}
          actionButton={<i className="fa fa-chevron-right text-muted"></i>}
        ></List>
        <List
          data={{
            title: "Email",
            subtitle: user.email,
          }}
          className="hover"
          onClick={() => navigate("email")}
          actionButton={<i className="fa fa-chevron-right text-muted"></i>}
        ></List>
        <List
          data={{
            title: "Phone",
            subtitle: "+91 7096132190",
          }}
          className="hover"
          onClick={() => navigate("phone")}
          actionButton={<i className="fa fa-chevron-right text-muted"></i>}
        ></List>
      </div>
      <div className="border-bottom">
        <List
          data={{
            title: "Country",
            subtitle: "India",
          }}
          className="hover"
          onClick={() => navigate("country")}
          actionButton={<i className="fa fa-chevron-right text-muted"></i>}
        ></List>
        <List
          data={{
            title: "Gender",
            subtitle: "Male",
          }}
          className="hover"
          onClick={() => navigate("gender")}
          actionButton={<i className="fa fa-chevron-right text-muted"></i>}
        ></List>
        <List
          data={{
            title: "Birth Date",
            subtitle: "May 3, 2002",
          }}
        ></List>
      </div>
      <List
        data={{
          title: "Age",
          subtitle: "19",
        }}
      ></List>
    </div>
  );
}
