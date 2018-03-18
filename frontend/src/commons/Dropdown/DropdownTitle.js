import React from 'react';
import PropTypes from 'prop-types';

const _styles=require('./_dropdown.scss');
const DropdownTitle=(props)=>{
  return(
    <div className={_styles.dropdown_title+' bg-header'}>
      {props.children}
    </div>
  );
};
DropdownTitle.propTypes={
  children:PropTypes.array
};
export default DropdownTitle;
