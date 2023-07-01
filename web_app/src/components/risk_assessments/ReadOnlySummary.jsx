import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import '/style/riskassessments.scss';

import { CopyAll, PictureAsPdf } from '@mui/icons-material';
import WarningBox from '/components/common/WarningBox';
import { getAssessmentLevelButtonOptions, prepadZeroes } from '/util';
import dayjs from 'dayjs';
import { showToast } from '/modules/toast';
import ContentBox from '/components/common/ContentBox';
import { DatePicker } from '@mui/x-date-pickers';
import RiskAssessmentPDF, { getProps } from '/components/risk_assessments/RiskAssessmentPDF';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import clsx from 'clsx';
import { formatAdminBids } from '/util/formatters';

// See https://github.com/diegomura/react-pdf/issues/975#issuecomment-674261430
// for details on this.
export const onClickDownloadPDF = async (riskAssessmentId, dispatch, t) => {
  dispatch(showToast(t('routes.assessments.steps.9.download_started'), 5000, 'success'));
  const props = await getProps(riskAssessmentId, dispatch);
  const doc = <RiskAssessmentPDF {...props} />;
  const asPdf = pdf([]); // [] is important, throws without an argument
  asPdf.updateContainer(doc);
  const blob = await asPdf.toBlob();
  const title = t('routes.assessments.steps.9.read_only.page_title', { id: `V${prepadZeroes(riskAssessmentId)}` });
  saveAs(blob, `${title}.pdf`);
};

