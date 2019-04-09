import React, { Component } from "react";
import classNames from "classnames";
import getSource from "../../assets";
import "./Recognizer.css";

class Recognizer extends Component {
  constructor() {
    super();
    this.state = {
      listening: false
    };
    this.toggleListen = this.toggleListen.bind(this);
    this.handleListen = this.handleListen.bind(this);
  }

  componentWillMount = () => {
    this.recognition = this.props.recognition;
  };

  toggleListen() {
    this.setState(
      {
        listening: !this.state.listening
      },
      this.handleListen
    );
  }

  handleListen() {
    console.log("listening?", this.state.listening);

    if (this.state.listening) {
      this.recognition.start();
      this.recognition.onend = () => {
        console.log("...continue listening...");
        this.recognition.start();
      };
    } else {
      this.recognition.stop();
      this.recognition.onend = () => {
        console.log("Stopped listening per click");
      };
    }

    this.recognition.onstart = () => {
      console.log("Listening!");
    };

    let finalTranscript = "";
    this.recognition.onresult = event => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interimTranscript += transcript;
      }
      document.getElementById("interim").innerHTML = interimTranscript;
      document.getElementById("final").innerHTML = finalTranscript;

      //-------------------------COMMANDS------------------------------------

      const transcriptArr = finalTranscript.split(" ");
      const stopCmd = transcriptArr.slice(-3, -1);
      console.log("stopCmd", stopCmd);

      if (stopCmd[0] === "stop" && stopCmd[1] === "listening") {
        this.recognition.stop();
        this.recognition.onend = () => {
          console.log("Stopped listening per command");
          const finalText = transcriptArr.slice(0, -3).join(" ");
          document.getElementById("final").innerHTML = finalText;
        };
      }
    };

    //-----------------------------------------------------------------------

    this.recognition.onerror = event => {
      console.log("Error occurred in this.recognition: " + event.error);
    };
  }

  render() {
    const state = this.state.listening ? "listening_0" : "ear";
    return (
      <div className={classNames("container")}>
        <div calssName="img_box_container">
          <div className="img_box_wrapper">
            <img
              id="microphone-btn"
              className={classNames(
                `button${this.state.listening ? "--active" : ""}`
              )}
              src={getSource(state)}
              alt={state}
              onClick={this.toggleListen}
            />
          </div>
        </div>
        <div id="interim" className={classNames("interim")} />
        <div id="final" className={classNames("final")} />
      </div>
    );
  }
}

export default Recognizer;
