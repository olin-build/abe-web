import React from "react";
import LabelPane from "../components/label-pane.jsx";

export default class FilterPane extends React.Component {

    selectTags = (allNoneDefault) => {
        let labels = Object.assign({}, this.props.labels);
        let newValue = (allNoneDefault === 'all') ? true : ((allNoneDefault === 'none') ? false : undefined);
        for (let labelName in labels) {
            labels[labelName].selected = (newValue !== undefined) ? newValue : labels[labelName].default;
        }
        this.props.setLabels(labels);
    };

    render() {

        return (
            <div className={"filter-pane " + this.props.className}>
                <div className="sidebar-item-subsection-header">
                    <span className="sidebar-item-subsection-title">Tags</span>
                    <div className="align-right">
                        <a onClick={() => this.selectTags('all')}>All</a>
                        &nbsp;|&nbsp;
                        <a onClick={() => this.selectTags('default')}>Default</a>
                        &nbsp;|&nbsp;
                        <a onClick={() => this.selectTags('none')}>None</a>
                    </div>
                </div>
                <LabelPane {...this.props}/>
            </div>
        )
    }


}