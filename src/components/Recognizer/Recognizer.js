import React, { Component } from "react";
import classNames from "classnames";
import getSource from "../../assets";
import "./Recognizer.css";

class Recognizer extends Component {
  constructor() {
    super();
    this.state = {
      listening: false,
      text: "",
      isEditting: false,
      value: ""
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
        listening: !this.state.listening,
        isEditting: false
      },
      this.handleListen
    );
    this.props.toggleRecognizer();
  }

  handleListen() {
    console.log("listening?", this.state.listening);
    if (this.state.listening) {
      this.recognition.start();
      this.recognition.onend = () => {
        console.log(
          "...continue listening...",
          this.state.text.trim().slice(-1)
        );
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
        if (event.results[i].isFinal) finalTranscript += transcript + ". ";
        else interimTranscript += transcript;
      }
      document.getElementById("interim").innerHTML = interimTranscript;
      // document.getElementById("final").innerHTML = finalTranscript;
      // this.props.setFianlText(finalTranscript);
      this.setState({ text: finalTranscript }, () => {
        document.getElementById("final").innerHTML = this.state.text;
        this.props.setFianlText(this.state.text);
      });

      //-------------------------COMMANDS------------------------------------

      const transcriptArr = finalTranscript.split(" ");
      const stopCmd = transcriptArr.slice(-3, -1);
      console.log("stopCmd", stopCmd);

      if (stopCmd[0] === "stop" && stopCmd[1] === "listening") {
        this.recognition.stop();
        this.recognition.onend = () => {
          console.log("Stopped listening per command");
          const finalText = transcriptArr.slice(0, -3).join(" ");
          // document.getElementById("final").innerHTML = finalText;
          // this.props.setFianlText(finalText);

          this.setState({ text: finalText }, () => {
            document.getElementById("final").innerHTML = this.state.text;
            this.props.setFianlText(this.state.text);
          });
        };
      }
    };

    //-----------------------------------------------------------------------

    this.recognition.onerror = event => {
      console.log("Error occurred in this.recognition: " + event.error);
    };
  }

  handleChange = event => {
    this.setState({ text: event.target.value });
  };

  handleSubmit = event => {
    // alert("A name was submitted: " + this.state.text);
    this.setState({ isEditting: false }, () => {
      document.getElementById("final").innerHTML = this.state.text;
      this.props.setFianlText(this.state.text);
    });
    event.preventDefault();
  };

  render() {
    const state = this.state.listening ? "listening_0" : "ear";
    return (
      <div className={classNames("container")}>
        <div className="img_box_container">
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
        <div id="interim" className={classNames("interim")} />
        {this.state.isEditting ? (
          <form
            className={classNames("form")}
            id="final_edit"
            onSubmit={this.handleSubmit}
          >
            <textarea
              className={classNames("textarea")}
              value={this.state.text}
              onChange={this.handleChange}
              ref={c => (this.textarea = c)}
            />
            <div
              className={classNames("button_box")}
              onClick={this.handleSubmit}
            >
              <div className={classNames("button")}>Submit</div>
            </div>
          </form>
        ) : (
          <div
            id="final"
            className={classNames("final")}
            onClick={() => {
              this.setState({ isEditting: true });
            }}
          />
        )}
      </div>
    );
  }
}

export default Recognizer;
