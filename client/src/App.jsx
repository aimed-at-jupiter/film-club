import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:4100/")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error("Error fetching from API:", err));
  }, []);

  return (
    <div>
      <h1>Film Club</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
