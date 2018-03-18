import React, {Component} from 'react';
import PropTypes from 'prop-types';

const _styles = require('./_dropdown.scss');
// children inside DropdownHandler
// className if you want to change styles handler
// onClick if you want to add function usually onclick passed from dropdown.js
// icon if you want to add icon format must be classname string
// if you don't want to use custom icon with default method just make click_custom
// if you don't want to use icon just don't send props icon when call dropdownhandler in parent component when called
// active from dropdown.js
const DropdownHandler=(props)=>{
  const {children, className, onClick,icon,active} = props;
  let status_text="";
  let html_icon="";
  // false mean down
  if(active===false){
    status_text="-down";
  }
  else{
    status_text="-up";
  }
  if(icon!==undefined){
    html_icon=<i className={icon+status_text}/>;
  }

  return (
      <div className={_styles.dropdown_handler+" "+className} onClick={onClick}>
        {children} {html_icon}
      </div>

  );
};

DropdownHandler.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
    icon:PropTypes.string,
    active:PropTypes.bool,
};

DropdownHandler.defaultProps = {
    className: ''
};

export default DropdownHandler;
