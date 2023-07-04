import PropTypes from 'prop-types';
import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { Link as RouterLink, generatePath, useParams, useLocation } from 'react-router-dom';
import { truncate } from '/util';
import '/style/breadcrumbs.scss';
import Link from '/components/common/Link';

/**
 * Links that display at the top of a page if it is not a top-level route, and
 * allows the user to go back to a previous page. Which links are shown is based
 * on the routing hierarchy defined in the files under '/routes'.
 */
function Breadcrumbs({ routes }) {
  const params = useParams();
  const location = useLocation();

  return (
    <MuiBreadcrumbs className='Breadcrumbs' separator={<NavigateNextIcon />}>
      {(routes || []).map((route, index) => {
        const title = truncate(route.title);
        const link = generatePath(route.path, params);
        const isActive = location.pathname === link;

        return isActive ? (
          <Typography key={route.path} className='Active'>
            {title}
          </Typography>
        ) : (
          <Link key={route.path} component={RouterLink} className='Inactive' to={link} replace>
            {title}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}

Breadcrumbs.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
};

export default Breadcrumbs;
