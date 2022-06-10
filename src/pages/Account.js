import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { AuthContext } from "../config/context";
import Header from "../components/Header";
import List from "../components/List";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <Helmet><title>Your Account / Twitter</title></Helmet>
      <Header title="Your Account" backArrow="full" />
      <div className="border-bottom">
        <List
          data={{
            title: "Username",
            subtitle: "@" + user.account_name,
            image: (
              <div className="text-primary py-2">
                <i className="bi bi-person-fill fs-2 mx-2"></i>
              </div>
            ),
          }}
          className="hover pointer"
          onClick={() => navigate("account_name")}
          actionButton={<i className="bi bi-chevron-right text-muted"></i>}
        ></List>
        <List
          data={{
            title: "Email",
            subtitle: user.email,
            image: (
              <div className="text-primary py-2">
                <i className="bi bi-envelope fs-2 mx-2"></i>
              </div>
            ),
          }}
          className="hover pointer"
          onClick={() => navigate("email")}
          actionButton={<i className="bi bi-chevron-right text-muted"></i>}
        ></List>
        <List
          data={{
            title: "Phone",
            subtitle: "+91 7096132190",
            image: (
              <div className="text-primary py-2">
                <i className="bi bi-phone fs-2 mx-2"></i>
              </div>
            ),
          }}
          className="hover pointer"
          onClick={() => navigate("phone")}
          actionButton={<i className="bi bi-chevron-right text-muted"></i>}
        ></List>
      </div>
      <div className="border-bottom">
        <List
          data={{
            title: "Country",
            subtitle: "India",
            image: (
              <div className="text-primary py-2">
                <i className="bi bi-globe fs-2 mx-2"></i>
              </div>
            ),
          }}
          className="hover pointer"
          onClick={() => navigate("country")}
          actionButton={<i className="bi bi-chevron-right text-muted"></i>}
        ></List>
        <List
          data={{
            title: "Gender",
            subtitle: "Male",
            image: (
              <div className="text-primary py-2">
                <i className="bi bi-gender-ambiguous fs-3 mx-2"></i>
              </div>
            ),
          }}
          className="hover pointer"
          onClick={() => navigate("gender")}
          actionButton={<i className="bi bi-chevron-right text-muted"></i>}
        ></List>
        <List
          data={{
            title: "Birth Date",
            subtitle: "May 3, 2002",
            image: (
              <div className="text-primary py-2">
                <i className="bi bi-gift fs-3 mx-2"></i>
              </div>
            ),
          }}
        ></List>
      </div>
      <List
        data={{
          title: "Age",
          subtitle: "19",
          image: (
            <div className="text-primary py-2">
              <i className="bi bi-123 fs-2 mx-2"></i>
            </div>
          ),
        }}
      ></List>
    </div>
  );
}
