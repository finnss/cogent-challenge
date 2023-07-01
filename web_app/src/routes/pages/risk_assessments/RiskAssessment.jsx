import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import '/style/riskassessments.scss';
import '/style/routing.scss';

import { generateBreadcrumbs, getStepUrl } from '/util';
import Container from '/components/Container';
import Loading from '/components/common/Loading';
import { getRiskAssessment, getStep, validateStep } from '/modules/riskAssessments';
import StepMenu from '/components/common/StepMenu';
import useStepForm from '/util/usestepform';

// For animating navigation between steps
const TRANSITION_STAGES = {
  FADE_IN: 'fadeIn',
  FADE_OUT: 'fadeOut',
  LOADING: 'loading',
  WAITING_FOR_STEP: 'waitingForStep',
  SET_STEP: 'setStep',
};

const RiskAssessment = () => {
  const { t } = useTranslation();
  const { riskAssessmentId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const riskAssessments = useSelector((state) => state.riskAssessments.riskAssessments);
  const steps = useSelector((state) => state.riskAssessments.steps);
  const isLoading = useSelector((state) => state.riskAssessments.loading);

  const [stepNr, setStepNr] = useState();
  const [step, setStep] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [transitionStage, setTransistionStage] = useState(TRANSITION_STAGES.FADE_IN);
  const [prevStepNr, setPrevStepNr] = useState();

  // Keep track of which step we're currently looking at using the url path
  // FIXME Maybe we put the timeout for transitions here?
  useEffect(() => {
    const split = location?.pathname?.split('/');
    if (split?.length > 3) {
      setStepNr(Number(split[4]));
    }
  }, [location]);

  // Get risk assessment when riskAssessmentId changes
  useEffect(() => {
    if (riskAssessmentId) {
      dispatch(getRiskAssessment(riskAssessmentId));
    }
  }, [riskAssessmentId]);

  // Set the risk assessment that was fetched from backend in state
  useEffect(() => {
    if (riskAssessments?.length > 0 && riskAssessmentId) {
      setRiskAssessment(riskAssessments.find((r) => Number(r.id) === Number(riskAssessmentId)));
    }
  }, [riskAssessments, riskAssessmentId]);

  // Get step when stepNr changes
  useEffect(() => {
    if (stepNr && riskAssessmentId) {
      dispatch(getStep(riskAssessmentId, stepNr));
    }
  }, [riskAssessmentId, stepNr]);

  // Set the step that was fetched from backend in state
  useEffect(() => {
    // All of these checks are to try making sure we only every update the step when we navigate to a new page.
    if (steps && steps[riskAssessmentId] && stepNr && !step) {
      setStep(steps[riskAssessmentId][stepNr]);
    } else if (
      steps &&
      steps[riskAssessmentId] &&
      stepNr &&
      step &&
      step.stepNr !== stepNr &&
      (transitionStage === TRANSITION_STAGES.WAITING_FOR_STEP || transitionStage === TRANSITION_STAGES.LOADING)
    ) {
      // When navigating to a new step (not the initial load), also trigger a transition effect
      setStep(steps[riskAssessmentId][stepNr]);
      setTransistionStage(TRANSITION_STAGES.SET_STEP);
    }
    // This final else if is a little scary. There is a chance we override user input here. Also, I am not 100%
    // sure we never end up in an infinite "Loading" screen using this. But without this we would frequently
    // see outdated information on step pages when navigating between steps.
    // FIXME Make sure navigation between steps is tested very thoroughly.
    else if (steps && steps[riskAssessmentId] && stepNr && step && transitionStage === TRANSITION_STAGES.FADE_IN) {
      setStep(steps[riskAssessmentId][stepNr]);
    }
  }, [steps, riskAssessmentId, stepNr, step, transitionStage]);

  // Sanity check. Should help make sure we never end up in infitie loading screens.
  useEffect(() => {
    setTimeout(() => {
      setTransistionStage((prevStage) => {
        return prevStage !== TRANSITION_STAGES.FADE_IN ? TRANSITION_STAGES.FADE_IN : prevStage;
      });
    }, 6000);
  }, [stepNr]);

  // FIXME Make sure breadcrumbs don't reset when navigating between steps
  const breadcrumbs = useMemo(
    () => generateBreadcrumbs({ t, location, riskAssessment, riskAssessmentId, stepNr }),
    [location, riskAssessment, riskAssessmentId, stepNr]
  );

  const isReadOnly = useMemo(() => riskAssessment?.completed, [riskAssessment]);

  // Use useStepForm to handle the actual form in each step
  const {
    onTempSave,
    isLoading: isStepLoading,
    ...stepForm
  } = useStepForm({
    stepNr,
    riskAssessment,
    step,
    defaultValues: formDefaultValues[stepNr],
    isReadOnly,
  });

  // When navigating between steps, we first save the step we are leaving. We then validate the values we just saved,
  // letting us show updated information about the step we left in the sidebar (Completed / Error).
  const onChangeToStep = async (newStepNr) => {
    if (newStepNr === stepNr) return;
    setTransistionStage(TRANSITION_STAGES.FADE_OUT);
    setTimeout(async () => {
      navigate(getStepUrl(riskAssessmentId, newStepNr, true), {
        state: { from: location?.state?.from },
      });
    }, 500);

    // These backend calls are done while waiting for the above timeout, which should ensure we never re-render
    // during the fadeOut but also start performing time-consuming actions while waiting for the animation.
    if (!isReadOnly) {
      await onTempSave();
      await dispatch(validateStep(riskAssessmentId, stepNr));
    }
  };

  // This useEffect is only for showing animations when navigating between steps
  useEffect(() => {
    // Case 1: We are waiting for backend to load, but also for the step to render. We prefer to not
    // show the loading icon, so we give the step 1 second to move to the next step before we "give up"
    // and show a loading indicator.
    if ((isLoading || isStepLoading) && transitionStage === TRANSITION_STAGES.WAITING_FOR_STEP) {
      setTimeout(() => {
        setTransistionStage((prevStage) => {
          return prevStage === TRANSITION_STAGES.WAITING_FOR_STEP || prevStage === TRANSITION_STAGES.SET_STEP
            ? TRANSITION_STAGES.LOADING
            : prevStage;
        });
      }, 1000);
    }
    // Case 2: We are done loading and the step has rendered. We fade in the new step, and we are done transitioning.
    else if (
      !isLoading &&
      !isStepLoading &&
      step &&
      step.stepNr !== prevStepNr &&
      (transitionStage === TRANSITION_STAGES.LOADING || transitionStage === TRANSITION_STAGES.SET_STEP)
    ) {
      setTransistionStage(TRANSITION_STAGES.FADE_IN);
      setPrevStepNr(step.stepNr);
    }
  }, [isLoading, isStepLoading, transitionStage, step, prevStepNr]);

  // This useEffect makes sure to set prevStepNr when we initially load a risk assessment.
  useEffect(() => {
    if (stepNr && !prevStepNr) {
      setPrevStepNr(stepNr);
    }
  }, [stepNr, prevStepNr]);

  const pageTitle = t(`routes.assessments.steps.${stepNr}.page_title`) || t('routes.assessments.page_title');

  const onClickTempSave = async () => {
    const updatedStep = await onTempSave();
    if (updatedStep) {
      setStep(updatedStep);
    }
  };

  const isExternal = useMemo(() => riskAssessment?.isExternal, [riskAssessment]);

  if (isLoading || !riskAssessment) {
    return (
      <Container showErrorPage>
        <Loading />
      </Container>
    );
  }

  return (
    <Container pageTitle={pageTitle} breadcrumbs={breadcrumbs} className='RiskAssessment'>
      <Grid container className='RiskAssessmentStep' spacing={5}>
        <Grid item xs={4}>
          <StepMenu
            riskAssessment={riskAssessment}
            stepNr={stepNr}
            onTempSave={onClickTempSave}
            onChangeToStep={onChangeToStep}
            isReadOnly={isReadOnly}
          />
        </Grid>

        {transitionStage === TRANSITION_STAGES.LOADING ? (
          <Loading />
        ) : (
          <Grid
            item
            xs={8}
            className={`${transitionStage}`}
            onAnimationEnd={() => {
              if (transitionStage === TRANSITION_STAGES.FADE_OUT) {
                // Sanity check to make absolutely sure the previous stage is FADE_OUT when we go to WAITING_FOR_STEP
                setTransistionStage((prevStep) =>
                  prevStep === TRANSITION_STAGES.FADE_OUT ? TRANSITION_STAGES.WAITING_FOR_STEP : prevStep
                );
              }
            }}
            style={{ paddingLeft: '100px' }}>
            <Outlet
              context={{
                riskAssessment,
                stepNr,
                step,
                onTempSave,
                onChangeToStep,
                isReadOnly,
                isExternal,
                ...stepForm,
              }}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

const formDefaultValues = {
  1: {
    usedSourceAgent: false,
    usedSourceAggressor: false,
    usedSourceBL: false,
    usedSourceCase: false,
    usedSourceDUF: false,
    usedSourceFREG: false,
    usedSourcePO: false,
    usedSourceIndicia: false,
    usedSourceOther: false,
    usedSourcePolice: false,
    usedSourceVictim: false,
  },
  9: {
    usesDistributionCodeH0: false,
    usesDistributionCodeH1: false,
    usesDistributionCodeH2: false,
    usesDistributionCodeH3: false,
    moreThanTenDaysOld: false,
  },
};

export default React.memo(RiskAssessment);
