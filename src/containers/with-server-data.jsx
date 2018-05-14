import * as React from 'react';

// Guard the wrapped component behind a loading message, until the required
// server data has been loaded. Currently this is the account info and the
// labels.
export const withAccountInfo = WrappedComponent => props =>
  (props.account ? <WrappedComponent {...props} /> : <h1>Loading…</h1>);

// Guard the wrapped component behind a loading message, until the required
// server data has been loaded. Currently this is the labels.
const withServerData = WrappedComponent => props =>
  (props.labels && props.labels.labelList ? <WrappedComponent {...props} /> : <h1>Loading…</h1>);

export default withServerData;
