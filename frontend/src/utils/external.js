import Validator from "validatorjs";

export function insertDataGenerator(array_fields) {
  console.log("utils start generate", array_fields);
  let objectData = {};
  for (let i = 0; i < array_fields.length; i++) {
    let temp = array_fields[i];
    objectData[temp.field_name] = temp.field_value;
  }
  console.log("utils finish generate", objectData);
  return objectData;
}
export function removeDisabled(array_fields, callback) {
  let _object_form_field = Object.assign([], array_fields);
  for (let i = 0; i < _object_form_field.length; i++) {
    let _temp_field = _object_form_field[i];
    delete _temp_field["disabled"];
  }
  callback(_object_form_field);
  return;
}
export function validation(array_fields, validation_rules, callback) {
  let _data = insertDataGenerator(array_fields);
  let validation = new Validator(_data, validation_rules);
  validation.passes();
  let _object_form_field = Object.assign([], array_fields);
  for (let i = 0; i < _object_form_field.length; i++) {
    let _temp_field = _object_form_field[i];
    _temp_field.error_message = validation.errors.first(_temp_field.field_name);
  }
  if (validation.passes()) {
    callback(true, _object_form_field);
  } else {
    callback(false, _object_form_field);
  }
}
export function fieldsCleaner(array_fields) {
  let _new_array_fields = [];
  for (let i = 0; i < array_fields.length; i++) {
    let _temp = Object.assign({}, array_fields[i]);
    _temp.field_value = "";
    _new_array_fields.push(_temp);
  }
  return _new_array_fields;
}
function toRad(value){
  return value*(Math.PI/180);
}
function toDegree(value){
  return value/(Math.PI/180);
}
export function centeredPosition(values){
    while(values.length>1){
      let first_location=values[0];
      let last_location=values[1];
      let dLong=toRad(parseFloat(last_location.long)-parseFloat(first_location.long));
      let radLat1=toRad(parseFloat(first_location.lat));
      let radLat2=toRad(parseFloat(last_location.lat));
      let radlong1 = toRad(first_location.long);
      let Bx = Math.cos(radLat2) * Math.cos(dLong);
      let By = Math.cos(radLat2) * Math.sin(dLong);
      let lat3 = Math.atan2(Math.sin(radLat1) + Math.sin(radLat2), Math.sqrt((Math.cos(radLat1) + Bx) * (Math.cos(radLat1) + Bx) + By * By));
      let long3 = radlong1 + Math.atan2(By, Math.cos(radLat1) + Bx);
      values.shift();
      values.shift();
      console.log(toDegree(lat3),toDegree(long3));
      values.push({lat:toDegree(lat3),long:toDegree(long3)});
    }
    console.log(values);
    return [values[0].lat,values[0].long];
  
}
export function checkHasParentClass(element,findClass){

  if(element.className===findClass){
    return true;
  }
  else if(element.parentElement==null){
    return false;
  }
  return checkHasParentClass(element.parentElement,findClass);
}
