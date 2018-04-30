// This component is the sidebar footer

import * as React from 'react';

export default class Footer extends React.Component {
  render() {
    return (
      <footer>
        <div className="footer-message">
          <p>Made with &hearts; at <a href="http://www.olin.edu/" title="Olin College website" target="_blank">Olin
            College of Engineering</a></p>
          <p>
            <a href="https://goo.gl/forms/2cqVijokICZ5S20R2" title="Report a problem" target="_blank">
              Report a problem
            </a>
            &nbsp;|&nbsp;
            <a href="https://github.com/olinlibrary/abe-web" title="View on GitHub" target="_blank">
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    );
  }
}
