import * as React from "react";
import Markdown from 'react-markdown';
import CodeMirror from 'react-codemirror';
require('!css-loader!codemirror/lib/codemirror.css');


export default class MarkdownEditor extends React.Component {

    constructor(props) {
        super(props);

        this.updateCode = this.updateCode.bind(this);

        // this.state = {
        //     source: (props.source) ? props.source : '',
        //     editorOptions: {
        //         mode: 'markdown',
        //         lineNumbers: true
        //     }
        // };
    }

    updateCode (e) {
        if (e.target !== undefined) {
            this.props.onChange(e.target.value);
        } else {
            this.props.onChange(e);
        }

    }

    render() {
        return (
            <div className="markdown-editor-container">
                <textarea onChange={this.updateCode} value={this.props.source}  className="markdown-editor" placeholder="Description (Markdown enabled)"/>
                {/*<CodeMirror className="markdown-editor" value={this.state.source} onChange={this.updateCode} options={this.state.editorOptions} />*/}
                <Markdown source={this.props.source} className="markdown-preview" />
            </div>
        )
    }

}