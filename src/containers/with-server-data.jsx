import * as React from 'react';

// Guard the wrapped component behind a loading message, until the required
// server data has been loaded. Currently this is the set of labels. #175, #179
// and #217 will probably also check whether user auth data has been loaded.
const withServerData = WrappedComponent => props =>
  (props.labels && props.labels.labelList ? <WrappedComponent {...props} /> : <h1>Loading</h1>);

export default withServerData;
