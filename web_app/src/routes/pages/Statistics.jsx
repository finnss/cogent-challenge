import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Grid, Tab, Tabs, Typography } from '@mui/material';
import '/style/statistics.scss';
import '/style/tabcontainer.scss';

import { getStatistics } from '/modules/statistics';
import Container from '/components/Container';
import Loading from '../../components/common/Loading';
import RiskAssessmentStats from '/components/stats/RiskAssessmentStats';
import MeasureStats from '/components/stats/MeasureStats';
import DistrictStats from '/components/stats/DistrictStats';
import PersonalStats from '/components/stats/PersonalStats';
import { getDistricts } from '/modules/districts';

const TABS = {
  PERSONAL: { url: 'personal', title_key: 'personal' },
  RISK_ASSESSMENTS: { url: 'riskAssessments', title_key: 'risk_assessments' },
  MEASURES: { url: 'measures', title_key: 'measures' },
  DISTRICTS: { url: 'districts', title_key: 'districts' },
};

const Statistics = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const statistics = useSelector((state) => state.statistics.statistics);
  const isLoading = useSelector((state) => state.statistics.loading);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState();
  const districts = useSelector((state) => state.districts.districts);

  useEffect(() => {
    dispatch(getDistricts(true));
  }, []);

  const createSearchParamString = (searchParams, startOfParams = true) => {
    const paramCopy = new URLSearchParams(searchParams);
    if (paramCopy.has('tab')) paramCopy.delete('tab');
    return paramCopy.toString().length > 0 ? `${startOfParams ? '?' : '&'}${paramCopy.toString()}` : '';
  };

  useEffect(() => {
    if (tab && (!window.location.search || !window.location.search?.includes(tab))) {
      navigate(`/statistics?tab=${tab}${createSearchParamString(searchParams, false)}`);
    }
  }, [tab]);

  // Handle Tab and Query Param changes
  useEffect(() => {
    const tabSearch = searchParams?.get('tab');
    const requestedTab = tabSearch?.includes('?') ? tabSearch.split('?')[0] : tabSearch;
    if (requestedTab) {
      // If the user tries accessing a statistics tab that doesn't exist, redirect them to the default personal stats.
      if (
        !Object.values(TABS)
          .map((t) => t.url)
          .includes(requestedTab)
      ) {
        setTab(TABS.PERSONAL.url);
      } else if (!currentUser?.permissions?.includes('statistics_read_all')) {
        // Also deny any attempt to access any other tab than personal if the user doesn't have extended permissions.
        // In that scenario, we also need to handle the backend call here.
        setTab(TABS.PERSONAL.url);
        dispatch(getStatistics(TABS.PERSONAL.url, true));
      } else {
        // The user requested a valid tab, or search params changed (for instance, time range filter was updated). Fetch
        // the appropriate statistics backend, which is dependent on both tab and any optional filters. If tab changed,
        // switch which child component to render through the "tab" state.
        const searchParamString = createSearchParamString(searchParams);
        dispatch(getStatistics(`${requestedTab}${searchParamString}`, true));
        if (requestedTab !== tab) setTab(requestedTab);
      }
    } else if (!tab) {
      // When accessing statistics without providing any tab, automatically redirect to the default personal stats.
      setTab(TABS.PERSONAL.url);
    }
  }, [searchParams]);

  const breadcrumbs = useMemo(
    () => [
      { title: t('common.actions.search'), path: '/' },
      { title: t('routes.statistics.page_title'), path: '/statistics' },
    ],
    []
  );

  // When a user updates any filters using the provided inputs such as selects and check boxes, set those
  // filters in the current page's search params (query params, ie `baseurl&someVar=1&otherVar=2`). This
  // lets users share links to statistics including any filters they set, store those filtered stats as a
  // bookmark, etc.
  // Note that although this is the function called when a user edits any filter, no backend calls happen directly.
  // Instead, the above useEffect listens for changes to the search params, and only when they are updated do we
  // perform backend / state logic.
  const onUpdateFilters = async (newFilters) => {
    setSearchParams((existingFilters) => {
      Object.keys(newFilters).forEach((key) => {
        if ((newFilters[key] === '' || newFilters[key] === null) && existingFilters.get(key) !== undefined) {
          existingFilters.delete(key);
        } else {
          existingFilters.set(key, newFilters[key]);
        }
      });
      return existingFilters;
    });
  };

  const onClickNewTab = (e, tab) => {
    setTab(tab);
    setSearchParams(new URLSearchParams(`tab=${tab}`));
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams(`tab=${tab}`));
  };

  const TabComponent = useMemo(
    () =>
      ({
        [TABS.PERSONAL.url]: PersonalStats,
        [TABS.RISK_ASSESSMENTS.url]: RiskAssessmentStats,
        [TABS.MEASURES.url]: MeasureStats,
        [TABS.DISTRICTS.url]: DistrictStats,
      }[tab]),
    [tab]
  );

  if (isLoading || !statistics || !tab) {
    return (
      <Container showErrorPage pageTitle={t('routes.statistics.page_title')}>
        <Loading />
      </Container>
    );
  }

  return (
    <Container pageTitle={t('routes.statistics.page_title')} breadcrumbs={breadcrumbs}>
      <Grid container spacing={4} className='Statistics'>
        <Grid item xs={12}>
          <Typography variant='h4'>{t('routes.statistics.page_title')}</Typography>
        </Grid>

        {currentUser?.permissions?.includes('statistics_read_all') && (
          <Grid item xs={12} className='TabContainer'>
            <Tabs value={tab} onChange={onClickNewTab}>
              {Object.values(TABS).map((tabOption) => (
                <Tab
                  key={tabOption.url}
                  value={tabOption.url}
                  label={t(`routes.statistics.tab_${tabOption.title_key}`)}
                  className='Tab'
                />
              ))}
            </Tabs>
          </Grid>
        )}

        <Grid item xs={12}>
          <TabComponent
            stats={statistics}
            onUpdateFilters={onUpdateFilters}
            districts={districts}
            resetFilters={resetFilters}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(Statistics);
