import * as React from "react";
import { WithContext as ReactTags } from 'react-tag-input';

export default class TagEntry extends React.Component {

    constructor(props) {
        super(props);

        if (!this.props.tags)
            console.error('TagEntry tags prop must be defined. Use [] for an empty tags list.');

        this.state = {};

        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let tags = [];
        nextProps.tags.forEach((tag) => {
            tags.push({
                id: tags.length,
                text: tag
            });
        });
        this.setState({tagsWithIds: tags, tagsWithoutIds: nextProps.tags}); // IDs used by React to keep track of individual list items (error if missing)
    }

    handleAddition(tag) {
        let tags = this.state.tagsWithoutIds;
        tags.push(tag);
        this.props.onChange(tags);
    }

    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tagsWithoutIds;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.props.onChange(tags);
    }

    handleDelete(i) {
        let tags = this.state.tagsWithoutIds;
        tags.splice(i, 1);
        this.props.onChange(tags);
    }

    render() {
        return (
            <div>
                <link href="/public/css/reactTags.css" type="text/css" rel="stylesheet" />
                <ReactTags
                    tags={this.state.tagsWithIds}
                    autocomplete={true}
                    restrictTags={true}
                    suggestions={this.props.possibleLabels}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    handleDelete={this.handleDelete}
                />
            </div>
        )
    }
}
