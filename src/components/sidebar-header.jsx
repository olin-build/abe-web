import * as React from "react";
import OlinLogo from 'svg-react-loader?name=Icon!../../assets/olin-logo-beta.svg';

export class SidebarHeader extends React.Component {
    render() {
        return (
            <header className="header-content">
                <a onClick={this.props.homeClicked} alt="Home" title="Home"><OlinLogo className="olin-logo"/></a>
            </header>
        )
    }
}
