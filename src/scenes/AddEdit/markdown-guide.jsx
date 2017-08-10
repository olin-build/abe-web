import React from 'react';

export default class MarkdownGuide extends React.Component {

    render() {
        return (
            <div className="markdown-guide">
                {/*<span className="markdown-guide-title">Markdown Guide</span>*/}
                <div className="markdown-guide-section-container">
                    <div className="markdown-guide-section">
                        <span className="markdown-guide-section-title">Links</span>
                        <p className="markdown-sample">[link text](url)</p>
                        <p className="markdown-sample">[url]</p>
                    </div>
                    <div className="markdown-guide-section">
                        <span className="markdown-guide-section-title">Headers</span>
                        <h1># big header</h1>
                        <h2>## smaller header</h2>
                        <p>
                            And so on, adding more hashes to make the header smaller.<br/>
                            <strong>Don't forget the space between the hash and the text.</strong>
                        </p>
                    </div>
                    <div className="markdown-guide-section">
                        <span className="markdown-guide-section-title">Emphasis</span>
                        <p className="markdown-sample italic">*italic*</p>
                        <p className="markdown-sample bold">**bold**</p>
                        <p className="markdown-sample bold italic">***bold and italic***</p>
                    </div>
                    <div className="markdown-guide-section">
                        <span className="markdown-guide-section-title">Images</span>
                        <p className="markdown-sample">![mouse hover text](url_to_image)</p>
                        <p>Currently images must be hosted elsewhere. If you need to upload your photo somewhere,
                            put it on Google Drive or Dropbox and use the public link to the file.</p>
                    </div>
                    <div className="markdown-guide-section">
                        <span className="markdown-guide-section-title">Lists</span>
                        <p>Indent each list item with <strong>two spaces</strong>, followed by an asterisk, number, or letter, and then another space.</p>
                        <div style={{display:'block'}}>
                            <div style={{width:'33.3%',float:'left'}}>
                                <span>Bulletted</span>
                                <p className="markdown-sample">
                                    &nbsp;&nbsp;* List item<br/>
                                    &nbsp;&nbsp;* List item<br/>
                                    &nbsp;&nbsp;* List item
                                </p>
                            </div>
                            <div style={{width:'33.3%',float:'left'}}>
                                <span>Numbered</span>
                                <p className="markdown-sample">
                                    &nbsp;&nbsp;1 List item<br/>
                                    &nbsp;&nbsp;2 List item<br/>
                                    &nbsp;&nbsp;3 List item
                                </p>
                            </div>
                            <div style={{width:'33.3%',float:'left'}}>
                                <span>Lettered</span>
                                <p className="markdown-sample">
                                    &nbsp;&nbsp;a List item<br/>
                                    &nbsp;&nbsp;b List item<br/>
                                    &nbsp;&nbsp;c List item
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}