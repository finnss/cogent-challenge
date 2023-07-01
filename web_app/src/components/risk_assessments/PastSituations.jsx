import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Grid,
  TextField,
  IconButton,
  InputAdornment,
  InputLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatAdminBids, formatDate } from '/util/formatters';
import '/style/riskassessments.scss';
import clsx from 'clsx';

/**
 *
 * @param {string} pastRiskAssessments - The past risk assessments to be displayed in the accordion
 * @returns {JSX.Element} - Component that displays an accordion with a summary of previous risk assessments
 */
const PastSituations = ({ pastRiskAssessments, stepNr, dataKey, sx, className }) => {
  const { t } = useTranslation();
  const [expandedIds, setExpandedIds] = useState([]);

  const handleChange = (riskAssessmentId) => {
    setExpandedIds((prev) =>
      prev.includes(riskAssessmentId) ? prev.filter((id) => id !== riskAssessmentId) : [...prev, riskAssessmentId]
    );
  };

  const getSituationHeader = (situation, evaluation) => {
    const wasCurrentSituation = evaluation?.currentSituations.map((s) => s.situationId).includes(situation.situationId);

    return (
      <Typography variant='body2' className='SummaryText'>
        {t('common.strings.date')}: {situation.date ? formatDate(situation.date) : t('errors.unknown')}
        {'  '}•{'  '}
        {t('common.strings.source')}: {situation.source || t('errors.unknown')},{' '}
        {situation.sourceDescription || t('errors.unknown')}
        {evaluation &&
          ` (${
            wasCurrentSituation
              ? t('routes.assessments.relevant_situation')
              : t('routes.assessments.previous_situation')
          })`}
      </Typography>
    );
  };

  return (
    <Grid container spacing={4} className={clsx(className, 'PastSituations')} item xs={12}>
      {pastRiskAssessments?.map((pastAssessment, i) => {
        // For steps 2, 3, and 4, we need to combine "current situations" and "previous sitations" into one big list.
        // For steps 5 and 6, the situations are placed directly in the step object.
        const evaluation =
          dataKey && pastAssessment[`step${stepNr}`] && pastAssessment[`step${stepNr}`][`${dataKey}RiskEvaluation`];

        const situations = (
          evaluation
            ? [...(evaluation?.currentSituations || []), ...(evaluation?.previousSituations || [])]
            : (pastAssessment[`step${stepNr}`] && pastAssessment[`step${stepNr}`][`${dataKey}Situations`]) || []
        ).sort((a, b) => a.date - b.date);

        return (
          situations?.length > 0 && (
            <Grid container spacing={1} key={pastAssessment.id} item xs={12}>
              {i === 0 && (
                <Typography variant='h6' className='SituationTitle' marginTop={4} marginBottom={1}>
                  {t('routes.assessments.previous_risk_assessments')}
                </Typography>
              )}

              <Grid item xs={12}>
                <InputLabel shrink className='HackyLabel'>
                  {t('routes.risk_factor_evaluation.information_from_past_assessments')}
                </InputLabel>
                <Accordion
                  expanded={expandedIds.includes(pastAssessment.id)}
                  onChange={() => handleChange(pastAssessment.id)}
                  elevation={0}
                  className='PastAccordion'>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    {getSituationHeader(situations[0], evaluation)}
                  </AccordionSummary>

                  <AccordionDetails>
                    {situations.map((situation, j) => (
                      <div key={situation.situationId} className='PastSituation'>
                        {j > 0 && getSituationHeader(situation, evaluation)}

                        <Typography variant='body2' className='AccordionText'>
                          {situation.informationFromSource || t('routes.risk_factor_evaluation.no_information')}
                        </Typography>
                      </div>
                    ))}
                  </AccordionDetails>
                </Accordion>
              </Grid>

              <Grid item xs={12} className='SubRow'>
                <Typography variant='body2' className='WeakText' style={{ fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 500 }}>{t('common.strings.performed')}: </span>
                  {pastAssessment?.completedAt ? formatDate(pastAssessment?.completedAt) : t('errors.unknown')}
                  {'  '}•{'  '}
                  {formatAdminBids(pastAssessment?.adminBids) || t('errors.unknown')}
                </Typography>

                {evaluation && (
                  <Grid style={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography variant='body2' className='WeakText' style={{ fontSize: '0.9rem' }}>
                      {t('routes.assessments.relevant')}:{' '}
                    </Typography>
                    <div className='PastAssessmentEval' style={{ marginRight: '5px' }}>
                      {evaluation.currentEvaluation === 'no_info'
                        ? t('components.toggle_button_group.insufficient')
                        : evaluation.currentEvaluation || '–'}
                    </div>

                    <Typography variant='body2' className='WeakText' style={{ fontSize: '0.9rem' }}>
                      {t('routes.assessments.previous')}:{' '}
                    </Typography>
                    <div className='PastAssessmentEval'>
                      {evaluation.currentEvaluation === 'no_info'
                        ? t('components.toggle_button_group.insufficient')
                        : evaluation.previousEvaluation || '–'}
                    </div>
                  </Grid>
                )}

                {stepNr === 3 && dataKey === 'psychologicalProblems' && (
                  <Grid style={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography variant='body2' className='WeakText' style={{ fontSize: '0.9rem' }}>
                      {pastAssessment.step3.professionalPsychologicalEvaluation
                        ? t('common.strings.assumed')
                        : 'common.strings.confirmed'}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )
        );
      })}
    </Grid>
  );
};

PastSituations.propTypes = {
  pastRiskAssessments: PropTypes.any.isRequired,
  stepNr: PropTypes.any.isRequired,
  dataKey: PropTypes.string.isRequired,
  sx: PropTypes.object,
  className: PropTypes.string,
};

export default memo(PastSituations);
