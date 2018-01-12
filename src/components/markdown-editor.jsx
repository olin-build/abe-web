// This component is a Markdown editor (with a preview) for writing event descriptions, etc

import * as React from "react";
import Markdown from 'react-markdown';
import PropTypes from 'prop-types';
// import CodeMirror from 'react-codemirror';
// require('!css-loader!codemirror/lib/codemirror.css');


export default class MarkdownEditor extends React.Component {

    contentChanged = (e) => this.props.onChange(e.target !== undefined ? e.target.value : e);

    render() {
        return (
            <div className="markdown-editor-container">
                <div className="markdown-editor-editor-preview-container">
                    <textarea onChange={this.contentChanged} value={this.props.source} className="markdown-editor column medium-6" placeholder="Description (Markdown enabled)"/>
                    {/*<CodeMirror className="markdown-editor" value={this.state.source} onChange={this.updateCode} options={this.state.editorOptions} />*/}
                    <Markdown source={this.props.source} className="markdown-preview column medium-6" />
                </div>
            </div>
        )
    }

}

// Define React prop types for type checking during development
MarkdownEditor.propTypes = {
    source: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};