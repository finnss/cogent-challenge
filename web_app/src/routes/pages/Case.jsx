/* eslint-disable react/prop-types */
import EditIcon from '@mui/icons-material/Edit';
import CaseIcon from '@mui/icons-material/PeopleAlt';
import { Button, Grid, MenuItem, Select, Typography } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../../style/cases.scss';

import { getDetailedCase, updateCase } from '../../modules/cases';
import { formatAdminBids, formatDate } from '../../util/formatters';
import {
  formatRiskAssessmentResultSummary,
  generateBreadcrumbs,
  getPersonCard,
  prepadZeroes,
  useExitPagePrompt,
} from '../../util';
import Container from '../../components/Container';
import Search from '../../components/common/Search';
import InfoCard from '../../components/common/InfoCard';
import Loading from '../../components/common/Loading';
import Table from '../../components/table/Table';
import dayjs from 'dayjs';
import { startRiskAssessment } from '../../modules/riskAssessments';
import { showToast } from '/modules/toast';
import { getDistricts } from '/modules/districts';

const DAYS_SINCE_LAST_ASSESSMENT_WARNING_THRESHOLD = 30;

const Case = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { caseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const cases = useSelector((state) => state.cases.cases);
  const isLoading = useSelector((state) => state.cases.loading);
  const districts = useSelector((state) => state.districts.districts);
  const districtsLoading = useSelector((state) => state.districts.loading);

  const [currentCase, setCurrentCase] = useState();
  // All of these states are for the two buttons for editing district and geographical
  // unit. They would normally be in a form, but since these are the only two things
  // you can edit about a case they are edited directly here. They are also animated
  // upon toggling, which requires some extra states.
  const [isEditingDistrict, setIsEditingDistrict] = useState(false);
  const [isEditingUnit, setIsEditingUnit] = useState(false);
  const districtRef = useRef();
  const unitRef = useRef();
  const [districtWidthWasSet, setDistrictWidthWasSet] = useState(false);
  const [unitWidthWasSet, setUnitWidthWasSet] = useState(false);
  const [newDistrictId, setNewDistrictId] = useState(null);
  const [isMissingGDU, setIsMissingGDU] = useState(false);

  useExitPagePrompt(t('routes.cases.confirm_navigation'), isMissingGDU);

  useEffect(() => {
    dispatch(getDetailedCase(caseId));
  }, [caseId]);

  useEffect(() => {
    if (cases?.length > 0 && caseId) {
      setCurrentCase(cases.find((c) => `${c.id}` === `${caseId}`));
    }
  }, [cases, caseId]);

  useEffect(() => {
    dispatch(getDistricts());
  }, []);

  const aggressorInfoForCard = useMemo(() => getPersonCard(t, currentCase?.aggressor, true, true), [t, currentCase]);

  const victimInfoForCard = useMemo(() => getPersonCard(t, currentCase?.victim, true, true), [t, currentCase]);

  const riskAssessmentColumns = useMemo(
    () => [
      {
        Header: t('routes.assessments.assessment_id'),
        accessor: 'id',
        Cell: ({ cell }) => (
          <Typography variant='body2' className='WeakText'>
            V{prepadZeroes(cell.value)}
          </Typography>
        ),
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
        Header: t('routes.assessments.evaluated_to'),
        accessor: 'nearFutureRisk',
        Cell: ({ cell }) => formatRiskAssessmentResultSummary(t, cell?.row.original),
      },
      {
        Header: t('common.strings.district'),
        accessor: 'districtId',
        Cell: ({ cell }) => (
          <Typography variant='body2'>
            {districts?.find((district) => district.id === cell.value)?.shortName || t('errors.unknown')}
          </Typography>
        ),
      },
    ],
    [districts, currentCase]
  );

  const navigateToAssessment = (riskAssessment) => {
    const { id } = riskAssessment;
    const fromPersonId = location?.state?.from?.split('/')?.length > 2 && location.state.from?.split('/')[2];
    const fromPersonIdString = fromPersonId ? `&fromPersonId=${fromPersonId}` : '';
    navigate(
      riskAssessment.completed
        ? `/riskAssessments/${id}/steps/9/summary`
        : `/riskAssessments/${id}/steps/1/information`,
      {
        state: { from: `${location.pathname}${fromPersonIdString}` },
      }
    );
  };

  const onAssessmentRowClick = (e, row) => {
    const riskAssessment = row?.original;
    const { id } = riskAssessment;
    return id && navigateToAssessment(riskAssessment);
  };

  const breadcrumbs = useMemo(
    () => generateBreadcrumbs({ t, location, caseId, currentCase }),
    [location, caseId, currentCase]
  );

  const timeSinceLastAssessment = useMemo(() => {
    if (!currentCase || !currentCase.riskAssessments || currentCase.riskAssessments.length === 0) return undefined;
    const now = dayjs();
    const msSinceLastAssessment = now.diff(
      dayjs(currentCase?.riskAssessments?.reduce((latest, current) => Math.max(latest, current.completedAt), 0))
    );

    const daysSinceLastAssessment = msSinceLastAssessment / (1000 * 60 * 60 * 24);
    // The 10000 days check is to account for the case where there are no risk assessment with a completedAt
    // that exists and the diff ends up being between now and dayjs(0) == epoch (Jan 01 1970). (finnss)
    if (daysSinceLastAssessment < DAYS_SINCE_LAST_ASSESSMENT_WARNING_THRESHOLD || daysSinceLastAssessment > 10000)
      return undefined;

    const weeksSinceLastAssessment = Math.floor(daysSinceLastAssessment / 7);
    const andDaysSinceLastAssessment = Math.floor(daysSinceLastAssessment % 7);
    return { weeks: weeksSinceLastAssessment, days: andDaysSinceLastAssessment };
  }, [currentCase]);

  const onEditValue = async (key, value) => {
    if (key === 'districtId') {
      setNewDistrictId(value);
      setIsMissingGDU(true);
      onCloseEditor('district');
    } else if (key === 'geographicalUnitId') {
      const dataToSubmit = { id: caseId, geographicalUnitId: value };
      if (newDistrictId) dataToSubmit['districtId'] = newDistrictId;

      const updatedCase = await dispatch(updateCase(dataToSubmit, true));
      onCloseEditor('geographicalUnit');
      onCloseEditor('district');

      if (updatedCase) {
        // FIXME This could potentially lead to issues if there are any nested values in currentCase
        // (like aggressor) that return more detailed information from getDetailedCase() than what's
        // returned in updateCase(). For example, if we wanted to add createdAt to case.aggressor
        // using DetailedCase backend, this would be removed by this setState. Could be solved by
        // performing a new call to getDetailedCase here, but that has its own issues. Could also
        // just return a detailed case from the update endpoint, maybe?
        setCurrentCase({ ...currentCase, ...updatedCase });
        dispatch(showToast(t('common.strings.update_success'), 3000));
        setNewDistrictId(null);
        setIsMissingGDU(false);
      } else {
        dispatch(showToast(t('errors.generic', -1, 'error')));
      }
    }
  };

  // These following useEffects read the css auto width of the district and unit
  // button containers, then set those widths explicitly. So width: auto (computed to 233px)
  // becomes width: 233px. This is needed for width transition animation to work.
  useEffect(() => {
    if (districtRef?.current?.offsetWidth && !districtWidthWasSet) {
      districtRef.current.style.width = `${districtRef?.current?.offsetWidth}px`;
      setDistrictWidthWasSet(true);
    }
  }, [currentCase, districtRef?.current?.offsetWidth, districtWidthWasSet]);

  useEffect(() => {
    if (unitRef?.current?.offsetWidth && !unitWidthWasSet) {
      unitRef.current.style.width = `${unitRef?.current?.offsetWidth}px`;
      setUnitWidthWasSet(true);
    }
  }, [currentCase, unitRef?.current?.offsetWidth, unitWidthWasSet]);

  // Editing width through ref is done to achieve transition animation
  const onShowEditor = (type) => {
    if (type === 'district') {
      setIsEditingDistrict(true);
      districtRef.current.style.width = '400px';
    } else if (type === 'geographicalUnit') {
      setIsEditingUnit(true);
      unitRef.current.style.width = '400px';
    }
  };

  const onCloseEditor = (type) => {
    if (type === 'district') {
      setIsEditingDistrict(false);
      districtRef.current.style.width = 'auto';
      setDistrictWidthWasSet(false);
    } else if (type === 'geographicalUnit') {
      setIsEditingUnit(false);
      unitRef.current.style.width = 'auto';
      setUnitWidthWasSet(false);
    }
  };

  const onStartRiskAssessmentClicked = async () => {
    const riskAssessment = await dispatch(startRiskAssessment(caseId));
    if (riskAssessment) {
      // FIXME: Add error message in a Toast if this if fails
      navigateToAssessment(riskAssessment);
    }
  };

  const onFillInExternalAssessmentClicked = async () => {
    const riskAssessment = await dispatch(startRiskAssessment(caseId, true));
    if (riskAssessment) {
      // FIXME: Add error message in a Toast if this if fails
      navigateToAssessment(riskAssessment, true);
    }
  };

  const onContinueRiskAssessmentClicked = async () => {
    navigateToAssessment({ id: currentCase?.incompleteRiskAssessmentId });
  };

  if (isLoading || !currentCase || districtsLoading) {
    return (
      <Container showErrorPage>
        <Loading />
      </Container>
    );
  }

  return (
    <Container pageTitle={t('routes.cases.page_title')} breadcrumbs={breadcrumbs}>
      <Grid container spacing={4} className='Cases'>
        <Grid item xs={4}>
          <Search initialValue={`S${prepadZeroes(caseId)}`} className='CaseSearch' />
        </Grid>

        <Grid item container xs={12} style={{ paddingTop: 0 }} spacing={4}>
          <Grid item container xs={12} direction='row' className='SpaceBetween CaseTitleRow'>
            <Grid item xs={4}>
              <Typography variant='h4' className='IconHeader'>
                <CaseIcon /> {t('routes.cases.title', { caseId: prepadZeroes(caseId) })}
              </Typography>
            </Grid>
            <Grid item xs={8} className='WarningBubbleContainer TimeSinceLastAssessmentContainer'>
              {timeSinceLastAssessment?.weeks && timeSinceLastAssessment?.days && (
                <Typography variant='body1' className='WarningBubble WeakText'>
                  {t('routes.cases.time_since_last_assessment', timeSinceLastAssessment)}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Grid item container xs={12} className='InfoCards' flexDirection='row' spacing={4}>
            <Grid item xs={6}>
              <Typography variant='h6'>{t('common.strings.aggressor')}</Typography>
              <InfoCard data={aggressorInfoForCard} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant='h6'>{t('common.strings.victim')}</Typography>
              <InfoCard data={victimInfoForCard} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item container xs={12}>
          <Grid item xs={12}>
            <Typography variant='h6'>{t('common.strings.district_and_unit')}</Typography>
          </Grid>

          <Grid item xs={12} container direction='row'>
            <div ref={districtRef} className={`DistrictContainer${isEditingDistrict ? ' IsEditing' : ''}`}>
              {isEditingDistrict ? (
                <div className='SelectNewDistrict'>
                  <Select
                    value={newDistrictId || currentCase?.districtId}
                    onChange={(e) => onEditValue('districtId', e.target.value)}>
                    {(districts || []).map((district) => (
                      <MenuItem key={district.id} value={district.id}>
                        {district.id} {district.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <CancelIcon onClick={() => onCloseEditor('district')} className='CancelButton' />
                </div>
              ) : (
                <Button
                  variant='contained'
                  endIcon={<EditIcon />}
                  className='EditButton'
                  onClick={() => onShowEditor('district')}>
                  {newDistrictId || currentCase?.districtId}{' '}
                  {districts?.find((d) => d.id === (newDistrictId || currentCase?.districtId))?.name}
                </Button>
              )}
            </div>

            <div
              ref={unitRef}
              className={`UnitContainer${isEditingUnit ? ' IsEditing' : isMissingGDU ? ' MissingGDU' : ''}`}>
              {isEditingUnit ? (
                <div className='SelectNewUnit'>
                  <Select
                    value={isMissingGDU ? '' : currentCase?.geographicalUnitId}
                    onChange={(e) => onEditValue('geographicalUnitId', e.target.value)}>
                    {districts
                      .find((d) => d.id === (newDistrictId || currentCase?.districtId))
                      ?.geographicalUnits?.map((value) => (
                        <MenuItem key={value.id} value={value.id}>
                          {value.name}
                        </MenuItem>
                      ))}
                  </Select>
                  <CancelIcon onClick={() => onCloseEditor('geographicalUnit')} className='CancelButton' />
                </div>
              ) : (
                <Button
                  variant='contained'
                  endIcon={<EditIcon />}
                  className='EditButton'
                  onClick={() => onShowEditor('geographicalUnit')}
                  disabled={!currentCase || !currentCase.districtId}>
                  {isMissingGDU
                    ? t('routes.cases.choose_GDE')
                    : districts
                        .find((d) => d.id === currentCase?.districtId)
                        ?.geographicalUnits?.find((d) => d.id === currentCase?.geographicalUnitId)?.name || ''}
                </Button>
              )}
            </div>
          </Grid>
        </Grid>

        <Grid item container xs={12} spacing={1} style={{ maxWidth: '800px' }}>
          <Grid item xs={12}>
            <Table
              title={t('routes.cases.past_assessments')}
              subtitle={
                currentCase?.incompleteRiskAssessmentId ? (
                  <Button
                    variant='contained'
                    className='ContinueRiskAssessmentButton'
                    style={{ width: 'fit-content' }}
                    onClick={onContinueRiskAssessmentClicked}>
                    {t('routes.cases.continue_assessment')}
                  </Button>
                ) : (
                  <Button variant='contained' style={{ width: 'fit-content' }} onClick={onStartRiskAssessmentClicked}>
                    {t('routes.cases.new_assessment')}
                  </Button>
                )
              }
              columns={riskAssessmentColumns}
              data={currentCase?.riskAssessments || []}
              defaultSort={{ id: 'completedAt', desc: true }}
              dense
              onClick={onAssessmentRowClick}
              includeCount={currentCase?.riskAssessments?.length > 0}
              hideTable={currentCase?.riskAssessments?.length === 0}
            />
          </Grid>

          {currentCase?.riskAssessments?.length === 0 && (
            <Grid item xs={12} className='NoAssessments' marginTop={1}>
              <Typography className='WeakText'>{t('routes.cases.no_assessments')}</Typography>
              <Typography className='WeakText NoAssessmentsDesc'>{t('routes.cases.no_assessments_desc')}</Typography>
            </Grid>
          )}

          <Grid item xs={12} style={{ marginTop: '30px' }}>
            <Button variant='text' className='StandaloneLink' onClick={onFillInExternalAssessmentClicked}>
              {t('routes.cases.new_assessment_external')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(Case);
