import React, { Component } from "react";
import classNames from "classnames";
import getSource from "../../assets";
import "./Speaker.css";

class Speaker extends Component {
  state = {
    isSpeaking: false
  };
  componentWillMount = () => {
    this.speech = this.props.speech;
  };

  handleSpeak = () => {
    this.speech
      .init({
        volume: 0.5,
        lang: "en-GB",
        rate: 1,
        pitch: 1,
        voice: "Google UK English Female",
        splitSentences: false
      })
      .then(data => {
        console.log("Speech is ready", data);
        this.speech
          .speak({
            text: this.props.fianlText,
            queue: false, // current speech will be interrupted,
            listeners: {
              onstart: () => {
                console.log("Start utterance");
                // this.setState({ isSpeaking: true }, () => {
                //   console.log("Start utterance");
                // });
              },
              onend: () => {
                console.log("End utterance");
                // this.setState({ isSpeaking: false }, () => {
                //   console.log("End utterance");
                // });
              }
            }
          })
          .then(() => {
            console.log("Success !");
          })
          .catch(e => {
            console.error("An error occurred :", e);
          });
      })
      .catch(e => {
        console.error("An error occured while initializing : ", e);
      });
  };

  render() {
    const isAvailable = !this.props.isRecognizing;
    return (
      <div>
        <div className="img_box_container">
          <img
            id="speaker-btn"
            className={classNames(
              `button_speaker${!isAvailable ? "--disabled" : ""}`
            )}
            src={getSource("speaker")}
            alt="speaker"
            onClick={!isAvailable ? null : this.handleSpeak}
          />
        </div>
      </div>
    );
  }
}

export default Speaker;
