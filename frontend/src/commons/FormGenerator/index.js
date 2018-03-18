import React from "react";
import PropTypes from "prop-types";
import InputText from "./InputText";
import TextArea from "./TextArea";
import InputDate from "./InputDate";

import randomstring from "randomstring";
import { Combobox } from "commons";
// import Selectbox from './Selectbox';
class FormGenerator extends React.Component {
  constructor(props) {
    super(props);
    let temp = {};
    for (let i = 0; i < props.fields.length; i++) {
      temp[props.fields[i].field_name] = "";
    }
    this.state = {
      fields: temp,
      name: randomstring.generate(5)
    };
  }
  _changeInput = (value, name) => {
    this.props.onChangeInput(value, name);
  };
  render() {
    let formHtml = [];
    for (let i = 0; i < this.props.fields.length; i++) {
      let _field = this.props.fields[i];
      switch (_field.field_type) {
        case "selectbox": {
          let temp = (
            <Combobox
              useLabel={this.props.label}
              defaultValue={_field.field_placeholder}
              classContainer={"form-group"}
              type="form"
              key={"form_" + this.state.name + "_" + i}
              optionValue="label"
              optionLabel="label"
              name={i}
              value={_field.field_value}
              error_message={_field.error_message}
              options={_field.field_options}
              onChange={this._changeInput}
            />
          );
          // let temp=<Selectbox
          //    key={"form_group_"+this.props.name+"_"+i}
          //    placeholder={this.props.fields[i].field_placeholder}
          //    name={this.props.fields[i].field_name}
          //    value={this.props.fields[i].field_value}
          //    changeInput={this._changeInput}
          //    options={this.props.fields[i].field_options}
          //  />
          formHtml.push(temp);
          break;
        }
        case "textarea": {
          formHtml.push(
            <TextArea
              useLabel={this.props.label}
              key={"form_group_" + this.props.name + "_" + i}
              placeholder={_field.field_placeholder}
              name={i}
              type={_field.field_type}
              value={_field.field_value}
              changeInput={this._changeInput}
              disabled={_field.disabled}
              error_message={_field.error_message}
            />
          );
          break;
        }
        case "date": {
          formHtml.push(
            <InputDate
              useLabel={this.props.label}
              key={"form_group_" + this.props.name + "_" + i}
              placeholder={_field.field_placeholder}
              name={i}
              type={_field.field_type}
              value={_field.field_value}
              changeInput={this._changeInput}
              disabled={_field.disabled}
              error_message={_field.error_message}
            />
          );
          break;
        }
        default: {
          formHtml.push(
            <InputText
              useLabel={this.props.label}
              key={"form_group_" + this.props.name + "_" + i}
              placeholder={_field.field_placeholder}
              name={i}
              type={_field.field_type}
              value={_field.field_value}
              changeInput={this._changeInput}
              disabled={_field.disabled}
              error_message={_field.error_message}
            />
          );
        }
      }
    }
    return <form>{formHtml}</form>;
  }
}
FormGenerator.propTypes = {
  fields: PropTypes.array,
  name: PropTypes.string,
  onChangeInput: PropTypes.func,
  label: PropTypes.bool
};
FormGenerator.defaultProps = {
  label: true
};
export { InputText };
export default FormGenerator;
