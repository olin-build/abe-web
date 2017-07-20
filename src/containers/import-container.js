import { connect } from 'react-redux';
import { setSidebarMode } from '../data/actions';
import ImportScene from '../scenes/Import/import.jsx';

const mapStateToProps = state => {
    return {
        labels: Object.values(state.labels).map((label) => {return label.name})
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setSidebarMode: mode => {
            dispatch(setSidebarMode(mode));
        }
    }
};

// Connect props to Redux state and actions
const ImportContainer = connect(mapStateToProps, mapDispatchToProps)(ImportScene);

export default ImportContainer;