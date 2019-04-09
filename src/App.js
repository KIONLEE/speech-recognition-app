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
      <div>
        <div className="App_title">
          <text>Welcome to Choi's Speaking Assistance</text>
        </div>
        <div className="App">
          <Recognizer recognition={recognition} />
        </div>
      </div>
    );
  }
}

export default App;
