/* eslint-disable react/prop-types */
import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import '../../style/statistics.scss';

import Table from '../table/Table';

export const MEASURE_CATEGORIES = {
  POLICE: 'police',
  HEALTH: 'health',
  OFFICIAL: 'official',
  OTHER: 'other',
};

export const MEASURE_SORT_ORDER = [
  'follow_up_conversation',
  'guidance',
  'visitation_ban',
  'child_care_services',
  'mva',
  'ova',
  'concern_message',
  'cross_department_meeting',
  'relocation',
  'address_block',
  'other',
];

const MeasureStats = ({ stats, onUpdateFilters, districts, resetFilters }) => {
  const { t } = useTranslation();
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [districtId, setDistrictId] = useState('');
  const [geographicalUnitId, setGeographicalUnitId] = useState('');
  const [category, setCategory] = useState('');
  const [includeAggressor, setIncludeAggressor] = useState();
  const [includeVictim, setIncludeVictim] = useState();
  const [searchParams] = useSearchParams();

  // We want to include stats for both aggressor and victim by default, so when the user navigates to
  // this page without any query params indicating otherwise, immediately set those filters to true.
  useEffect(() => {
    if (
      includeAggressor === undefined &&
      includeVictim === undefined &&
      !searchParams?.get('includeAggressor') &&
      !searchParams?.get('includeVictim')
    ) {
      onUpdateFilters({ includeAggressor: true, includeVictim: true });
    }
  }, []);

  // Make sure any query params already present when initially loading the page are reflected in state.
  // Also responsible for keeping state updated, as any changes to filters initially only happen through params.
  useEffect(() => {
    if (searchParams?.get('startTime')) setStartTime(searchParams?.get('startTime'));
    else setStartTime(null);
    if (searchParams?.get('endTime')) setEndTime(searchParams?.get('endTime'));
    else setEndTime(null);
    if (searchParams?.get('districtId')) setDistrictId(searchParams?.get('districtId'));
    else setDistrictId('');
    if (searchParams?.get('geographicalUnitId')) setGeographicalUnitId(searchParams?.get('geographicalUnitId'));
    else setGeographicalUnitId('');
    if (searchParams?.get('category')) setCategory(searchParams?.get('category'));
    else setCategory('');
    if (searchParams?.get('includeAggressor')) setIncludeAggressor(searchParams?.get('includeAggressor') === 'true');
    else {
      setIncludeAggressor(true);
      onUpdateFilters({ includeAggressor: true });
    }
    if (searchParams?.get('includeVictim')) setIncludeVictim(searchParams?.get('includeVictim') === 'true');
    else {
      setIncludeVictim(true);
      onUpdateFilters({ includeVictim: true });
    }
  }, [searchParams]);

  const columns = useMemo(
    () => [
      {
        Header: t('common.strings.type'),
        accessor: (measure) => t(`preventive_measures.${measure.type}`),
        Cell: ({ cell }) => <Typography variant='body2'>{cell.value}</Typography>,
      },
      {
        Header: t('common.strings.amount'),
        accessor: 'amount',
        Cell: ({ cell }) => <Typography variant='body2'>{cell.value}</Typography>,
        colWidth: '40%',
      },
    ],
    []
  );

  // Because the backend sends stats for this particular page as an object rather than a list, we need
  // to manipulate it slightly before rendering.
  const tableRows = useMemo(
    () =>
      stats?.numSuggestedMeasures
        ? Object.keys(stats?.numSuggestedMeasures)
            .sort((a, b) => MEASURE_SORT_ORDER.indexOf(b) - MEASURE_SORT_ORDER.indexOf(a))
            .map((key) => ({
              type: key,
              amount: stats?.numSuggestedMeasures[key],
            }))
        : [],
    [stats]
  );

  return (
    <Grid container spacing={4} flexDirection='column'>
      <Grid item xs={12} className='ClearFilter'>
        <Button
          variant='text'
          onClick={resetFilters}
          disabled={
            searchParams?.size <= 1 ||
            (searchParams?.size === 3 &&
              searchParams.get('includeAggressor') === 'true' &&
              searchParams.get('includeVictim') === 'true')
          }>
          {t('routes.statistics.clear_filter')}
        </Button>
      </Grid>

      <Grid item xs={12} container flexDirection='row' spacing={3} className='MeasureFilters'>
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
          <FormControl>
            <InputLabel id='districtSelectLabel'>{t('common.strings.district')}</InputLabel>
            <Select
              label={t('common.strings.district')}
              labelId={'districtSelectLabel'}
              value={districtId}
              style={{ width: '100%', minWidth: '200px' }}
              onChange={(e) => onUpdateFilters({ districtId: e.target.value })}
              size='small'>
              {(districts || []).map((district) => (
                <MenuItem key={district?.id} value={district?.id}>
                  {district?.shortName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl disabled={!districtId}>
            <InputLabel id='geographicalUnitSelectLabel'>{t('common.strings.geographical_unit')}</InputLabel>
            <Select
              label={t('common.strings.district')}
              labelId={'geographicalUnitLabel'}
              value={geographicalUnitId}
              style={{ width: '100%', minWidth: '200px' }}
              onChange={(e) => onUpdateFilters({ geographicalUnitId: e.target.value })}
              size='small'>
              {(districts?.find((d) => d.id === Number(districtId))?.geographicalUnits || []).map((unit) => (
                <MenuItem key={unit?.id} value={unit?.id}>
                  {unit?.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText className='WeakText'>
              {!districtId ? t('routes.statistics.choose_district_first') : ' '}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl>
            <InputLabel id='categorySelectLabel'>{t('common.strings.category')}</InputLabel>
            <Select
              label={t('common.strings.category')}
              labelId={'categorySelectLabel'}
              value={category}
              style={{ width: '100%', minWidth: '200px' }}
              onChange={(e) => onUpdateFilters({ category: e.target.value })}
              size='small'>
              {Object.values(MEASURE_CATEGORIES).map((category) => (
                <MenuItem key={category} value={category}>
                  {t(`routes.assessments.steps.7.category_${category}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item>
          <FormControlLabel
            label={t('common.strings.aggressor')}
            className='CheckBox'
            checked={!!includeAggressor}
            control={
              <Checkbox
                onChange={(e) => onUpdateFilters({ includeAggressor: !includeAggressor })}
                size='small'
                value={!!includeAggressor}
              />
            }
          />
        </Grid>

        <Grid item>
          <FormControlLabel
            label={t('common.strings.victim')}
            className='CheckBox'
            checked={!!includeVictim}
            control={
              <Checkbox
                onChange={(e) => onUpdateFilters({ includeVictim: !includeVictim })}
                size='small'
                value={!!includeVictim}
              />
            }
          />
        </Grid>
      </Grid>

      {tableRows?.length > 0 ? (
        <Grid item xs={12} style={{ width: '100%', maxWidth: '700px' }}>
          <Table
            title={t('routes.statistics.suggested_measures')}
            columns={columns}
            data={tableRows}
            defaultSort={{ id: 'createdAt', desc: false }}
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

MeasureStats.propTypes = {
  stats: PropTypes.object,
  onUpdateFilters: PropTypes.func,
  districts: PropTypes.arrayOf(PropTypes.object),
};

export default React.memo(MeasureStats);
