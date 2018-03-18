import React from "react";
import PropTypes from "prop-types";
import { authenticate } from "./action";
import { withRouter } from "react-router-dom";
import Header from "./HeaderComponent";
const _styles = require("./_styles.scss");
export default withRouter(
  class LoggedContainer extends React.Component {
    static propTypes = {
      children: PropTypes.object,
      externalClass: PropTypes.string
    };
    // static contextTypes={
    //     router:PropTypes.object

    // }
    componentWillMount() {
      console.log("called component");
      let { history } = this.props;
      authenticate()
        .then(status => {})
        .catch(() => {
          history.replace("/login");
        });
    }
    render() {
      return (
        <div className={_styles.container}>
          <Header />
          {this.props.children}
        </div>
      );
    }
  }
);
