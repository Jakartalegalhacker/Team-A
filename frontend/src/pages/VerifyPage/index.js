import React from "react";
import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
import { FormGenerator, Notif } from "commons";
import Validator from "validatorjs";
import _styles from "./_styles.scss";
import { insertDataGenerator } from "utils/external";
import { register } from "./actions";
import Dropzone from "react-dropzone";
export default class RegisterPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      formFields: [
        {
          field_name: "name",
          field_text: "name",
          field_type: "text",
          field_placeholder: "Name",
          field_value: "",
          type: "text",
          error_message: ""
        }
      ],
      nik_photo: []
    };
  }

  _onChange = (value, name) => {
    let temp = this.state.formFields;
    temp[name].field_value = value;
    this.setState({ formFields: temp });
  };

  _validation = callback => {
    let $$ = this;
    let _data = insertDataGenerator(this.state.formFields);
    let _validation_rules = {
      name: "required"
    };
    let validation = new Validator(_data, _validation_rules);
    validation.passes();
    let _object_form_field = Object.assign([], this.state.formFields);
    for (let i = 0; i < _object_form_field.length; i++) {
      let _temp_field = _object_form_field[i];
      _temp_field.error_message = validation.errors.first(
        _temp_field.field_name
      );
    }
    $$.setState({ formFields: _object_form_field });
    if (validation.passes()) {
      callback(true);
    } else {
      callback(false);
    }
  };

  _submit = () => {
    let $$ = this;
    register(
      insertDataGenerator($$.state.formFields),
      $$.state.nik_photo,
      $$.state.person_photo
    ).then(result => {
      console.log(result, "result");
      if (result === "not_verified") {
        Notif("failed", "not verified");
      } else {
        Notif("success", "verified");
      }
    });
  };
  _onDropPhoto = files => {
    let { nik_photo } = this.state;
    files.forEach(function(el) {
      nik_photo.push(el.name);
    });
    console.log(files);
    this.setState({
      person_photo: files[0].name,
      person_photo_show: files[0].preview
    });
  };
  _onDropNik = files => {
    let { person_photo } = this.state;
    files.forEach(function(el) {
      person_photo.push(el.name);
    });
    this.setState({
      nik_photo: files[0].name,
      nik_photo_show: files[0].preview
    });
  };
  render() {
    return (
      <div className={_styles.initial_wrapper}>
        <h3 className="logo" />
        <div className="bottom">
          <div className="main-form">
            <div className="content">
              <FormGenerator
                fields={this.state.formFields}
                onChangeInput={this._onChange}
                name="add_first_user"
                label={false}
              />
              <Dropzone
                style={{ width: "200px" }}
                onDrop={files => this._onDropPhoto(files)}
              >
                <div>upload file photo</div>
              </Dropzone>
              <img
                src={this.state.person_photo_show}
                width="100"
                height="100"
              />

              {/*<img src={this.state.nik_photo_show} />

              <Dropzone onDrop={files => this._onDropNik(files)}>
                <div>file KTP</div>
              </Dropzone>
              */}
              <div className="error-message">{this.state.errorMessage}</div>

              <div className="button">
                <button
                  type="button"
                  onClick={this._submit}
                  className="btn third big-width"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
RegisterPage.propTypes = {
  location: PropTypes.object
};
RegisterPage.contextTypes = {
  router: PropTypes.object
};
