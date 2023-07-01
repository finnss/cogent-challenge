import { useState, useMemo, memo, useEffect } from 'react';
import { Typography, Grid, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Edit as EditIcon,
  EditOutlined as EditOutlinedIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from '@mui/icons-material';
import '/style/help.scss';

import HelpAdminForm from '/components/admin/HelpAdminForm';
import { deleteHelpPage, updateHelpPage, addHelpPage, getHelpPages } from '/modules/help';
import Container from '/components/Container';
import { TreeItem, TreeView } from '@mui/lab';
import { showToast } from '/modules/toast';

// FIXME: Do not hardcode somehow?
export const getHelpCategories = (t) => [
  {
    slug: 'search',
    label: t('routes.search.page_title'),
  },
  {
    slug: 'persons',
    label: t('common.strings.persons'),
  },
  {
    slug: 'cases',
    label: t('common.strings.cases'),
  },
  {
    slug: 'riskAssessments',
    label: t('common.strings.risk_assessments'),
    subcategories: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((stepNr) => ({
      slug: `step${stepNr}`,
      label: t(`routes.help.step_label_${stepNr}`),
    })),
  },
  {
    slug: 'statistics',
    label: t('routes.statistics.page_title'),
  },
];

/**
 * For creating, editing or deleting User Help pages.
 * @returns {JSX.Element}
 */
function HelpAdmin() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const helpPages = useSelector((state) => state.help.helpPages);
  const [isFormPristine, setIsFormPristine] = useState(true);
  const [currentlyEditingPage, setCurrentlyEditingPage] = useState();

  useEffect(() => {
    dispatch(getHelpPages());
  }, []);

  const onSave = async (values) => {
    const saved = await dispatch(currentlyEditingPage?.id ? updateHelpPage(values) : addHelpPage(values));
    if (saved) {
      // When saved, the module function shows a Toast. We set the
      // current page to undefined so that the form is no longer visible
      // and it's obvious editing is done.
      setCurrentlyEditingPage(undefined);
      setIsFormPristine(true);
      dispatch(showToast(t(`routes.help.${currentlyEditingPage?.id ? 'updated' : 'created'}_help`)));
    }
  };

  const onDelete = async () => {
    if (currentlyEditingPage?.id) {
      await dispatch(deleteHelpPage(currentlyEditingPage.id));
    }
    setCurrentlyEditingPage(undefined);
    setIsFormPristine(true);
    dispatch(showToast(t('routes.help.deleted_help')));
  };

  // Asks a user if they are sure they want to change which help page
  // they are editing if the current one has unsaved changes
  const onStartEdit = (helpPage) => {
    if (!isFormPristine) {
      if (confirm(t('routes.help.discard_changes'))) {
        setCurrentlyEditingPage(helpPage);
      }
    } else {
      setCurrentlyEditingPage(helpPage);
    }
    setIsFormPristine(true);
  };

  const breadcrumbs = [
    { title: t('common.actions.search'), path: '/' },
    { title: t('routes.help.page_title'), path: '/helpAdmin' },
  ];

  const categories = useMemo(() => getHelpCategories(t));

  return (
    <Container pageTitle={t('routes.help.page_title')} breadcrumbs={breadcrumbs}>
      <Grid container spacing={6}>
        <Grid item xs={4}>
          <Typography variant='h5'>{t('routes.help.page_title')}</Typography>
          <Typography variant='body2' className='HelpAdminDesc'>
            {t('routes.help.help_desc')}
          </Typography>

          <HelpCategoriesTree
            categories={categories}
            currentlyEditingPage={currentlyEditingPage}
            onStartEdit={onStartEdit}
            helpPages={helpPages}
          />
        </Grid>

        {currentlyEditingPage && (
          <Grid item xs={8}>
            <HelpAdminForm
              isFormPristine={isFormPristine}
              setIsFormPristine={setIsFormPristine}
              helpPage={currentlyEditingPage}
              onSave={onSave}
              onDelete={onDelete}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

const HelpCategoriesTree = ({ categories, currentlyEditingPage, onStartEdit, helpPages }) => {
  const { t } = useTranslation();

  const renderBackendHelpPagesForCategory = ({ category, key }) => {
    const relevantBackendHelpPages = helpPages
      .filter((page) => page.slug === category.slug)
      .map((page) => ({ ...page, slug: category.slug }))
      .sort((a, b) => a.title.localeCompare(b.title));

    const helpPagesWithNewButton = [
      ...relevantBackendHelpPages,
      { title: t('routes.help.new_help'), slug: category.slug },
    ];

    return helpPagesWithNewButton.map((helpPage) => (
      <BackendHelpPage
        key={`${key}-${helpPage.id}`}
        helpPage={helpPage}
        currentlyEditingPage={currentlyEditingPage}
        onStartEdit={onStartEdit}
      />
    ));
  };

  return (
    <TreeView
      className='HelpAdminTree'
      defaultCollapseIcon={<KeyboardArrowUpIcon />}
      defaultExpandIcon={<KeyboardArrowDownIcon />}
      multiSelect={false}>
      {categories.map((category, i) => (
        <TreeItem
          key={category.slug}
          nodeId={category.slug}
          label={category.label}
          className='HelpAdminTreeCategory HoverBG'>
          {category.subcategories?.length > 0
            ? category.subcategories.map((subcategory) => (
                <TreeItem
                  key={subcategory.slug}
                  nodeId={subcategory.slug}
                  label={subcategory.label}
                  className='HelpAdminTreeSubcategory HoverBG'>
                  {renderBackendHelpPagesForCategory({
                    category: subcategory,
                    key: `${category.slug}-${subcategory.slug}-${i}`,
                  })}
                </TreeItem>
              ))
            : renderBackendHelpPagesForCategory({ category, key: `${category.slug}-${i}` })}
        </TreeItem>
      ))}
    </TreeView>
  );
};

const BackendHelpPage = memo(({ helpPage, currentlyEditingPage, onStartEdit }) => {
  const { t } = useTranslation();

  const isCurrentEditingPage =
    currentlyEditingPage &&
    helpPage.slug === currentlyEditingPage.slug &&
    helpPage.title === currentlyEditingPage.title;

  return (
    <div className='HelpAdminTreeLeaf HoverBG'>
      <div className='HelpMenuListItem HelpMenuAdminListItem'>
        <Typography variant='body1'>{helpPage.title}</Typography>
        {helpPage.description && (
          <Typography variant='body2' className='HelpDescription'>
            {helpPage.description}
          </Typography>
        )}
      </div>
      <div className='HelpAdminButtonContainer'>
        <IconButton
          onClick={() => onStartEdit(helpPage)}
          className={`HelpAdminButton ${isCurrentEditingPage ? 'HelpAdminEditing' : ''}`}>
          {helpPage.title === t('routes.help.new_help') ? (
            <AddCircleOutlineIcon />
          ) : isCurrentEditingPage ? (
            <EditOutlinedIcon />
          ) : (
            <EditIcon />
          )}
        </IconButton>
      </div>
    </div>
  );
});

HelpCategoriesTree.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentlyEditingPage: PropTypes.object,
  onStartEdit: PropTypes.func.isRequired,
  helpPages: PropTypes.arrayOf(PropTypes.object).isRequired,
};

BackendHelpPage.propTypes = {
  helpPage: PropTypes.object.isRequired,
  currentlyEditingPage: PropTypes.object,
  onStartEdit: PropTypes.func.isRequired,
};

export default memo(HelpAdmin);
