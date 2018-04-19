// This component allows the user to import a calendar from an ICS feed

import * as React from "react";
import axios from 'axios';
import SidebarModes from "../../data/sidebar-modes";
import TagPane from "../../components/label-pane.jsx";
import MenuIconButton from '../../components/menu-icon-button.jsx';

export default class SubscriptionEditorPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                labels : [],
                id : '',
            },
        };

        Object.assign(this.state.data, this.getIdFromURL(props));

        this.props.setSidebarMode(SidebarModes.IMPORT);
        props.setPageTitlePrefix('Edit Subscription');
    }

    getIdFromURL = (props) => {
        if ('match' in props && 'id' in props.match.params) {
            return {id: props.match.params.id};
        }
        return null;
    };

    labelToggled = (labelName) => {
        let labels = this.state.data.labels.slice();
        if (labels.includes(labelName)) {
            labels.splice(labels.indexOf(labelName),1);
        } else {
            labels.push(labelName);
        }
        this.setState({data: Object.assign({}, this.state.data, {labels})});
      };

      // urlChanged = (e) => {
      //     let importData = this.state.importData;
      //     importData = Object.assign(importData, {url: e.currentTarget.value});
      //     this.setState({importData : importData});
      // };

    submitSubscription = () => {
      console.log(this.state);
      axios.put(window.abe_url + '/subscriptions/'+this.state.data.id, this.state.data)
          .then(
            (response) => this.props.importSuccess(response, this.state.importData),
            (jqXHR, textStatus, errorThrown) => this.props.importFailed(errorThrown, jqXHR.message)
          );
    };

    render(){
      return(
        <div className="row expanded page-container">
            <div className="row content-container">
                <h1 className="page-title"><MenuIconButton onClick={this.props.toggleSidebarCollapsed} tooltip="Show/Hide Sidebar"/>Edit Subscription: {this.state.data.id}</h1>
                {/*<input required="required" type="url" placeholder=".../example_calendar.ics" className="wide-text-box single-line-text-box medium-text-box" onChange={this.urlChanged}/>*/}
                <h2>Tags: </h2>
                <TagPane contentClass='import-filters' {...this.props} possibleLabels={this.props.labels} selectedLabels={this.state.data.labels} labelToggled={this.labelToggled}/>
                <br/>
                <input type="submit" className="button submit" value="Submit" onClick={this.submitSubscription}/>
            </div>
        </div>
      )
    }
}
