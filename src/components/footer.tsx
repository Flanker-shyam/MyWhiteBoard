import React from "react";

function Footer() {
  const iconStyle = {
    height:'30px',
    width:'30px',
  }
  return (
    <div className="container">
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
      <div className="col-md-4 d-flex align-items-center">
        <a href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
          <svg className="bi" width="30" height="24"></svg>
        </a>
        <span className="mb-3 mb-md-0 text-muted">© 2022 Flanker</span>
      </div>
  
      <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
        <li className="ms-3"><a className="text-muted" href="#"><img style={iconStyle} src="/images/fb.png" /></a></li>
        <li className="ms-3"><a className="text-muted" href="#"><img style={iconStyle} src ="/images/insta.png"/></a></li>
        <li className="ms-3"><a className="text-muted" href="#"><img style={iconStyle} src="/images/twit.png" /></a></li>
      </ul>
    </footer>
  </div>
  );
}

export default Footer;
