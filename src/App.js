import React, { Component } from "react";
import Recognizer from "./components/Recognizer";
import Speaker from "./components/Speaker";
import Speech from "speak-tts";
import "./App.css";

const SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

const speech = new Speech();
// speech.setLanguage("en-US");
// speech.setVoice("Fiona");

class App extends Component {
  state = {
    isRecognizing: false,
    text: ""
  };

  toggleRecognizer = () => {
    this.setState({ isRecognizing: !this.state.isRecognizing });
  };

  setFianlText = text => {
    this.setState({ text: text });
  };

  render() {
    console.log("App.state:", this.state);
    return (
      <div>
        <div className="App_title">
          <text>Welcome to Choi's Speaking Assistant</text>
        </div>
        <div className="App_sub_title">
          <text>by Keon Lee</text>
        </div>
        <div className="App">
          <Recognizer
            recognition={recognition}
            toggleRecognizer={this.toggleRecognizer}
            setFianlText={this.setFianlText}
          />
          <Speaker
            speech={speech}
            isRecognizing={this.state.isRecognizing}
            fianlText={this.state.text}
          />
        </div>
      </div>
    );
  }
}

export default App;
