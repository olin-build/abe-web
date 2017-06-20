import * as React from "react";
import PageHeader from '../../components/header.jsx'
import Footer from '../../components/footer.jsx'

export default class AddEditEventScene extends React.Component {
    render() {
        return (
            <div class="row expanded page-container">
                <PageHeader/>
                <div class="row">
                    <div class="column small-12">
                        <p>We're in adding mode!</p>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}