const ReadOnlySummary = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { riskAssessment, step, onChangeToStep } = useOutletContext();

  const onClickCopyLink = () => {
    navigator.clipboard.writeText(window.location.href.split('steps')[0]);
    dispatch(showToast(t('routes.assessments.steps.9.copied'), 3000));
  };

  return (
    <Grid container spacing={3} className='StepContent'>
      <Grid item xs={12}>
        <Typography variant='h3' className='StepHeader'>
          {t('routes.assessments.steps.9.read_only.page_title', { id: `V${prepadZeroes(riskAssessment.id)}` })}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant='body2'>
          {t('routes.assessments.steps.1.intro_name')}
          <br />
          {t('routes.assessments.steps.1.intro_desc_1')}
          <br />
          {t('routes.assessments.steps.1.intro_desc_2')}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant='body2'>
          {t('common.strings.aggressor')}: {riskAssessment?.case?.aggressor?.fullName}
          <br />
          {t('common.strings.victim')}: {riskAssessment?.case?.victim?.fullName}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Button
          endIcon={<PictureAsPdf />}
          variant='Text'
          className='SummaryButton'
          style={{ paddingLeft: 0 }}
          onClick={() => onClickDownloadPDF(riskAssessment.id, dispatch, t)}>
          {t('routes.assessments.steps.9.read_only.download_pdf')}
        </Button>
        <Button endIcon={<CopyAll />} variant='Text' className='SummaryButton' onClick={onClickCopyLink}>
          {t('routes.assessments.steps.9.read_only.copy_link')}
        </Button>
      </Grid>

      {step?.usedDistributionCodes?.length > 0 && (
        <Grid item xs={12}>
          <WarningBox>
            <Typography variant='body2'>
              <b>{t('common.strings.note')}:</b> {t('routes.assessments.steps.1.warning_1')}
            </Typography>
            <ul>
              {[...step.usedDistributionCodes]
                .sort((a, b) => a[1] - b[1])
                .map((distributionCode) => (
                  <li key={distributionCode}>
                    <Typography variant='body2'>
                      <b>H-{distributionCode[1]}</b> {t(`routes.assessments.steps.9.${distributionCode}`)}
                    </Typography>
                  </li>
                ))}
            </ul>
          </WarningBox>
        </Grid>
      )}

      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h3' className='StepHeader'>
          {t('routes.assessments.steps.9.step_name')}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <ContentBox>
          <Grid container spacing={3} className='StepInputsContainer'>
            <Grid item xs={12}>
              <TextField
                label={t('routes.assessments.steps.1.assessment_performed_by')}
                value={riskAssessment?.adminBids ? formatAdminBids(riskAssessment?.adminBids) : ''}
                disabled
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <DatePicker
                  value={riskAssessment?.createdAt ? dayjs(riskAssessment?.createdAt) : null}
                  label={t('routes.assessments.steps.1.assessment_started_at')}
                  disabled
                  style={{ width: '100%' }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <DatePicker
                  value={riskAssessment?.completedAt ? dayjs(riskAssessment?.completedAt) : null}
                  label={t('routes.assessments.steps.1.assessment_submitted_at')}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={step?.step1?.policeReportNumber || ''}
                label={t('routes.assessments.steps.1.police_report_number')}
                disabled
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <DatePicker
                  value={step?.step1?.policeReportDate ? dayjs(step?.step1?.policeReportDate) : null}
                  label={t('routes.assessments.steps.1.police_report_date')}
                  helperText={t('routes.persons.birth_date_helper')}
                  disabled
                  style={{ width: '100%' }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl disabled>
                <FormLabel>{t('routes.assessments.steps.1.past_assessment')}</FormLabel>
                <RadioGroup disabled value={!!step?.step1?.pastAssessment}>
                  {[
                    { name: 'yes', label: t('common.actions.yes'), value: true },
                    { name: 'no', label: t('common.actions.no'), value: false },
                  ].map((option) => (
                    <FormControlLabel key={option.label} {...option} control={<Radio size='small' />} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl disabled>
                <FormLabel>{t('routes.assessments.steps.1.repeated_violence')}</FormLabel>
                <RadioGroup disabled value={!!step?.step1?.repeatedViolence}>
                  {[
                    { name: 'yes', label: t('common.actions.yes'), value: true },
                    { name: 'no', label: t('common.actions.no'), value: false },
                  ].map((option) => (
                    <FormControlLabel key={option.label} {...option} control={<Radio size='small' />} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={8} style={{ marginTop: '8px' }}>
              <TextField
                value={step?.step1?.indiciaDocumentId || ''}
                label={t('routes.assessments.steps.1.indicia_document_id')}
                disabled
              />
            </Grid>
          </Grid>
        </ContentBox>
      </Grid>

      <Grid item xs={12}>
        <ContentBox className='SubjectiveAssessmentSummary'>
          <Grid container spacing={3} className='StepInputsContainer'>
            <Grid item xs={12}>
              <Typography variant='h6'>{t('routes.assessments.steps.6.subjective_assessment_title')}</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                value={step?.step6?.subjectiveAssessmentDescription || ''}
                label={t('common.strings.full_assessment')}
                disabled
                fullWidth
                multiline
                minRows={8}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' fontWeight={500}>
                {t('routes.assessments.steps.6.near_future_long')}
              </Typography>
            </Grid>

            <Grid item xs={12} className='RiskAssessmentButtonGroup' marginBottom={2}>
              <ToggleButtonGroup value={step?.step6?.nearFutureRisk} disabled>
                {getAssessmentLevelButtonOptions(t).map((option) => (
                  <ToggleButton
                    key={option.value}
                    className={clsx(option.value, 'ValueSelected')}
                    value={option.value}
                    disabled>
                    {option.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' fontWeight={500}>
                {t('routes.assessments.steps.6.severe_violence_long')}
              </Typography>
            </Grid>

            <Grid item xs={10} className='RiskAssessmentButtonGroup' marginBottom={2}>
              <ToggleButtonGroup value={step?.step6?.severeViolenceRisk} disabled>
                {getAssessmentLevelButtonOptions(t).map((option) => (
                  <ToggleButton
                    key={option.value}
                    className={clsx(option.value, 'ValueSelected')}
                    value={option.value}
                    disabled>
                    {option.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </ContentBox>
      </Grid>

      <Grid item xs={12}>
        <Typography variant='body2' style={{ fontWeight: 500 }}>
          {t('routes.assessments.steps.9.suggested_measures_victim')}:
        </Typography>
        {step?.allSuggestedMeasures?.victim?.length > 0 ? (
          <ul style={{ marginTop: '8px' }}>
            {(step?.allSuggestedMeasures?.victim || []).map((suggestedMeasure) => (
              <li key={`victim-${suggestedMeasure.measureId}`}>
                <Typography variant='body2'>{t(`preventive_measures.${suggestedMeasure.type}`)}</Typography>
              </li>
            ))}
          </ul>
        ) : (
          <span>-</span>
        )}
      </Grid>

      <Grid item xs={12}>
        <Typography variant='body2' style={{ fontWeight: 500, marginBottom: 0 }}>
          {t('routes.assessments.steps.9.suggested_measures_aggressor')}:
        </Typography>
        {step?.allSuggestedMeasures?.aggressor?.length > 0 ? (
          <ul style={{ marginTop: '8px' }}>
            {step.allSuggestedMeasures?.aggressor.map((suggestedMeasure) => (
              <li key={`aggressor-${suggestedMeasure.measureId}`}>
                <Typography variant='body2'>{t(`preventive_measures.${suggestedMeasure.type}`)}</Typography>
              </li>
            ))}
          </ul>
        ) : (
          <span>-</span>
        )}
      </Grid>

      <Grid item xs={12} className='StepButtonsContainer'>
        <span />

        <Button
          variant='contained'
          onClick={() => onChangeToStep(1)}
          className='NextButton'
          endIcon={<ArrowForwardIcon />}>
          {t('routes.assessments.steps.9.read_only.see_complete_assessment')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default React.memo(ReadOnlySummary);
