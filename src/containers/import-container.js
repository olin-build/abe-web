import { connect } from 'react-redux';
import { setSidebarMode, refreshLabelsIfNeeded } from '../data/actions';
import ImportScene from '../scenes/Import/import.jsx';

const mapStateToProps = state => {
    return {
        general: state.general,
        labels: state.labels
    }
};

const mapDispatchToProps = dispatch => {
    return {
        refreshLabelsIfNeeded: () => {
            dispatch(refreshLabelsIfNeeded());
        },
        setSidebarMode: mode => {
            dispatch(setSidebarMode(mode));
        }
    }
};

// Connect props to Redux state and actions
const ImportContainer = connect(mapStateToProps, mapDispatchToProps)(ImportScene);

export default ImportContainer;
