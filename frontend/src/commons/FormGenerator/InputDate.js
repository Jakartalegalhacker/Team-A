import React from 'react';
import PropTypes from "prop-types";
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
const _styles = require("./_styles.scss");

let _start_date=null;
const InputDate = props => {
  let handleChange = (date) => {
    console.log("handleChange",date);
    _start_date=date;
    props.changeInput(moment(date).format('DD/MM/YYYY'), props.name);
  };
  console.log(_start_date,"start_date");
  return (
    <div className={"form-group " + _styles.block_input}>
      {props.useLabel?<p>{props.placeholder}</p>:null}
      <DatePicker
        selected={_start_date}
        onChange={handleChange}
        dateFormat="DD/MM/YYYY"
        placeholderText={props.placeholder}
      />
      {props.error_message && (
        <p className={_styles.error_message}>{props.error_message}</p>
      )}
    </div>
  );
};

InputDate.propTypes = {
  name: PropTypes.number,
  error_message: PropTypes.string,
  placeholder: PropTypes.string,
  changeInput: PropTypes.func,
  useLabel:PropTypes.bool,

};
export default InputDate;
