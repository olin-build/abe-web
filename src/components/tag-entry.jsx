import * as React from "react";
// import { WithContext as ReactTags } from './react-tags/ReactTags';
import { WithContext as ReactTags } from 'react-tag-input';

export default class TagEntry extends React.Component {

    constructor(props) {
        super(props);

        if (!this.props.tags)
            console.error('TagEntry tags prop must be defined. Use [] for an empty tags list.');

        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    handleAddition(tag) {
        let tags = this.props.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.props.onChange(tags);
    }

    handleDrag(tag, currPos, newPos) {
        let tags = this.props.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.props.onChange(tags);
    }

    handleDelete(i) {
        let tags = this.props.tags;
        tags.splice(i, 1);
        this.props.onChange(tags);
    }

    render() {
        return (
            <div>
                <link href="/css/reactTags.css" type="text/css" rel="stylesheet" />
                <ReactTags
                    tags={this.props.tags}
                    suggestions={this.props.possibleLabels}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    handleDelete={this.handleDelete}
                />
                {/*<div style="display:none;" id="tag-box" className="tag-box"></div>*/}
            </div>
        )
    }
}
