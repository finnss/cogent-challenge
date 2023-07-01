import { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import Link from './Link';
import { useTranslation } from 'react-i18next';
import '/style/searchresults.scss';
import clsx from 'clsx';

import ContentBox from './ContentBox';
import { getStepUrl, prepadZeroes } from '../../util';

/**
 * Displays the results of a search
 * @param {{ results: object, searchText: string, className: string, sx: object, onRegisterPerson: func }}
 * @returns {JSX.Element}
 */
const SearchResults = ({ results, searchText, className, sx, onRegisterPerson }) => {
  const { t } = useTranslation();

  // Persons found in the ALFA Database
  const personResults = useMemo(
    () =>
      results.dbPersons &&
      results.dbPersons.length > 0 &&
      results.dbPersons.map((dbPerson) => (
        <Grid item xs={12} key={dbPerson.id}>
          <Link to={`/persons/${dbPerson.id}`}>{dbPerson.fullName}</Link>
        </Grid>
      )),
    [results]
  );

  // Cases found in the ALFA Database
  const caseResults = useMemo(
    () =>
      results.cases &&
      results.cases.length > 0 && (
        <Grid item container xs={12} spacing={1} direction='column'>
          <Grid item xs={12}>
            <Typography variant='subtitle1' className='ResultCategory'>
              {t('routes.search.results_cases')}
            </Typography>
          </Grid>
          {results.cases.map((foundCase) => (
            <Grid item xs={12} key={foundCase.id}>
              <Link to={`/cases/${foundCase.id}`}>S{prepadZeroes(foundCase.id)}</Link>
            </Grid>
          ))}
        </Grid>
      ),
    [results]
  );

  // Risk Assessments found in the ALFA Database
  const riskAssessmentResults = useMemo(
    () =>
      results.riskAssessments &&
      results.riskAssessments.length > 0 && (
        <Grid item container xs={12} spacing={1} direction='column'>
          <Grid item xs={12}>
            <Typography variant='subtitle1' className='ResultCategory'>
              {t('routes.search.results_assessments')}
            </Typography>
          </Grid>
          {results.riskAssessments.map((riskAssessment) => (
            <Grid item xs={12} key={riskAssessment.id}>
              <Link
                to={
                  riskAssessment.completed
                    ? `/riskAssessments/${riskAssessment.id}/steps/9/summary`
                    : `/riskAssessments/${riskAssessment.id}/steps/1/information`
                }>
                V{prepadZeroes(riskAssessment.id)}
              </Link>
            </Grid>
          ))}
        </Grid>
      ),
    [results]
  );

  const resultsToShow = useMemo(
    () =>
      personResults ||
      caseResults ||
      riskAssessmentResults || (
        <Grid item xs={12}>
          <div className='NoResults'>
            <Typography variant='body1'>{t('routes.search.no_results')}</Typography>

            <a onClick={() => onRegisterPerson()}>{t('routes.search.register_person')}</a>
          </div>
        </Grid>
      ),
    [results, searchText]
  );

  return (
    <ContentBox className={clsx('SearchResults', className)} noPadding sx={sx}>
      <Grid container spacing={2} direction='column'>
        <Grid item container xs={12} spacing={1} direction='column'>
          <Grid item xs={12}>
            <Typography variant='subtitle1' className='ResultCategory'>
              {t('routes.search.results_db')}
            </Typography>
          </Grid>

          {resultsToShow}
        </Grid>
      </Grid>
    </ContentBox>
  );
};

SearchResults.propTypes = {
  results: PropTypes.object.isRequired,
  searchText: PropTypes.string,
  className: PropTypes.string,
  sx: PropTypes.object,
  onRegisterPerson: PropTypes.func,
};

SearchResults.defaultProps = {
  className: '',
  sx: {},
  onRegisterPerson: () => {},
};

export default memo(SearchResults);
