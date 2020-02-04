import React from 'react';
import { FaTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

export class Footer extends React.Component {

  render() {
    return <footer className="footer">
      <div className="container">
        <div className="row align-items-center">
            <div className="col-md-4">
            <span className="copyright">Copyright &copy; Your Website 2019</span>
            </div>
            <div className="col-md-4">
            <ul className="list-inline social-buttons">
                <li className="list-inline-item">
                <a href="#">
                    <FaTwitter className="fab" />
                </a>
                </li>
                <li className="list-inline-item">
                <a href="#">
                    <FaFacebookF className="fab" />
                </a>
                </li>
                <li className="list-inline-item">
                <a href="#">
                    <FaLinkedinIn className="fab" />
                </a>
                </li>
            </ul>
            </div>
            <div className="col-md-4">
            <ul className="list-inline quicklinks">
                <li className="list-inline-item">
                <a href="#">Privacy Policy</a>
                </li>
                <li className="list-inline-item">
                <a href="#">Terms of Use</a>
                </li>
            </ul>
            </div>
        </div>
      </div>
    </footer>
  }
}