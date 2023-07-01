import { memo } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import Loading from '/components/common/Loading';
import '/style/loadingoverlay.scss';

const transition = {
  entering: { opacity: 1, zIndex: 9999 },
  entered: { opacity: 1, zIndex: 9999 },
  exiting: { pointerEvents: 'none', opacity: 0 },
  exited: { pointerEvents: 'none', opacity: 0 },
};

/**
 * A loading indicator that can be displayed over other components as an overlay.
 * Can be used for example when fetching data, and disallowing the user to interact with
 * the component while the data is being fetched.
 * @returns {JSX.Element}
 */
const LoadingOverlay = ({ show }) => {
  return (
    <Transition in={show} timeout={250}>
      {(state) => <Loading className='LoadingOverlay' sx={transition[state]} />}
    </Transition>
  );
};

LoadingOverlay.propTypes = {
  show: PropTypes.bool,
};

LoadingOverlay.defaultProps = {
  show: false,
};

export default memo(LoadingOverlay);
