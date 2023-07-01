import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LOGIN_SUCCESS } from '/modules/auth';
import ErrorPage from '/routes/common/ErrorPage';
import Container from '/components/Container';

/**
 * Wraps routes that are only available for logged in users and/or users who have specific roles
 * Redirects user back to login page if logged out
 * @returns {JSX.Element}
 */
const ProtectedRoute = ({ requiredPermissions }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  let currentUser = useSelector((state) => state.auth.currentUser);

  if (!isLoggedIn) {
    // FIXME: Could the be a security hole? Could someone add a user to localStorage manually,
    //  or edit their roles to gain access, etc? Would only be frontend, not API access, but still? (finnss)
    const currentUserFromLocalStorage = window.localStorage.getItem('currentUser');
    if (currentUserFromLocalStorage) {
      try {
        currentUser = JSON.parse(currentUserFromLocalStorage);
        // The user is logged in previously (found in localstorage), update Redux.
        dispatch({ type: LOGIN_SUCCESS, currentUser });
      } catch (e) {
        // Invalid JSON format of the currentUser in localStorage
        window.localStorage.removeItem('currentUser');
        return <Navigate to='/login' state={{ from: location.pathname }} />;
      }
    } else {
      // Redirect to login page if not logged in
      return <Navigate to='/login' state={{ from: location.pathname }} />;
    }
  }

  if (requiredPermissions) {
    // Check required permissions
    const allowed =
      requiredPermissions.filter((permission) => currentUser?.permissions?.includes(permission)).length ===
      requiredPermissions.length;

    // If from from login, but user does not have access to the page, then redirect to homepage
    if (!allowed && location.state?.from === 'login') {
      return <Navigate to='/' />;
    }

    return allowed ? (
      <Outlet />
    ) : (
      <Container showErrorPage>
        <ErrorPage statusCode={403} />
      </Container>
    );
  } else {
    // No permission requirements and the user is logged in, so auth check OK.
    return <Outlet />;
  }
};

ProtectedRoute.propTypes = {
  location: PropTypes.object,
  requiredPermissions: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
