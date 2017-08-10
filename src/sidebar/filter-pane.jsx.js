import React from "react";
import LabelPane from "../components/label-pane.jsx";

export default class FilterPane extends React.Component {

    selectTags = (allNoneDefault) => {

        let visibleLabels;
        switch (allNoneDefault) {
            case 'all':
                visibleLabels = Object.values(this.props.labels.labelList).map(l => l.name);
                break;
            case 'none':
                visibleLabels = [];
                break;
            case 'default':
                visibleLabels = Object.values(this.props.labels.labelList).filter(l => l.default).map(l => l.name);
                break;
            default:
                // Do nothing
        }
        this.props.setVisibleLabels(visibleLabels);
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