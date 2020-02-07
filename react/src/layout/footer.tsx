import React from 'react';
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaGoogle } from 'react-icons/fa';

export class Footer extends React.Component {

  render() {
    return <footer className="footer">
      <div className="container">
        <div className="row align-items-center">
            <div className="col-md-4">
            <span className="copyright">Copyright &copy; Your Website 2020</span>
            </div>
            <div className="col-md-4">
            <ul className="list-inline social-buttons">
                <li className="list-inline-item">
                <a href="#">
                  <FaGoogle className="fab" />
                </a>
                </li>
                <li className="list-inline-item">
                <a href="#">
                  <FaFacebookF className="fab" />
                </a>
                </li>
                <li className="list-inline-item">
                <a href="#">
                  <svg style={{width:20, height:20}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 208 191.94"><g><polygon fill="white" className="cls-1" points="76.01 89.49 87.99 89.49 87.99 89.49 82 72.47 76.01 89.49"/><path fill="white" className="cls-1" d="M104,0C46.56,0,0,36.71,0,82c0,29.28,19.47,55,48.75,69.48-1.59,5.49-10.24,35.34-10.58,37.69,0,0-.21,1.76.93,2.43a3.14,3.14,0,0,0,2.48.15c3.28-.46,38-24.81,44-29A131.56,131.56,0,0,0,104,164c57.44,0,104-36.71,104-82S161.44,0,104,0ZM52.53,69.27c-.13,11.6.1,23.8-.09,35.22-.06,3.65-2.16,4.74-5,5.78a1.88,1.88,0,0,1-1,.07c-3.25-.64-5.84-1.8-5.92-5.84-.23-11.41.07-23.63-.09-35.23-2.75-.11-6.67.11-9.22,0-3.54-.23-6-2.48-5.85-5.83s1.94-5.76,5.91-5.82c9.38-.14,21-.14,30.38,0,4,.06,5.78,2.48,5.9,5.82s-2.3,5.6-5.83,5.83C59.2,69.38,55.29,69.16,52.53,69.27Zm50.4,40.45a9.24,9.24,0,0,1-3.82.83c-2.5,0-4.41-1-5-2.65l-3-7.78H72.85l-3,7.78c-.58,1.63-2.49,2.65-5,2.65a9.16,9.16,0,0,1-3.81-.83c-1.66-.76-3.25-2.86-1.43-8.52L74,63.42a9,9,0,0,1,8-5.92,9.07,9.07,0,0,1,8,5.93l14.34,37.76C106.17,106.86,104.58,109,102.93,109.72Zm30.32,0H114a5.64,5.64,0,0,1-5.75-5.5V63.5a6.13,6.13,0,0,1,12.25,0V98.75h12.75a5.51,5.51,0,1,1,0,11Zm47-4.52A6,6,0,0,1,169.49,108L155.42,89.37l-2.08,2.08v13.09a6,6,0,0,1-12,0v-41a6,6,0,0,1,12,0V76.4l16.74-16.74a4.64,4.64,0,0,1,3.33-1.34,6.08,6.08,0,0,1,5.9,5.58A4.7,4.7,0,0,1,178,67.55L164.3,81.22l14.77,19.57A6,6,0,0,1,180.22,105.23Z"/></g></svg>
                </a>
                </li>
                <li className="list-inline-item">
                <a href="#">
                  <svg enableBackground="new 0 0 512 512" height="40px" id="Layer_1" version="1.1" viewBox="0 0 512 512" width="40px" xmlns="http://www.w3.org/2000/svg"><g><path d="M124.152,139.41h91.746c0,0,83.332,125.871,85.793,129.246c2.52,3.41,2.812,0,2.812,0   c-3.844-19.477-8.016-28.219-8.016-59.379V139.41h91.359v233.18h-91.359c0,0-81.621-119.156-84.082-122.449   c-2.473-3.316-2.801,0-2.801,0c3.141,16.078,5.918,18.762,5.918,46.688v75.762h-91.371V139.41L124.152,139.41z" fill="#FFFFFF"/></g></svg>
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