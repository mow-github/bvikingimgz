import React from "react";

const Footer = (props) => {
  return (
    <div className="footerContainer">
      <div className="footerSubContainer">
        <span className="footerCopyright">&copy; Copyright {new Date().toDateString()}, Bvikingimgz</span>
        {props.users && <span className="footerTerminateAccount" onClick={props.removeLoggedinUserFB}> Terminate account ?</span> }
      </div>
    </div>
  );
};

export default Footer;



