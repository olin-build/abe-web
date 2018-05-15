import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ adapter: new Adapter() });

jest.mock('moment', () => {
  const moment = require.requireActual('moment-timezone');
  moment.tz.setDefault('America/New_York');
  return moment;
});
