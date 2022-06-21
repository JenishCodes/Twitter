import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import { setCSSVariables } from "../utils";

export default function Display() {
  const [color, setColor] = useState();
  const [theme, setTheme] = useState();
  const [font, setFont] = useState(0);

  useEffect(() => {
    setColor(window.localStorage.getItem("color"));
    setFont(window.localStorage.getItem("font"));
    setTheme(window.localStorage.getItem("theme"));
  }, []);

  const handleChange = (new_theme, new_color, new_font) => {
    setColor(new_color);
    setFont(new_font);
    setTheme(new_theme);
    setCSSVariables(new_theme, new_color, new_font);
  };

  return (
    <div className="display">
      <Helmet>
        <title>Display / Twitter</title>
      </Helmet>
      <Header title="Display" backArrow="full" />
      <div className="px-3 text-muted">
        <p>
          Manage your font size, color, and background. These settings affect
          all the Twitter accounts on this browser.
        </p>
        <div className="tweet text-primary border-0 my-3 w-100 text-start">
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-column align-items-center">
              <div className="profile-image blue px-2 py-1 rounded-circle">
                <i className="bi bi-twitter px-1 text-white"></i>
                <img className="w-100 h-auto rounded-circle" src="" alt="" />
              </div>
            </div>
            <div className="details">
              <div className="info d-flex align-items-center position-relative">
                <div className="d-flex flex-grow-1 flex-wrap">
                  <div className="name me-1 fw-bold">Twitter</div>
                  <div className="d-flex">
                    <div className="username text-muted me-1">@Twitter</div>
                    <div className="text-muted"> · 10m</div>
                  </div>
                </div>
              </div>
              <div className="tweet-text">
                At the heart of Twitter are short messages called Tweets - just
                like this one - which can include photos, links, text, hashtags,
                and mentions like <span className="text-app">@Twitter</span>.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-top p-3">
        <div className="fs-3 fw-bolder mb-3">Font Size</div>
        <div className="d-flex align-items-center">
          <div className="fs-7">Aa</div>
          <input
            type="range"
            className="form-range mx-4"
            min="0"
            max="4"
            step="1"
            value={font}
            onChange={(e) => handleChange(theme, color, e.currentTarget.value)}
          />
          <div className="fs-3">Aa</div>
        </div>
      </div>
      <div className="border-top">
        <div className="fs-3 fw-bolder p-3">Primary Color</div>
        <div className="d-flex flex-column flex-sm-row">
          <div className="d-flex col-12 col-sm-6">
            <div className="col-4">
              <label className="color d-flex align-items-center justify-content-center my-3 mx-auto rounded-circle btn filter blue">
                <input
                  onChange={(e) =>
                    handleChange(theme, e.currentTarget.value, font)
                  }
                  name="color"
                  className="d-none"
                  value="blue"
                  type="radio"
                />
                {color === "blue" && (
                  <i className="bi fs-1 text-white bi-check"></i>
                )}
              </label>
            </div>
            <div className="col-4">
              <label className="color d-flex align-items-center justify-content-center my-3 mx-auto rounded-circle btn filter green">
                <input
                  onChange={(e) =>
                    handleChange(theme, e.currentTarget.value, font)
                  }
                  name="color"
                  className="d-none"
                  value="green"
                  type="radio"
                />
                {color === "green" && (
                  <i className="bi fs-1 text-white bi-check"></i>
                )}
              </label>
            </div>
            <div className="col-4">
              <label className="color d-flex align-items-center justify-content-center my-3 mx-auto rounded-circle btn filter yellow">
                <input
                  onChange={(e) =>
                    handleChange(theme, e.currentTarget.value, font)
                  }
                  name="color"
                  className="d-none"
                  value="yellow"
                  type="radio"
                />
                {color === "yellow" && (
                  <i className="bi fs-1 text-white bi-check"></i>
                )}
              </label>
            </div>
          </div>
          <div className="d-flex col-12 col-sm-6">
            <div className="col-4">
              <label className="color d-flex align-items-center justify-content-center my-3 mx-auto rounded-circle btn filter purple">
                <input
                  onChange={(e) =>
                    handleChange(theme, e.currentTarget.value, font)
                  }
                  name="color"
                  className="d-none"
                  value="purple"
                  type="radio"
                />
                {color === "purple" && (
                  <i className="bi fs-1 text-white bi-check"></i>
                )}
              </label>
            </div>
            <div className="col-4">
              <label className="color d-flex align-items-center justify-content-center my-3 mx-auto rounded-circle btn filter pink">
                <input
                  onChange={(e) =>
                    handleChange(theme, e.currentTarget.value, font)
                  }
                  name="color"
                  className="d-none"
                  value="pink"
                  type="radio"
                />
                {color === "pink" && (
                  <i className="bi fs-1 text-white bi-check"></i>
                )}
              </label>
            </div>
            <div className="col-4">
              <label className="color d-flex align-items-center justify-content-center my-3 mx-auto rounded-circle btn filter orange">
                <input
                  onChange={(e) =>
                    handleChange(theme, e.currentTarget.value, font)
                  }
                  name="color"
                  className="d-none"
                  value="orange"
                  type="radio"
                />
                {color === "orange" && (
                  <i className="bi fs-1 text-white bi-check"></i>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="border-top">
        <div className="fs-3 fw-bolder p-3">Theme</div>
        <div className="d-flex flex-column flex-sm-row">
          <div className="col-sm-4 px-3 py-2 col-12">
            <label className="theme d-flex align-items-center p-3 flex-grow-1  pointer light rounded">
              <input
                onChange={(e) =>
                  handleChange(e.currentTarget.value, color, font)
                }
                name="theme"
                type="radio"
                value="light"
                className="pointer me-3"
                checked={theme === "light"}
              />
              <div className="fs-4">Light</div>
            </label>
          </div>
          <div className="col-sm-4 px-3 py-2 col-12">
            <label className="theme d-flex align-items-center p-3 flex-grow-1  pointer dim rounded">
              <input
                onChange={(e) =>
                  handleChange(e.currentTarget.value, color, font)
                }
                name="theme"
                type="radio"
                value="dim"
                className="pointer me-3"
                checked={theme === "dim"}
              />
              <div className="fs-4">Dim</div>
            </label>
          </div>
          <div className="col-sm-4 px-3 py-2 col-12">
            <label className="theme d-flex align-items-center p-3 flex-grow-1  pointer dark rounded">
              <input
                onChange={(e) =>
                  handleChange(e.currentTarget.value, color, font)
                }
                name="theme"
                type="radio"
                className="pointer me-3"
                value="dark"
                checked={theme === "dark"}
              />
              <div className="fs-4">Dark</div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
