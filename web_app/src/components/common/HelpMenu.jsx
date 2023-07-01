import { useEffect, useState } from 'react';
import { MenuItem, ListItemText, ListItemIcon, Typography, IconButton, Divider, Popover } from '@mui/material';
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  FeedbackOutlined as FeedbackOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
} from '@mui/icons-material';
import { marked } from 'marked';
import { sanitize } from 'dompurify';
import { useTranslation } from 'react-i18next';
import '/style/help.scss';
import PropTypes from 'prop-types';
import Feedback from '/components/common/Feedback';
import { getHelpCategories } from '/routes/pages/HelpAdmin';
import { useDispatch, useSelector } from 'react-redux';
import { getHelpPages } from '/modules/help';
import Link from '/components/common/Link';

function HelpMenu({ anchor, handleClose }) {
  const dispatch = useDispatch();
  const helpPages = useSelector((state) => state.help.helpPages);
  const isLoading = useSelector((state) => state.help.loading);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const { t } = useTranslation();
  const [currentSelection, setCurrentSelection] = useState();
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

  useEffect(() => {
    dispatch(getHelpPages());
  }, []);

  if (!helpPages || isLoading) {
    return null;
  }

  const sendFeedback = () => {
    setShowFeedbackPopup(true);
  };

  const onClose = () => {
    setCurrentSelection(undefined);
    handleClose();
  };

  const categories = getHelpCategories(t);
  const currentPath = window.location.pathname;
  const pathParts = currentPath.split('/').filter(Boolean);
  let detectedCategory;
  // If we are dealing with risk assessment, use special logic to find the appropriate help pages for
  // whatever step we're showing
  if (pathParts?.includes('steps')) {
    const stepNr = pathParts[3];
    const riskAssessmentStepCategories = categories?.find((cat) => cat?.slug === 'riskAssessments');
    detectedCategory = riskAssessmentStepCategories?.subcategories.find((cat) => cat?.slug === `step${stepNr}`);
  } else {
    detectedCategory = categories?.find((cat) => cat?.slug === (pathParts.length === 0 ? 'search' : pathParts[0]));
  }
  const menuItems = helpPages?.filter((helpPage) => helpPage?.slug === detectedCategory?.slug);

  return (
    <Popover
      className='HelpMenu'
      open={Boolean(anchor)}
      anchorEl={anchor}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={onClose}>
      {currentSelection ? (
        <>
          <div className='HelpContentTitleBar'>
            <IconButton onClick={() => setCurrentSelection(undefined)}>
              <KeyboardArrowLeftIcon sx={{ fontSize: '30px' }} />
            </IconButton>
            <Typography className='HelpMenuTitle' variant='h6'>
              {currentSelection.title}
            </Typography>
          </div>
          <div
            className='HelpMarkdownContent'
            dangerouslySetInnerHTML={{ __html: sanitize(marked(currentSelection.content)) }}
          />
        </>
      ) : (
        <>
          <Typography className='HelpMenuTitle' variant='h6'>
            {t('routes.help.help_page')}
          </Typography>
          <MenuItemElements menuItems={menuItems} setCurrentSelection={setCurrentSelection} />

          {currentUser?.permissions?.includes('help_write') && (
            <Link to='/helpAdmin' className='HelpAdminLink'>
              {t('routes.help.admin_link')}
            </Link>
          )}
        </>
      )}

      <Divider />
      <MenuItem key='feedback' className='HelpMenuListItem' onClick={sendFeedback}>
        <ListItemIcon>
          <FeedbackOutlinedIcon />
        </ListItemIcon>
        <ListItemText>{t('routes.help.send_feedback')}</ListItemText>
      </MenuItem>

      <Feedback
        open={showFeedbackPopup}
        onClose={() => {
          setShowFeedbackPopup(false);
          handleClose();
        }}
      />
    </Popover>
  );
}

HelpMenu.propTypes = {
  anchor: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};

const MenuItemElements = ({ menuItems, setCurrentSelection }) => {
  const { t } = useTranslation();

  if (menuItems == null || menuItems.length === 0) {
    return (
      <MenuItem key='no_help' disabled className='CustomDisabled NoHelp'>
        <Typography variant='body2'>{t('routes.help.no_help')}</Typography>
      </MenuItem>
    );
  }

  return menuItems
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((menuItem) => (
      <MenuItem key={menuItem.title} className='HelpMenuListItem' onClick={() => setCurrentSelection(menuItem)}>
        <ListItemIcon>
          <DescriptionOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary={menuItem.title} secondary={menuItem.description} />
      </MenuItem>
    ));
};

MenuItemElements.propTypes = {
  menuItems: PropTypes.arrayOf(PropTypes.object),
  setCurrentSelection: PropTypes.func.isRequired,
};

export default HelpMenu;
