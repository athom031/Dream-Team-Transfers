import React from "react";

export class SellButton extends React.Component {
    state = {
      isButtonActive: false,
    };
    timer = null;
    handleButtonPress = () => {
        console.log(this.props);

      this.setState({ isButtonActive: true });
      this.timer = setTimeout(() => {
        this.props.sellPlayerHelper(this.props.playerId);
        this.setState({ isButtonActive: false });
      }, 3000);
    }
    handleButtonRelease = () => {
      clearTimeout(this.timer);
      if (this.state.isButtonActive) {
        this.setState({ isButtonActive: false });
      }
    }
    render() {
      return (
        <button
          className={`squad-list-button ${this.state.isButtonActive ? 'active' : ''}`}
          onMouseDown={this.handleButtonPress}
          onMouseUp={this.handleButtonRelease}
          onTouchStart={this.handleButtonPress}
          onTouchEnd={this.handleButtonRelease}
        >
          Sell
        </button>
      );
    }
}
