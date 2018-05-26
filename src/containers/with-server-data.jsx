import * as React from 'react';

export const Loading = () => <div className="loading" />;

// Guard the wrapped component behind a loading message, until the required
// server data has been loaded. Currently this is the user info and the
// labels.
export const withAccountInfo = WrappedComponent => props =>
  (props.user ? <WrappedComponent {...props} /> : <Loading />);

// Guard the wrapped component behind a loading message, until the required
// server data has been loaded. Currently this is the labels.
const withServerData = WrappedComponent => props =>
  (props.labels && props.labels.labelList ? <WrappedComponent {...props} /> : <Loading />);

export default withServerData;
