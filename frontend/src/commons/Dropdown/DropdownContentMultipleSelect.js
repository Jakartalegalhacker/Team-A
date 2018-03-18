import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
const _styles = require("./_dropdown.scss");
class DropdownContentMultipleSelect extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      search_input: "",
      selected_list: [],
    };
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.selectedList&&nextProps.listData){
      let _selected_cctv=nextProps.selectedList.map((elm)=>{
        return nextProps.listData.find((elm2)=>{
          return elm2.index==elm;
        });
      });
      this.setState({selected_list:_selected_cctv});
    }
  }
  _renderSearchResult = () => {
    let { search_input, selected_list } = this.state;
    let { listData } = this.props;
    let $$ = this;
    if (search_input != "") {
      let _list = listData.filter(elm => {
        return (
          elm.value.indexOf(search_input) != -1 &&
          !selected_list.find(elm2 => {
            return elm2.value == elm.value;
          })
        );
      });
      let _html = _list.map((elm, index) => {
        return (
          <div className="row-data" key={"search_result_" + elm.index}>
            <p>{elm.value}</p>
            <button
              data-type="dropdown_element"
              onClick={$$._selectRow(elm.index)}
            >
              {" "}
              <i className="icon-check" data-type="dropdown_element" />
              <p data-type="dropdown_element">Select</p>
            </button>
          </div>
        );
      });
      return <div className={_styles.search_result_container}>{_html}</div>;
    }
    return null;
  };
  _renderSelected = () => {
    let $$ = this;
    let { selected_list } = this.state;
    let _html = selected_list.map(elm => {
      return (
        <div className="row-data" key={"selected_result_" + elm.index}>
          <p>{elm.value}</p>
          <i
            className="icon-cancel"
            data-type="dropdown_element"
            onClick={$$._deleteSelected(elm.index)}
          />
        </div>
      );
    });
    return <div className={_styles.selected_container}>{_html}</div>;
  };
  _selectRow = index => {
    let { listData } = this.props;
    let { selected_list } = this.state;
    let $$ = this;
    return event => {
      selected_list.push(
        listData.find(elm => {
          return elm.index == index;
        })
      );
      $$.setState({ selected_list: selected_list });
      $$.props.onChangeSelected("insert", index);
    };
  };
  _deleteSelected = index => {
    let { selected_list } = this.state;
    let $$ = this;
    return event => {
      let _selected_list = selected_list.filter((elm, idx) => {
        return elm.index != index;
      });
      $$.setState({ selected_list: _selected_list });
      $$.props.onChangeSelected("delete", index);
    };
  };
  _changeInput = event => {
    this.setState({ search_input: event.target.value });
  };
  render() {
    const { className, classPosition, name } = this.props;
    const { selected_list } = this.state;
    const classes = classnames(
      _styles.dropdown_content,
      _styles.multiple_select,

      classPosition,
      className
    );
    return (
      <div className={classes} style={this.props.styles}>
        <div className="search-box">
          <input
            name="search"
            onChange={this._changeInput}
            value={this.state.search_input}
          />{" "}
          <i className="icon-search" />
        </div>
        {this._renderSearchResult()}

        <p>{selected_list.length + " " + name + " Selected"}</p>
        {this._renderSelected()}
      </div>
    );
  }
}

DropdownContentMultipleSelect.propTypes = {
  className: PropTypes.string,
  styles: PropTypes.object,
  classPosition: PropTypes.string.isRequired,
  listData: PropTypes.array,
  selectedList: PropTypes.array,
  name: PropTypes.string,
  onChangeSelected: PropTypes.func
};

DropdownContentMultipleSelect.defaultProps = {
  className: "",
  classPosition: "overlay"
};

export default DropdownContentMultipleSelect;
