import * as React from "react";
import PageHeader from '../../components/header.jsx'
import Footer from '../../components/footer.jsx'

export default class AddEditEventScene extends React.Component {
    render() {
        return (
            <div className="row expanded page-container">
                <PageHeader/>
                <div className="row">
                    <div className="column small-12">
                        <p>We're in adding mode!</p>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}
