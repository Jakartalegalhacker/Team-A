import React from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";
import classNames from "classnames";
// import request from 'superagent';
import randomstring from "randomstring";
const _styles = require("./_combobox.scss");
class Combobox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
      optionValue: props.optionValue,
      optionLabel: props.optionLabel,
      defaultLink: props.defaultLink,
      options: [],
      show: false,
      name: randomstring.generate(5)
    };
  }
  componentWillMount() {
    if (typeof this.props.options !== "string") {
      this.setState({ options: this.props.options });
    }
  }
  componentDidMount() {
    if (typeof this.props.options === "string") {
      // request.get(this.props.options).end(function (err, res) {
      //   let result = res.body;
      //   let tempArray = [];
      //   for (let i = 0; i < result.length; i++) {
      //     let tempResult = result[i];
      //     let temp = { text: tempResult.name, value: tempResult._id };
      //     tempArray.push(temp);
      //   }
      //   $$.setState({ options: tempArray });
      // });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.options) {
      this.setState({ options: nextProps.options });
    }
  }
  _hide = () => {
    this.setState({ show: false });
    window.removeEventListener("click", this._onWindowClick);
  };
  _onWindowClick = event => {
    const _element = findDOMNode(this);

    if (
      event.target !== _element &&
      !_element.contains(event.target) &&
      this.state.show
    ) {
      this._hide();
    }
  };
  _onToggle = event => {
    this.setState({ show: !this.state.show });
    if (!this.state.show) {
      window.addEventListener("click", this._onWindowClick);
    } else {
      window.removeEventListener("click", this._onWindowClick);
    }
  };
  _onChange = value => {
    return event => {
      this.props.onChange(value, this.props.name);
      this._hide();
    };
  };
  _onRenderListData = () => {
    let defaultValue = null;
    let _list_data = null;
    switch (this.state.type) {
      case "link": {
        defaultValue = this.props.query.sort
          ? this.props.query.sort
          : this.props.defaultValue;
        _list_data = this.state.options.map((value, index) => {
          return (
            <div key={"combobox_" + this.state.name + "_" + index}>
              <p>{value}</p>
            </div>
          );
        }, this);
        break;
      }
      case "object-select": {
        // defaultValue=this.props.query.sort? this.props.query.sort:this.props.defaultValue;
        defaultValue = this.props.value
          ? this.props.value[this.state.optionLabel]
          : this.props.defaultValue;
        _list_data = this.state.options.map((value, index) => {
          return (
            <div
              key={"combobox_" + this.state.name + "_" + index}
              onClick={this._onChange(value)}
            >
              <p>{value[this.state.optionLabel]}</p>
            </div>
          );
        }, this);
        break;
      }
      case "object-select-custom": {
        // defaultValue=this.props.query.sort? this.props.query.sort:this.props.defaultValue;
        defaultValue = this.props.defaultValue;
        let $$ = this;
        if (this.props.value) {
          let _temp = this.state.options.find(elm => {
            return elm[$$.state.optionValue] === this.props.value;
          });
          defaultValue = _temp[$$.state.optionLabel];
        }
        _list_data = this.state.options.map((value, index) => {
          return (
            <div
              key={"combobox_" + this.state.name + "_" + index}
              onClick={this._onChange(value[this.state.optionValue])}
            >
              <p>{value[this.state.optionLabel]}</p>
            </div>
          );
        }, this);
        break;
      }
      case "form": {
        let $$ = this;
        defaultValue = this.props.defaultValue;
        if (this.props.value !== "") {
          let tempObject = this.state.options.find(element => {
            return element.value === $$.props.value;
          });
          defaultValue = tempObject.text;
        }
        _list_data = this.state.options.map((object, index) => {
          return (
            <div
              className="option-row"
              key={"combobox_" + this.state.name + "_" + index}
              onClick={this._onChange(object.value)}
            >
              <p>{object.text}</p>
            </div>
          );
        }, this);
        break;
      }
      default: {
        defaultValue =
          this.props.value !== "" ? this.props.value : this.props.defaultValue;
        _list_data = this.state.options.map((value, index) => {
          return (
            <div
              key={"combobox_" + this.state.name + "_" + index}
              onClick={this._onChange(value)}
            >
              <p>{value}</p>
            </div>
          );
        }, this);
      }
    }
    return { default_value: defaultValue, list_data: _list_data };
  };
  render() {
    let _container = classNames(
      "combobox",
      _styles.container,
      this.props.classContainer,
      { active: this.state.show }
    );
    let { default_value, list_data } = this._onRenderListData();
    return (
      <div className={_container}>
        <span
          className={_styles.toggle_button + " toggle-button"}
          onClick={this._onToggle}
        >
          <p>{default_value}</p>}
          <i className="material-icons">
            {this.state.show ? "keyboard_arrow_up" : "keyboard_arrow_down"}
          </i>
        </span>
        <div className={_styles.content + " content-container"}>
          {list_data}
        </div>
        {this.props.error_message && (
          <p className={_styles.error_message}>{this.props.error_message}</p>
        )}
      </div>
    );
  }
}
Combobox.propTypes = {
  type: PropTypes.string,
  defaultLink: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  query: PropTypes.object,
  defaultValue: PropTypes.string,
  classContainer: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number
  ]),
  onChange: PropTypes.func,
  optionValue: PropTypes.string,
  optionLabel: PropTypes.string,
  error_message: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
export default Combobox;
