import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../config/context";
import Header from "../components/Header";
import List from "../components/List";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <Helmet>
        <title>Your Account / Twitter</title>
      </Helmet>
      <Header title="Your Account" backArrow="full" />
      <div className="border-bottom">
        <List
          data={{
            title: "Username",
            subtitle: "@" + user.account_name,
            image: (
              <div className="py-2">
                <i className="bi bi-person-fill fs-2 mx-2"></i>
              </div>
            ),
          }}
          className="hover pointer"
          onClick={() =>
            navigate("account_name", {
              state: { account_name: user.account_name },
            })
          }
          actionButton={<i className="bi bi-chevron-right text-muted"></i>}
        ></List>
        <List
          data={{
            title: "Email",
            subtitle: user.email,
            image: (
              <div className="py-2">
                <i className="bi bi-envelope fs-2 mx-2"></i>
              </div>
            ),
          }}
          className="hover pointer"
          onClick={() => navigate("email", { state: { email: user.email } })}
          actionButton={<i className="bi bi-chevron-right text-muted"></i>}
        ></List>
        <List
          data={{
            title: "Update Password",
            image: (
              <div className="py-2">
                <i className="bi bi-key fs-2 mx-2"></i>
              </div>
            ),
          }}
          className="hover pointer"
          onClick={() => navigate("password")}
          actionButton={<i className="bi bi-chevron-right text-muted"></i>}
        ></List>
      </div>
      <div className="border-bottom">
        <List
          data={{
            title: "Country",
            subtitle: "India",
            image: (
              <div className="py-2">
                <i className="bi bi-globe fs-2 mx-2"></i>
              </div>
            ),
          }}
          className="hover pointer"
          onClick={() =>
            navigate("country", { state: { country: user.country } })
          }
          actionButton={<i className="bi bi-chevron-right text-muted"></i>}
        ></List>
        <List
          data={{
            title: "Gender",
            subtitle: "Male",
            image: (
              <div className="py-2">
                <i className="bi bi-gender-ambiguous fs-3 mx-2"></i>
              </div>
            ),
          }}
          className="hover pointer"
          onClick={() => navigate("gender", { state: { gender: user.gender } })}
          actionButton={<i className="bi bi-chevron-right text-muted"></i>}
        ></List>
        <List
          data={{
            title: "Birth Date",
            subtitle: "May 3, 2002",
            image: (
              <div className="py-2">
                <i className="bi bi-gift fs-3 mx-2"></i>
              </div>
            ),
          }}
        ></List>
      </div>
      <List
        className="hover pointer text-danger"
        data={{
          title: "Delete account permanently",
          image: (
            <div className="text-danger py-2">
              <i className="bi bi-trash fs-2 mx-2"></i>
            </div>
          ),
        }}
        onClick={() => console.log("Delete account")}
      ></List>
    </div>
  );
}
