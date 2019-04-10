import React, { Component } from "react";
import classNames from "classnames";
import getSource from "../../assets";
import "./Translater.css";

class Translater extends Component {
  state = {
    isOpenTranslate: true
  };

  toggleTranslate = e => {
    this.setState({ isOpenTranslate: !this.state.isOpenTranslate });
    e.stopPropagation();
  };

  render() {
    const { source } = this.props;
    return (
      <div
        className={classNames(
          `translate_wrapper${this.state.isOpenTranslate ? "--active" : ""}`
        )}
        // onClick={e => {
        //   this.toggleTranslate(e);
        // }}
      >
        <div id="translate" className={classNames("translate")}>
          {this.state.isOpenTranslate ? source : <text>Translate</text>}
        </div>
      </div>
    );
  }
}

export default Translater;
