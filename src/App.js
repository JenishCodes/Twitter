import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Navigator from "./navigators/Navigator";
import { AuthProvider } from "./context";
import { setCSSVariables } from "./utils";
import "./App.css";

function App() {
  useEffect(() => {
    const color = window.localStorage.getItem("color");
    const font = window.localStorage.getItem("font");
    const theme = window.localStorage.getItem("theme");

    setCSSVariables(theme, color, font);
  }, []);

  return (
    <AuthProvider>
      <HelmetProvider>
        <BrowserRouter>
          <div className="App">
            <Navigator />
          </div>
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;
