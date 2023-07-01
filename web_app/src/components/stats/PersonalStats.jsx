/* eslint-disable react/prop-types */
import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Button, FormControl, FormHelperText, Grid, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import '../../style/statistics.scss';

import Table from '../table/Table';
import { formatAdminBids, formatDate } from '../../util/formatters';
import { formatRiskAssessmentResultSummary, prepadZeroes, renderCaseMembers } from '../../util';

const PersonalStats = ({ stats, onUpdateFilters, districts, resetFilters }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [searchParams] = useSearchParams();

  // Make sure any query params already present when initially loading the page are reflected in state.
  // Also responsible for keeping state updated, as any changes to filters initially only happen through params.
  useEffect(() => {
    if (searchParams?.get('startTime')) setStartTime(searchParams?.get('startTime'));
    else setStartTime(null);
    if (searchParams?.get('endTime')) setEndTime(searchParams?.get('endTime'));
    else setEndTime(null);
  }, [searchParams]);

  const columns = useMemo(
    () => [
      {
        Header: t('routes.cases.case_id'),
        accessor: (ra) => `S${prepadZeroes(ra.case.id)}`,
        Cell: ({ cell }) => (
          <Typography variant='body2' className='WeakText'>
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: t('common.strings.denomination'),
        accessor: 'nearFutureRisk',
        Cell: ({ cell }) =>
          formatRiskAssessmentResultSummary(t, {
            nearFutureRisk: cell?.row.original.nearFutureRisk,
            severeViolenceRisk: cell?.row.original.severeViolenceRisk,
          }),
      },
      {
        Header: t('common.strings.performed'),
        accessor: 'completedAt',
        Cell: ({ cell }) => (
          <div>
            <Typography variant='body2'>{cell.value ? formatDate(cell.value) : t('errors.incomplete')}</Typography>
            <Typography variant='body2'>{formatAdminBids(cell?.row?.original.adminBids)}</Typography>
          </div>
        ),
      },
      {
        Header: t('common.strings.district'),
        accessor: (ra) =>
          districts?.find((district) => district.id === ra.districtId)?.shortName || t('errors.unknown'),

        Cell: ({ cell }) => <Typography variant='body2'>{cell.value}</Typography>,
      },
      {
        Header: t('common.strings.geographical_unit'),
        accessor: (ra) =>
          districts
            ?.find((district) => district.id === ra.districtId)
            ?.geographicalUnits.find((unit) => unit.id === ra.geographicalUnitId)?.name || t('errors.unknown'),

        Cell: ({ cell }) => <Typography variant='body2'>{cell.value}</Typography>,
      },
      {
        Header: t('routes.assessments.assessment_id'),
        accessor: (ra) => `V${prepadZeroes(ra.id)}`,
        Cell: ({ cell }) => (
          <Typography variant='body2' className='WeakText'>
            {cell.value}
          </Typography>
        ),
      },
    ],
    [districts]
  );

  const keyNumbers = useMemo(() => {
    if (stats?.keyNumbers && t)
      return [
        { translation: 'assessments', statKey: 'numRiskAssessments' },
        { translation: 'cases', statKey: 'numCases' },
        { translation: 'h', statKey: 'numHighRisk' },
        { translation: 'm', statKey: 'numModerateRisk' },
        { translation: 'l', statKey: 'numLowRisk' },
        { translation: 'repeated_violence', statKey: 'numRepeatedViolence' },
        { translation: 'ten_day_breaks', statKey: 'numTenDayBreaks' },
      ].map((key) => (
        <Typography variant='body2' key={key.translation}>
          {t(`routes.statistics.num_${key.translation}`)}: <b>{stats?.keyNumbers[key.statKey]}</b>
        </Typography>
      ));
  }, [t, stats]);

  return (
    <Grid container spacing={4} flexDirection='column'>
      <Grid item xs={12} className='ClearFilter'>
        <Button variant='text' onClick={resetFilters} disabled={searchParams?.size <= 1}>
          {t('routes.statistics.clear_filter')}
        </Button>
      </Grid>

      <Grid item xs={12} container flexDirection='row' spacing={3} style={{ paddingTop: 0 }}>
        <Grid item>
          <FormControl>
            <DatePicker
              value={startTime ? dayjs(Number(startTime)) : null}
              label={t('common.strings.start_date')}
              onChange={(newValue) => onUpdateFilters({ startTime: newValue.valueOf() })}
              views={['year', 'month', 'day']}
              openTo='day'
            />
            <FormHelperText className='WeakText'>{t('routes.statistics.start_date_helper')}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item>
          <DatePicker
            value={endTime ? dayjs(Number(endTime)) : null}
            label={t('common.strings.end_date')}
            onChange={(newValue) => onUpdateFilters({ endTime: newValue.valueOf() })}
            views={['year', 'month', 'day']}
            openTo='day'
          />
        </Grid>

        <Grid item>
          <TextField disabled label={t('common.strings.bid')} value={currentUser?.bid} />
        </Grid>
      </Grid>

      <Grid item xs={12} className='KeyNumbers'>
        {keyNumbers}
      </Grid>

      <Grid item xs={12} style={{ paddingTop: 0 }} marginBottom={2}>
        <Typography variant='body2' className='WeakText'>
          {t('routes.statistics.eval_help_text')}
        </Typography>
      </Grid>

      {stats?.riskAssessments?.length > 0 ? (
        <Grid item xs={12} style={{ width: '100%', maxWidth: '1100px' }}>
          <Table
            title={t('routes.statistics.tab_risk_assessments')}
            columns={columns}
            data={stats?.riskAssessments || []}
            defaultSort={{ id: 'createdAt', desc: false }}
            dense
            onClick={(e, row) =>
              row?.original?.id &&
              navigate(
                row.original.completed
                  ? `/riskAssessments/${row.original.id}/steps/9/summary`
                  : `/riskAssessments/${row.original.id}/steps/1/information`,
                {
                  state: { from: location.pathname },
                }
              )
            }
            includeCsvDownload
          />
        </Grid>
      ) : (
        <Grid item xs={12} className='NoResults'>
          <Typography className='WeakText NoResultsDesc'>{t('routes.statistics.no_results_desc')}</Typography>
        </Grid>
      )}
    </Grid>
  );
};

PersonalStats.propTypes = {
  stats: PropTypes.object,
  onUpdateFilters: PropTypes.func,
  districts: PropTypes.arrayOf(PropTypes.object),
};

export default React.memo(PersonalStats);
