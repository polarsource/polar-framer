import { framer } from "framer-plugin";
import "./App.css";
import { Login } from "./components/Login";

framer.showUI({
  position: "top right",
  width: 240,
  height: 95,
});

export function App() {
  return (
    <main>
      <Login />
    </main>
  );
}
