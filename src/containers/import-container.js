import { connect } from 'react-redux';
import { setSidebarMode, refreshLabelsIfNeeded, toggleSidebarCollapsed, setPageTitlePrefix } from '../data/actions';
import ImportScene from '../scenes/Import/import.jsx';
import * as ga from 'react-ga';

const mapStateToProps = state => {
    return {
        general: state.general,
        labels: state.labels.labelList
    }
};

const mapDispatchToProps = (dispatch, getState) => {
    return {
        refreshLabelsIfNeeded: () => {
            dispatch(refreshLabelsIfNeeded());
        },
        setSidebarMode: mode => {
            dispatch(setSidebarMode(mode));
        },
        toggleSidebarCollapsed: () => {
            dispatch(toggleSidebarCollapsed());
            const action = getState().sidebar.isCollapsed ? 'expanding' : 'collapsing';
            ga.event({
                category: 'Sidebar',
                variable: 'collapseToggle',
                value: action,
                label: 'User toggled the visibility of the sidebar',
            });
        },
        setPageTitlePrefix: (title) => {
            dispatch(setPageTitlePrefix(title));
        },
        importSuccess: (response, importData) => {
            ga.event({
                category: 'ICS Feed Import',
                variable: 'success',
                value: importData,
                label: 'User successfully imported ICS feed into ABE',
            });
            alert('ICS imported successfully');
        },
        importFailed: (error, importData) => {
            ga.event({
                category: 'ICS Feed Import',
                variable: 'failure',
                value: JSON.stringify({ error, importData }),
                label: 'ICS feed import into ABE failed',
            });
            alert('ICS import failed:\n' + error);
        },
    };
};

// Connect props to Redux state and actions
const ImportContainer = connect(mapStateToProps, mapDispatchToProps)(ImportScene);

export default ImportContainer;
