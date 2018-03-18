
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import DropdownHandler from './DropdownHandler';
import DropdownContent from './DropdownContent';
import DropdownTitle from './DropdownTitle';
import DropdownContentMultipleSelect from './DropdownContentMultipleSelect';
import classnames from 'classnames';
const _styles = require('./_dropdown.scss');
/**
 * PLEASE READ THIS FIRST!!!!
 * Dropdown for create component Dropdown
 * it has 2 type of Dropdown
 * 1. dropdown without event click only hover (typeTrigger:hover)
 * 2. dropdown with click event connected with dropdown trigger (typeTrigger:click)
 * 3. dropdown with click event but not conected dropdown trigger (event customized and position custommized too) (typeTrigger:clickCustom)
 *     the button will call must have data-type attribute with value dropdown_element
 */
class Dropdown extends Component{
  constructor(props,context) {
    super(props);
    this.state = {
      active: false, // for 2&3
    };

  }
  /**
   * componentDidMount, componentWillUnmount, _isActive,_hide,_show if trigger not hover
   */
  componentDidMount() {
    if(this.props.typeTrigger!=='hover'&&this.props.typeTrigger!=='click-submenu'){
      window.addEventListener( 'click', this._onWindowClick );
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.active!=undefined){
      this.setState({active:nextProps.active});
    }
  }
  componentWillUnmount() {
    if(this.props.typeTrigger!=='hover'){
      window.removeEventListener( 'click', this._onWindowClick );
    }
  }
  _hide = () =>  {
    if(typeof this.props.onHide === 'function'){
      this.props.onHide();
    }
    else{
      this.setState({active: false});
    }

  }

  // this only for typeTrigger click
  _show = () =>  {
     this.setState({active: true});
  }
  _onWindowClick = ( event ) => {
    const _dropdown_element =  findDOMNode( this );
    if(event.target !== _dropdown_element&&event.target.getAttribute('data-type')!=='dropdown_element' && !_dropdown_element.contains( event.target ) && this.state.active ){
      this._hide();
    }
    else if(this.props.typeTrigger=='click'&&_dropdown_element.contains( event.target )&&this.state.active&&event.target.getAttribute('data-type')==='dropdown_element_content'){
      console.log("called dropdown element lcick");

      this._hide();
    }

  }

  _onToggleClick = ( _event ) => {
    _event.preventDefault();
    if( this.state.active ){
      this._hide();
    } else {
      this._show();
    }
  }
  render() {
    let _dropdown_class=classnames(_styles.dropdown
      ,this.props.className
      ,{[`${_styles.dropdown_custom_click}`]:(this.props.typeTrigger==='click_custom')? true:false}

      ,{[`${_styles.dropdown_hover}`]:(this.props.typeTrigger==='hover')? true:false}
      ,{active:this.state.active}
    );
    
    const { children, className,typeTrigger,positionContent } = this.props;
    // create component classes
    // stick callback on trigger element
    let _bound_children =children;
    if(typeTrigger=='click'||typeTrigger=='click-submenu'){
      // = (this._isActive) ?  _styles.dropdownActive + ' ' + _styles.dropdown : _styles.dropdown ;
      _bound_children=React.Children.map( children, child => {
        if( child.type === DropdownHandler ){
          child = React.cloneElement(child, {
            onClick: this._onToggleClick,
            active:this.state.active
          });
        }
        else if(child.type===DropdownContent){
          child = React.cloneElement(child, {
            classPosition:positionContent
          });
        }
        return child;
      });
    }
    return (
      <div style={this.props.style} className={_dropdown_class}>
        {_bound_children}
      </div>
    );
  }
}

Dropdown.propTypes = {
  className: PropTypes.string,
  children:PropTypes.node, //can get multiple type usually(array or object)
  style:PropTypes.string,
  active:PropTypes.bool,
  typeTrigger:PropTypes.string,
  typeCss:PropTypes.string,
  onHide:PropTypes.func,
  top:PropTypes.number,
  left:PropTypes.number,
  positionContent:PropTypes.string,
};

Dropdown.defaultProps = {
  className: '',
  positionContent:'overlay',
};

export { DropdownHandler, DropdownContent, DropdownTitle,DropdownContentMultipleSelect };
export default Dropdown;
