import React,{Fragment} from 'react';
import {Link} from 'react-router-dom';
import {signOut} from '../action';
import { withRouter } from 'react-router-dom';
import Dropdown, { DropdownContent, DropdownHandler } from 'commons/Dropdown';
const _img_profile = require('images/sample_photo.png');
const _styles = require('./_styles.scss');
const Header=(props)=>{
    let _signOut=()=>{
        signOut();
        console.log(props);
        props.history.replace("/login");
    }
    return(
        <nav className={"navbar bg-header "+_styles.container}>
          <Link className={" navbar_brand"} to="/">
            <i className="icons icon-logo-line logo-header"/>
          </Link>
          <div className="navbar-center">
            <Link className="navbar-link" to="/dashboard" activeClassName={_styles.active_nav_button}>Dashboard</Link>
            <Link className="navbar-link" to="/dashboard" activeClassName={_styles.active_nav_button}>Monitoring</Link>
            <Link className="navbar-link" to="/example" activeClassName={_styles.active_nav_button}>Report</Link>
          </div>
          <div className="navbar-right">
            <Dropdown typeTrigger="hover">
              <DropdownHandler className={_styles.setting_handler}>
                <span className={_styles.profile}>
                  <img src={_img_profile} alt="sample images" />
                </span>
              </DropdownHandler>
              <DropdownContent className={_styles.setting_content}>
                <Link to="/user-setting"><img src={_img_profile} alt="sample images" /><span>View My Profile</span></Link>
                <a><span className=" icon-my-team bg-silver setting s25" /><span>My Team</span></a>
                <a><span className="icon-library setting s25" /><span>My Library</span></a>
                <a><span className="icon-process-monitor setting s25" /><span>Process Monitor</span></a>
                <a><span className="icon-activity-monitor setting s25" /><span>Activity Monitor</span></a>
                <a><span className="icon-path setting s25" /><span>Data Marketplace</span></a>
                <a><span className="icon-setting setting s25" /><span>Account Settings</span></a>
                <a onClick={this._logOut}><span className="icon-sign-out s25" /><span className="text-pomegranate">Log Out</span></a>
              </DropdownContent>
            </Dropdown>

          </div>
        </nav>
    )    
}
export default withRouter(Header);

