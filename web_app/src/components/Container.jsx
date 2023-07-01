import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import AppBar from './AppBar';
import Footer from './Footer';
import clsx from 'clsx';
import Toast from '/components/Toast';
import { clearError } from '/modules/errorHandler';
import { dismissToast } from '/modules/toast';
import ErrorPage from '/routes/common/ErrorPage';

/**
 * Container component that wraps a page
 * Displays AppBar and Footer around the content. Adds breadcrumbs if present.
 *
 * @param {{ pageTitle: string }}
 * @param {{ className: string }}
 * @param {{ pageClassName: string }}
 * @param {{ contentClassName: string }}
 * @param {{ children: JSX.Element }}
 * @returns {JSX.Element} Container
 */
const Container = ({ pageTitle, className, pageClassName, contentClassName, showErrorPage, children }) => {
  const pageDivRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const logoUrl = useSelector((state) => state.theme.logo);
  const title = useSelector((state) => state.theme.title);
  const errorStatusForPage = useSelector((state) => state.errors.errorStatusForPage);
  const toast = useSelector((state) => state.toast.toast);

  useEffect(() => {
    document.title =
      title +
      (pageTitle && typeof pageTitle === 'string'
        ? ` - ${pageTitle}`
        : typeof pageTitle === 'func'
        ? ` - ${pageTitle(t)}}`
        : '');
    dispatch(clearError());
    if (toast?.variant === 'error') dispatch(dismissToast());
  }, [pageTitle]);

  useEffect(() => {
    pageDivRef.current?.scrollTo(0, 0);
  }, [pageTitle]);

  const errorPage = useMemo(() => {
    if (showErrorPage && errorStatusForPage) {
      const validErrorCodesForErrorPage = [401, 403, 404, 500, 'timeout'];
      const statusCode = validErrorCodesForErrorPage.includes(errorStatusForPage) ? errorStatusForPage : 'generic';
      document.title = t(`common.states.text_${statusCode}`);
      return <ErrorPage statusCode={statusCode} />;
    }
    return undefined;
  }, [showErrorPage, errorStatusForPage]);

  return (
    <div className={clsx('Container', className)}>
      <AppBar title={title} logoUrl={logoUrl} />
      <div className={clsx('Page', pageClassName)} ref={pageDivRef}>
        <div className={clsx('Content', contentClassName)}>{errorPage || children}</div>
        <Footer />
      </div>
      <Toast />
    </div>
  );
};

Container.propTypes = {
  pageTitle: PropTypes.string,
  className: PropTypes.string,
  pageClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  showErrorPage: PropTypes.bool,
  children: PropTypes.any,
};

Container.defaultProps = {
  pageTitle: '',
  showErrorPage: false,
};

export default Container;
