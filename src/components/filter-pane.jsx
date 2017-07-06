import * as React from "react";

export default class FilterPane extends React.Component {

    constructor(props) {
        super(props);

        this.labelClicked = this.labelClicked.bind(this);

    }

    labelClicked(labelName) {
        this.props.labelVisibilityToggled(labelName);
    }

    render() {

        let labelElems = [];
        for (let name in this.props.labels) {
            let selected = this.props.labels[name];
            let classes = 'button label';
            if (selected) {
                classes += ' selected';
            }

            labelElems.push(<button id={'label-'+name} key={name} type="button" className={classes} onClick={() => this.labelClicked(name)}>{name}</button>);
        }
        return (
            <div className="row large-collapse filter-pane">
                <span className="column small-12 filter-pane-title">Filter</span>
                <div className="column small-12 filter-pane-labels-list">
                    {labelElems}
                </div>
            </div>
        )
    }

}