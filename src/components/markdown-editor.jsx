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
        let markdownGuide = (
            <div className="markdown-guide">
                <span className="markdown-guide-title">Markdown Guide</span>
                <div className="markdown-guide-section-container">
                    <div className="markdown-guide-section">
                        <span className="markdown-guide-section-title">Headers</span>
                        <h1># big header</h1>
                        <h2>## smaller header</h2>
                        <span>And so on, adding more hashes to make the header smaller.</span>
                    </div>
                    <div className="markdown-guide-section">
                        <span className="markdown-guide-section-title">Emphasis</span>
                        <p className="markdown-sample italic">*italic*</p>
                        <p className="markdown-sample bold">**bold**</p>
                        <p className="markdown-sample bold italic">***bold and italic***</p>
                    </div>
                    <div className="markdown-guide-section">
                        <p className="markdown-guide-section-title">Links</p>
                        <p className="markdown-sample">[link text](url)</p>
                        <p className="markdown-sample">[url]</p>
                    </div>
                    <div className="markdown-guide-section">
                        <p className="markdown-guide-section-title">Images</p>
                        <p className="markdown-sample">![mouse hover text](url_to_image)</p>
                        <p>Currently images must be hosted elsewhere. If you need to upload your photo somewhere,
                            put it on Google Drive or Dropbox and use the public link to the file.</p>
                    </div>
                </div>
            </div>
        );

        let markdownGuideVisible = this.props.markdownGuideVisible;

        return (
            <div className="markdown-editor-container">
                <div className="markdown-editor-editor-preview-container">
                    <textarea onChange={this.updateCode} value={this.props.source}  className="markdown-editor column medium-6" placeholder="Description (Markdown enabled)"/>
                    {/*<CodeMirror className="markdown-editor" value={this.state.source} onChange={this.updateCode} options={this.state.editorOptions} />*/}
                    <Markdown source={this.props.source} className="markdown-preview column medium-6" />
                </div>
                {/*<a className="markdown-guide-visibility-toggle" onClick={() => this.props.setMarkdownGuideVisibility(!markdownGuideVisible)}>{((markdownGuideVisible) ? 'Hide' : 'Show') + ' Markdown Guide'}</a>*/}
                {(markdownGuideVisible) ? markdownGuide : null}
            </div>
        )
    }

}