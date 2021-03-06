import React, { Component } from "react";
import classNames from "classnames";
import getSource from "../../assets";
import Iframe from "react-iframe";
import Translater from "../Translater";
import { ReactMic } from "react-mic";
import "./Recognizer.css";

//text가 바뀌는 부분: 총 3군데(interim, final, handleChange)

class Recognizer extends Component {
  constructor() {
    super();
    this.state = {
      listening: false,
      text: "",
      translatedText: "",
      isEditting: false,
      recordedBlobURL: null,
      showMyVoice: false
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
        isEditting: false,
        startTime: !this.state.listening ? new Date() : null,
        lastInterval: this.state.listening
          ? new Date() - this.state.startTime
          : null
      },
      () => {
        this.handleListen();
        if (this.state.lastInterval) {
          this.props.setCurrentInterval(this.state.lastInterval);
        }
      }
    );
    this.props.toggleRecognizer();
  }

  handleListen() {
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
        this.translate(this.state.text);
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
            this.translate(this.state.text);
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
    this.setState({ text: event.target.value }, () => {
      this.translate(this.state.text);
    });
  };

  handleSubmit = event => {
    // alert("A name was submitted: " + this.state.text);
    this.setState({ isEditting: false }, () => {
      document.getElementById("final").innerHTML = this.state.text;
      this.props.setFianlText(this.state.text);
    });
    event.preventDefault();
  };

  onData = recordedBlob => {
    console.log("chunk of real-time data is: ", recordedBlob);
  };

  onStop = recordedBlob => {
    this.setState({ recordedBlobURL: recordedBlob.blobURL });
    console.log("recordedBlob is: ", recordedBlob);
    // console.log("recordedBlob.url is: ", recordedBlob.blobURL);
    // console.log(
    //   "recordedBlob.interval is: ",
    //   new Date(recordedBlob.stopTime) - new Date(recordedBlob.startTime)
    // );
    // this.props.setCurrentInterval(
    //   new Date(recordedBlob.stopTime) - new Date(recordedBlob.startTime)
    // );
  };

  translateCallback = (err, translation) => {
    // console.log(translation.translatedText);
    this.setState({ translatedText: translation.translatedText });
    //   return translation.translatedText;
  };

  translate = source => {
    const { googleTranslate } = this.props;
    googleTranslate.translate(source, "ko", (err, translation) => {
      this.translateCallback(err, translation);
    });
  };

  render() {
    const state = this.state.listening ? "listening_0" : "ear";
    const isMyVoiceAvailable =
      !this.state.listening && this.state.recordedBlobURL;
    const { isPlayingMyVoice, googleTranslate } = this.props;
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
          <ReactMic
            record={this.state.listening}
            className="sound-wave"
            onStop={this.onStop}
            width="0px"
            height="0px"
          />
        </div>
        {this.props.showMyVoice ? (
          <Iframe url={this.state.recordedBlobURL} width="0px" height="0px" />
        ) : null}
        <div
          className={classNames(
            isMyVoiceAvailable ? "interim_wrapper--my_voice" : "interim_wrapper"
          )}
          onClick={() => {
            this.props.handleShowMyVoice();
          }}
        >
          <div id="interim" className={classNames("interim")}>
            {isMyVoiceAvailable ? (
              isPlayingMyVoice ? (
                <img src={getSource("playing_1")} alt="playing" width="50px" />
              ) : (
                <text>Play My Voice</text>
              )
            ) : null}
          </div>
        </div>
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
              autoFocus
              ref={c => (this.textarea = c)}
            />
            <div
              className={classNames("button_box")}
              onClick={this.handleSubmit}
            >
              <div className={classNames("button_submit")}>Submit</div>
            </div>
          </form>
        ) : (
          <div
            className={classNames("final_wrapper")}
            onClick={() => {
              this.setState({ isEditting: true });
            }}
          >
            <div id="final" className={classNames("final")} />
            {this.state.text ? (
              <Translater
                googleTranslate={googleTranslate}
                source={this.state.translatedText}
              />
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

export default Recognizer;
