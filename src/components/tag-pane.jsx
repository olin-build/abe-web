import * as React from "react";

export default class TagPane extends React.Component {

    constructor(props) {
        super(props);
        if (props.refreshLabelsIfNeeded)
            props.refreshLabelsIfNeeded();
    }

    tagClicked = (tagName) => {
        this.props.labelToggled(tagName);
    };

    render() {
        let enableHoverStyle = !this.props.general.isMobile && this.props.editable;
        const noHoverText = enableHoverStyle ? '' : 'no-hover ';
        let tagElems = [];
        if (this.props.possibleLabels && this.props.selectedLabels) {
            Object.keys(this.props.possibleLabels).forEach((name) => {
                let tooltip = this.props.possibleLabels[name].description;
                let selected = this.props.selectedLabels.includes(name);
                if (selected || this.props.showUnselected) {
                    let classes = 'tag ' + name + (selected ? ' selected' : '');
                    if (this.props.editable) {
                        tagElems.push(<button id={'tag-' + name} key={name} title={tooltip} type="button"
                                              className={`button ${noHoverText}${classes}`}
                                              onClick={() => this.tagClicked(name)}>{name}</button>);
                    } else {
                        tagElems.push(<span id={'tag-' + name} key={name} title={tooltip}
                                            className={classes}>{name}</span>);
                    }
                }
            });
        }
        let colorSettings = '';
        for (let name in this.props.possibleLabels) {
            let bgColor = this.props.possibleLabels[name].color;
            colorSettings += `.tag.button.${name}:not(.no-hover):hover,.tag.${name}.selected{background-color:${bgColor};}`;
        }
        return (
            <div className={this.props.contentClass}>
                <style type="text/css">{colorSettings}</style>
                <div className="tag-selector-list">
                    {tagElems}
                </div>
            </div>
        )
    }

}

TagPane.defaultProps = {
    editable: true,
    showUnselected: true,
};