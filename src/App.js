import React, { Component } from "react";
import Recognizer from "./components/Recognizer";
import "./App.css";

const SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Recognizer recognition={recognition} />
      </div>
    );
  }
}

export default App;
