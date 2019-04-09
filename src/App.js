import React, { Component } from "react";
import Recognizer from "./components/Recognizer";
import Speaker from "./components/Speaker";
import Speech from "speak-tts";
import { getSeconds } from "date-fns";
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
    text: "",
    lastOpenTime: null,
    currentInterval: null,
    showMyVoice: false,
    isPlayingMyVoice: false
  };

  setInterverId = null;
  duration = null;

  componentDidMount = () => {
    this.setInterverId = setInterval(() => {
      if (this.state.showMyVoice && this.state.lastOpenTime) {
        // this.duration = getSeconds(
        //   new Date(new Date() - this.state.lastOpenTime)
        // );
        this.duration = new Date() - this.state.lastOpenTime;
        this.setState({ isPlayingMyVoice: true });
        console.log("duration:", this.duration);
      }
      if (
        this.state.showMyVoice &&
        this.state.currentInterval &&
        this.state.currentInterval <= this.duration
      ) {
        this.setState({
          showMyVoice: false,
          lastOpenTime: null,
          isPlayingMyVoice: false
        });
      }
    }, 1000);
  };

  componentWillUnmount = () => {
    clearInterval(this.setInterverId);
  };

  toggleRecognizer = () => {
    this.setState({ isRecognizing: !this.state.isRecognizing });
  };

  setFianlText = text => {
    this.setState({ text: text });
  };

  handleShowMyVoice = () => {
    this.setState({
      showMyVoice: !this.state.showMyVoice,
      lastOpenTime: this.state.showMyVoice ? null : new Date()
    });
  };

  setCurrentInterval = interval => {
    this.setState({
      currentInterval: interval
    });
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
            handleShowMyVoice={this.handleShowMyVoice}
            showMyVoice={this.state.showMyVoice}
            setCurrentInterval={this.setCurrentInterval}
            isPlayingMyVoice={this.state.isPlayingMyVoice}
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
