import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SimpleLandingPage from "@/pages/SimpleLandingPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SimpleLandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
