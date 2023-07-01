/* eslint-disable react/prop-types */
import PlusIcon from '@mui/icons-material/ControlPoint';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import '../../style/persons.scss';

import { getDetailedPerson } from '../../modules/persons';
import { formatAdminBids, formatDate } from '../../util/formatters';
import {
  formatRiskAssessmentResultSummary,
  generateBreadcrumbs,
  getPersonCard,
  prepadZeroes,
  renderCaseMembers,
} from '../../util';
import Container from '../../components/Container';
import Search from '../../components/common/Search';
import { Button, Grid, IconButton, Typography } from '@mui/material';
import InfoCard from '../../components/common/InfoCard';
import Loading from '../../components/common/Loading';
import Table from '../../components/table/Table';
import PersonFormModal from '../../components/forms/PersonFormModal';
import CaseFormModal from '../../components/forms/CaseFormModal';
import { showToast } from '/modules/toast';
import { getDistricts } from '/modules/districts';

const Person = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const persons = useSelector((state) => state.persons.persons);
  const isLoading = useSelector((state) => state.persons.loading);
  const districts = useSelector((state) => state.districts.districts);
  const [person, setPerson] = useState(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    dispatch(getDetailedPerson(id));
  }, [id]);

  useEffect(() => {
    if (persons && persons.length > 0 && id) {
      setPerson(persons.find((p) => p.id === Number(id)));
    }
  }, [persons, id]);

  useEffect(() => {
    if (searchParams?.get('showEditModal')) {
      setShowEditUserModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    dispatch(getDistricts());
  }, []);

  const caseColumns = useMemo(
    () => [
      {
        Header: t('routes.cases.case_id'),
        accessor: 'id',
        Cell: ({ cell }) => (
          <Typography variant='body2' className='WeakText'>
            S{prepadZeroes(cell.value)}
          </Typography>
        ),
      },
      {
        Header: t('routes.cases.case'),
        accessor: 'caseMembers',
        Cell: ({ cell }) => renderCaseMembers(cell.row.original, t),
      },
      {
        Header: t('common.strings.created_at'),
        accessor: 'createdAt',
        Cell: ({ cell }) => (
          <div>
            <Typography variant='body2'>{formatDate(cell.value)}</Typography>
            <Typography variant='body2'>{formatAdminBids(cell?.row?.original.adminBids)}</Typography>
          </div>
        ),
      },
      {
        Header: t('routes.assessments.last_evaluated_to'),
        accessor: 'nearFutureRisk',
        Cell: ({ cell }) =>
          formatRiskAssessmentResultSummary(t, {
            nearFutureRisk: cell?.row.original.lastAssessmentNearFutureRisk,
            severeViolenceRisk: cell?.row.original.lastAssessmentSevereViolenceRisk,
          }),
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
    [districts]
  );

  const riskAssessmentColumns = useMemo(
    () => [
      {
        Header: t('routes.cases.case_id'),
        accessor: 'caseId',
        Cell: ({ cell }) => (
          <Typography variant='body2' className='WeakText'>
            S{prepadZeroes(cell.row.original.case.id)}
          </Typography>
        ),
      },
      {
        Header: t('routes.cases.case'),
        accessor: 'caseMembers',
        Cell: ({ cell }) => renderCaseMembers(cell.row.original.case, t),
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
        Header: t('routes.assessments.assessment_id'),
        accessor: 'id',
        Cell: ({ cell }) => (
          <Typography variant='body2' className='WeakText'>
            V{prepadZeroes(cell.value)}
          </Typography>
        ),
      },
    ],
    []
  );

  const personInfoForCard = useMemo(() => getPersonCard(t, person), [t, person]);

  const breadcrumbs = useMemo(() => generateBreadcrumbs({ t, location, person }), [person]);

  const onUpdatePersonSuccess = async (newId) => {
    await dispatch(getDetailedPerson(newId || id));
    setShowEditUserModal(false);
    dispatch(showToast(t('routes.persons.update_success'), 5000));
  };

  const onNewCaseSuccess = async (caseId) => {
    dispatch(showToast(t('routes.cases.create_success'), 5000));
    navigate(`/cases/${caseId}`, { state: { from: location.pathname } });
  };

  if (isLoading || !person) {
    return (
      <Container showErrorPage>
        <Loading />
      </Container>
    );
  }

  return (
    <Container pageTitle={t('routes.persons.page_title')} breadcrumbs={breadcrumbs}>
      <Grid container spacing={4} className='Persons'>
        <Grid item xs={4}>
          <Search initialValue={person?.fullName || person?.personNr || ''} className='PersonSearch' />
        </Grid>

        <Grid item xs={12} style={{ paddingTop: 0 }}>
          <Typography variant='h4' className='IconHeader'>
            <PersonIcon /> {person.fullName}
          </Typography>

          <Grid container style={{ width: '400px' }}>
            <Grid item className='SpaceBetween'>
              <Typography variant='h6'>{t('routes.persons.information')}</Typography>
              <IconButton onClick={() => setShowEditUserModal(true)}>
                <EditIcon fontSize='small' />
              </IconButton>
            </Grid>
            <InfoCard data={personInfoForCard} sx={{ width: '100% !important' }} />
          </Grid>
        </Grid>

        <Grid item xs={12} style={{ margin: '16px 0' }}>
          <Grid container style={{ width: '900px' }} direction='column' spacing={1}>
            {person?.cases?.length > 0 ? (
              <Grid item xs={12}>
                <Table
                  title={t('routes.persons.cases')}
                  subtitle={t('routes.persons.cases_desc')}
                  columns={caseColumns}
                  data={person.cases}
                  defaultSort={{ id: 'createdAt', desc: true }}
                  dense
                  onClick={(e, row) =>
                    row?.original?.id && navigate(`/cases/${row.original.id}`, { state: { from: location.pathname } })
                  }
                  includeCount
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Typography variant='h6'>{t('routes.persons.cases')}</Typography>
                <Typography className='WeakText'>{t('routes.persons.no_cases')}</Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button variant='outlined' startIcon={<PlusIcon />} onClick={() => setShowNewCaseModal(true)}>
                {t('routes.persons.new_case')}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {person?.riskAssessments?.length > 0 ? (
            <Grid container>
              <Table
                title={t('routes.assessments.page_title')}
                subtitle={t('routes.persons.past_assessments_desc')}
                columns={riskAssessmentColumns}
                data={person.riskAssessments}
                defaultSort={{ id: 'completedAt', desc: true }}
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
                includeCount
              />
            </Grid>
          ) : (
            <Grid item xs={12} style={{ maxWidth: '600px' }}>
              <Typography variant='h6'>{t('routes.assessments.page_title')}</Typography>
              <Typography className='WeakText'>{t('routes.persons.no_assessments')}</Typography>
            </Grid>
          )}
        </Grid>

        <PersonFormModal
          defaultValues={person}
          open={showEditUserModal}
          onClose={() => setShowEditUserModal(false)}
          className='UpdatePersonModal'
          onSuccess={onUpdatePersonSuccess}
        />

        <CaseFormModal
          existingPerson={person}
          open={showNewCaseModal}
          onClose={() => setShowNewCaseModal(false)}
          className='NewCaseModal'
          onSuccess={onNewCaseSuccess}
        />
      </Grid>
    </Container>
  );
};

export default React.memo(Person);
