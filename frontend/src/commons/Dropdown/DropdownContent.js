import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const _styles = require("./_dropdown.scss");

class DropdownContent extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { children, className, classPosition } = this.props;
    const classes = classnames(
      _styles.dropdown_content,
      classPosition,
      className
    );
    return (
      <div className={classes} style={this.props.styles}>
        {children}
      </div>
    );
  }
}

DropdownContent.propTypes = {
  children: PropTypes.array,
  className: PropTypes.string,
  styles: PropTypes.object,
  classPosition: PropTypes.string.isRequired
};

DropdownContent.defaultProps = {
  className: "",
  classPosition: "overlay"
};

export default DropdownContent;
