import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Grid,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatAdminBids, formatDate } from '/util/formatters';
import '/style/riskassessments.scss';
import clsx from 'clsx';
import { getAssessmentLevelButtonOptions } from '/util';

/**
 *
 * @param {string} pastRiskAssessments - The past risk assessments to be displayed in the accordion
 * @returns {JSX.Element} - Component that displays an accordion with a summary of previous risk assessments
 */
const PastSubjectiveAssessments = ({ pastRiskAssessments, sx, className }) => {
  const { t } = useTranslation();
  const [expandedIds, setExpandedIds] = useState([]);

  const handleChange = (riskAssessmentId) => {
    setExpandedIds((prev) =>
      prev.includes(riskAssessmentId) ? prev.filter((id) => id !== riskAssessmentId) : [...prev, riskAssessmentId]
    );
  };

  return (
    <Grid container spacing={4} className={clsx('PastSubjectiveAssessments', className)} item xs={12}>
      {pastRiskAssessments?.map((pastAssessment, i) => {
        const step = pastAssessment.step6;
        const expanded = expandedIds.includes(pastAssessment.id);

        return (
          <Grid container spacing={1} key={pastAssessment.id} item xs={12}>
            {i === 0 && (
              <Typography variant='h6' className='SituationTitle' marginTop={4} marginBottom={1}>
                {t('routes.assessments.previous_risk_assessments')}
              </Typography>
            )}

            <Grid item xs={12}>
              <Typography variant='body2'>
                <span style={{ fontWeight: 500 }}>
                  {pastAssessment?.completedAt ? formatDate(pastAssessment?.completedAt) : t('errors.unknown')}{' '}
                </span>
                {'  '}•{'  '}
                {formatAdminBids(pastAssessment?.adminBids) || t('errors.unknown')}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <InputLabel shrink className='HackyLabel'>
                {t('routes.risk_factor_evaluation.information_from_past_assessments')}
              </InputLabel>
              <Accordion
                expanded={expanded}
                onChange={() => handleChange(pastAssessment.id)}
                elevation={0}
                className='PastAccordion'>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    variant='body2'
                    className={`AccordionText${!step?.subjectiveAssessmentDescription ? ' WeakText Italic' : ''}`}>
                    {_.truncate(
                      step?.subjectiveAssessmentDescription || t('routes.risk_factor_evaluation.no_information'),
                      {
                        length: expanded ? 99999 : 80,
                      }
                    )}
                  </Typography>
                </AccordionSummary>
              </Accordion>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' fontWeight={500}>
                {t('routes.assessments.steps.6.near_future_long')}
              </Typography>

              <Grid item xs={10} className='RiskAssessmentButtonGroup' marginBottom={2}>
                <ToggleButtonGroup value={step?.nearFutureRisk} disabled>
                  {getAssessmentLevelButtonOptions(t).map((option) => (
                    <ToggleButton
                      key={option.value}
                      className={clsx(
                        option.value,
                        `${step?.severeViolenceRisk ? 'ValueSelected' : 'NoneSelected'}  PastSubjective`
                      )}
                      value={option.value}
                      disabled>
                      {option.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Grid>

              <Typography variant='body2' fontWeight={500}>
                {t('routes.assessments.steps.6.severe_violence_long')}
              </Typography>

              <Grid item xs={10} className='RiskAssessmentButtonGroup' marginBottom={2}>
                <ToggleButtonGroup value={step?.severeViolenceRisk} disabled>
                  {getAssessmentLevelButtonOptions(t).map((option) => (
                    <ToggleButton
                      key={option.value}
                      className={clsx(
                        option.value,
                        `${step?.severeViolenceRisk ? 'ValueSelected' : 'NoneSelected'}  PastSubjective`
                      )}
                      value={option.value}
                      disabled>
                      {option.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Grid>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
};

PastSubjectiveAssessments.propTypes = {
  pastRiskAssessments: PropTypes.any.isRequired,
  sx: PropTypes.object,
  className: PropTypes.string,
};

export default memo(PastSubjectiveAssessments);
