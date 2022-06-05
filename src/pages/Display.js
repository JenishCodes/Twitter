import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { setCSSVariables } from "../utils";

export default function Display(props) {
  const [color, setColor] = useState();
  const [theme, setTheme] = useState();
  const [font, setFont] = useState();

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
      <Header title="Display" backArrow="full" />
      <div className="px-3 text-muted">
        <p>
          Manage your font size, color, and background. These settings affect
          all the Twitter accounts on this browser.
        </p>
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
      <div className="border-top p-3">
        <div className="fs-3 fw-bolder mb-3">Primary Color</div>
        <div className="d-flex justify-content-around">
          <label className="color rounded-circle btn blue">
            <input
              onChange={(e) => handleChange(theme, e.currentTarget.value, font)}
              name="color"
              className="d-none"
              value="blue"
              type="radio"
            />
            {color === "blue" ? (
              <i className="bi fs-1 text-white bi-check"></i>
            ) : null}
          </label>
          <label className="color rounded-circle btn green">
            <input
              onChange={(e) => handleChange(theme, e.currentTarget.value, font)}
              name="color"
              className="d-none"
              value="green"
              type="radio"
            />
            {color === "green" ? (
              <i className="bi fs-1 text-white bi-check"></i>
            ) : null}
          </label>
          <label className="color rounded-circle btn yellow">
            <input
              onChange={(e) => handleChange(theme, e.currentTarget.value, font)}
              name="color"
              className="d-none"
              value="yellow"
              type="radio"
            />
            {color === "yellow" ? (
              <i className="bi fs-1 text-white bi-check"></i>
            ) : null}
          </label>
          <label className="color rounded-circle btn purple">
            <input
              onChange={(e) => handleChange(theme, e.currentTarget.value, font)}
              name="color"
              className="d-none"
              value="purple"
              type="radio"
            />
            {color === "purple" ? (
              <i className="bi fs-1 text-white bi-check"></i>
            ) : null}
          </label>
          <label className="color rounded-circle btn pink">
            <input
              onChange={(e) => handleChange(theme, e.currentTarget.value, font)}
              name="color"
              className="d-none"
              value="pink"
              type="radio"
            />
            {color === "pink" ? (
              <i className="bi fs-1 text-white bi-check"></i>
            ) : null}
          </label>
          <label className="color rounded-circle btn orange">
            <input
              onChange={(e) => handleChange(theme, e.currentTarget.value, font)}
              name="color"
              className="d-none"
              value="orange"
              type="radio"
            />
            {color === "orange" ? (
              <i className="bi fs-1 text-white bi-check"></i>
            ) : null}
          </label>
        </div>
      </div>
      <div className="border-top p-3">
        <div className="fs-3 fw-bolder mb-3">Theme</div>
        <div className="d-flex fs-3">
          <label className="theme pointer light rounded">
            <input
              onChange={(e) => handleChange(e.currentTarget.value, color, font)}
              name="theme"
              type="radio"
              value="light"
              className="pointer"
              checked={theme === "light"}
            />
            <div>Light</div>
          </label>
          <label className="theme pointer dim rounded mx-3">
            <input
              onChange={(e) => handleChange(e.currentTarget.value, color, font)}
              name="theme"
              type="radio"
              value="dim"
              className="pointer"
              checked={theme === "dim"}
            />
            <div>Dim</div>
          </label>
          <label className="theme pointer dark rounded">
            <input
              onChange={(e) => handleChange(e.currentTarget.value, color, font)}
              name="theme"
              type="radio"
              className="pointer"
              value="dark"
              checked={theme === "dark"}
            />
            <div>Dark</div>
          </label>
        </div>
      </div>
    </div>
  );
}
