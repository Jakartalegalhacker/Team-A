import React from 'react';
import PropTypes from 'prop-types';
const _styles =require('./_styles.scss');
// field what we need

const TextArea=(props)=>{
  let _change=(event)=>{
    props.changeInput(event.target.value,event.target.name);
  };
  let _html_input=<div className={_styles.block_disabled}><p>{props.placeholder} : {props.value}</p></div>;
  if(!props.disabled){
    _html_input=(<textarea name={props.name}
      type={props.type}
      className={"form-control"}
      placeholder={props.placeholder}
      value={props.value}
      onChange={_change}
    />);
  }
  return(
    <div className={"form-group "+_styles.block_input}>
      {props.useLabel?<p>{props.placeholder}</p>:null}
      {_html_input}
      {props.error_message&&<p className={_styles.error_message}>{props.error_message}</p>}
    </div>
  );
};
TextArea.propTypes={
  name:PropTypes.number,
  placeholder:PropTypes.string,
  value:PropTypes.string,
  type:PropTypes.string,
  error_message:PropTypes.oneOfType([PropTypes.string,PropTypes.bool]),
  changeInput:PropTypes.func,
  disabled:PropTypes.bool,
  useLabel:PropTypes.bool,

};

export default TextArea;
