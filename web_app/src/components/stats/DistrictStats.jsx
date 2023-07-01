/* eslint-disable react/prop-types */
import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { Button, FormControl, FormHelperText, Grid, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import '../../style/statistics.scss';

import Table from '../table/Table';

const DistrictStats = ({ stats, onUpdateFilters, districts, resetFilters }) => {
  const { t } = useTranslation();
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
        Header: t('common.strings.district'),
        accessor: (stat) =>
          districts?.find((district) => district.id === stat.districtId)?.shortName || t('errors.unknown'),
        Cell: ({ cell }) => <Typography variant='body2'>{cell.value}</Typography>,
      },
      { Header: t('routes.statistics.num_assessments'), accessor: 'numRiskAssessments' },
      { Header: t('routes.statistics.num_cases'), accessor: 'numCases' },
      { Header: t('routes.statistics.num_h'), accessor: 'numHighRisk' },
      { Header: t('routes.statistics.num_m'), accessor: 'numModerateRisk' },
      { Header: t('routes.statistics.num_l'), accessor: 'numLowRisk' },
      { Header: t('routes.statistics.num_repeated_violence'), accessor: 'numRepeatedViolence' },
      { Header: t('routes.statistics.num_ten_day_breaks'), accessor: 'numTenDayBreaks' },
    ],
    [districts]
  );

  // Because the backend sends stats for this particular page as an object rather than a list, we need
  // to manipulate it slightly before rendering.
  const tableRows = useMemo(
    () =>
      stats?.riskAssessmentStatsPerDistrict
        ? Object.keys(stats?.riskAssessmentStatsPerDistrict).map((districtId) => ({
            districtId: Number(districtId),
            ...stats.riskAssessmentStatsPerDistrict[districtId],
          }))
        : [],
    [stats]
  );

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
      </Grid>

      {tableRows?.length > 0 ? (
        <Grid item xs={12} style={{ width: '100%', maxWidth: '1400px' }} marginTop={1} paddingTop={1}>
          <Table
            title={t('routes.statistics.tab_risk_assessments')}
            subtitle={t('routes.statistics.eval_help_text')}
            columns={columns}
            data={tableRows}
            defaultSort={{ id: 'numRiskAssessments', desc: true }}
            dense
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

DistrictStats.propTypes = {
  stats: PropTypes.object,
  onUpdateFilters: PropTypes.func,
  districts: PropTypes.arrayOf(PropTypes.object),
};

export default React.memo(DistrictStats);
