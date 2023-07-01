import API from '../api';

const GET_RISK_ASSESSMENT_BEGIN = 'GET_RISK_ASSESSMENT_BEGIN';
const GET_RISK_ASSESSMENT_SUCCESS = 'GET_RISK_ASSESSMENT_SUCCESS';
const START_RISK_ASSESSMENT_BEGIN = 'START_RISK_ASSESSMENT_BEGIN';
const START_RISK_ASSESSMENT_SUCCESS = 'START_RISK_ASSESSMENT_SUCCESS';
const DELETE_RISK_ASSESSMENT_BEGIN = 'DELETE_RISK_ASSESSMENT_BEGIN';
const DELETE_RISK_ASSESSMENT_SUCCESS = 'DELETE_RISK_ASSESSMENT_SUCCESS';
const VALIDATE_RISK_ASSESSMENT_BEGIN = 'VALIDATE_RISK_ASSESSMENT_BEGIN';
const VALIDATE_RISK_ASSESSMENT_SUCCESS = 'VALIDATE_RISK_ASSESSMENT_SUCCESS';
const GET_FULL_RISK_ASSESSMENT_BEGIN = 'GET_FULL_RISK_ASSESSMENT_BEGIN';
const GET_FULL_RISK_ASSESSMENT_SUCCESS = 'GET_FULL_RISK_ASSESSMENT_SUCCESS';

const GET_STEP_BEGIN = 'GET_STEP_BEGIN';
const GET_STEP_SUCCESS = 'GET_STEP_SUCCESS';
const UPDATE_STEP_BEGIN = 'UPDATE_STEP_BEGIN';
const UPDATE_STEP_SUCCESS = 'UPDATE_STEP_SUCCESS';
const VALIDATE_STEP_BEGIN = 'VALIDATE_STEP_BEGIN';
const VALIDATE_STEP_SUCCESS = 'VALIDATE_STEP_SUCCESS';

const initialState = {
  // List of risk assessment. The frontend assumes these contain zero information about steps.
  // It is, however, assumed to contain validation result for all steps.
  riskAssessments: [],
  // The steps in each assessment. Indexed by riskAssessmentId, so ie
  // { "1201": { "1": { step1info }, "2": { step2info }, ... }, "33311": ... }
  steps: {},
  // Full Risk Assessment including detailed data for each step. Currently only used for PDF download.
  fullRiskAssessment: {},
  loading: false,
  stepLoading: false,
};

export const getRiskAssessment =
  (riskAssessmentId, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: GET_RISK_ASSESSMENT_BEGIN, doInBackground });
    const riskAssessment = await API.riskAssessments.getRiskAssessment(riskAssessmentId);
    dispatch({ type: GET_RISK_ASSESSMENT_SUCCESS, riskAssessment });
    return riskAssessment;
  };

export const startRiskAssessment =
  (caseId, isExternal = false, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: START_RISK_ASSESSMENT_BEGIN, doInBackground });
    const riskAssessment = await API.riskAssessments.startRiskAssessment(caseId, isExternal);
    dispatch({ type: START_RISK_ASSESSMENT_SUCCESS, riskAssessment });
    return riskAssessment;
  };

export const deleteRiskAssessment =
  (riskAssessmentId, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: DELETE_RISK_ASSESSMENT_BEGIN, doInBackground });
    await API.riskAssessments.deleteRiskAssessment(riskAssessmentId);
    dispatch({ type: DELETE_RISK_ASSESSMENT_SUCCESS, riskAssessmentId });
    return riskAssessmentId;
  };

export const validateRiskAssessment =
  (riskAssessmentId, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: VALIDATE_RISK_ASSESSMENT_BEGIN, doInBackground });
    const results = await API.riskAssessments.valiateRiskAssessment(riskAssessmentId);
    dispatch({ type: VALIDATE_RISK_ASSESSMENT_SUCCESS, riskAssessmentId, results });
    return results;
  };

export const getFullRiskAssessment =
  (riskAssessmentId, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: GET_FULL_RISK_ASSESSMENT_BEGIN, doInBackground });
    const fullRiskAssessment = await API.riskAssessments.getFullRiskAssessment(riskAssessmentId);
    dispatch({ type: GET_FULL_RISK_ASSESSMENT_SUCCESS, fullRiskAssessment });
    return fullRiskAssessment;
  };

// Steps
export const getStep =
  (riskAssessmentId, stepNr, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: GET_STEP_BEGIN, doInBackground });
    const step = await API.riskAssessments.getStep(riskAssessmentId, stepNr);
    dispatch({ type: GET_STEP_SUCCESS, riskAssessmentId, stepNr, step });
    return step;
  };

export const updateStep =
  (riskAssessmentId, stepNr, updatedStep, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_STEP_BEGIN, doInBackground });
    const step = await API.riskAssessments.updateStep(riskAssessmentId, stepNr, updatedStep);
    dispatch({ type: UPDATE_STEP_SUCCESS, riskAssessmentId, stepNr, step });
    return step;
  };

export const validateStep =
  (riskAssessmentId, stepNr, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: VALIDATE_STEP_BEGIN, doInBackground });
    const results = await API.riskAssessments.validateStep(riskAssessmentId, stepNr);
    dispatch({ type: VALIDATE_STEP_SUCCESS, riskAssessmentId, stepNr, results });
    return results;
  };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_RISK_ASSESSMENT_BEGIN:
    case START_RISK_ASSESSMENT_BEGIN:
    case VALIDATE_RISK_ASSESSMENT_BEGIN:
    case GET_FULL_RISK_ASSESSMENT_BEGIN:
      return {
        ...state,
        loading: action.doInBackground ? false : true,
      };

    case START_RISK_ASSESSMENT_SUCCESS:
      return {
        ...state,
        riskAssessments: [...state.riskAssessments, action.riskAssessment],
        loading: false,
      };

    case GET_RISK_ASSESSMENT_SUCCESS:
      return {
        ...state,
        riskAssessments: state.riskAssessments.map((c) => c.id).includes(action.riskAssessment.id)
          ? state.riskAssessments.map((c) => (c.id === action.riskAssessment.id ? action.riskAssessment : c))
          : [...state.riskAssessments, action.riskAssessment],
        loading: false,
      };

    case DELETE_RISK_ASSESSMENT_SUCCESS:
      return {
        ...state,
        riskAssessments: state.riskAssessments.filter((c) => c.id !== action.riskAssessmentId),
        loading: false,
      };

    case VALIDATE_RISK_ASSESSMENT_SUCCESS:
      return {
        ...state,
        riskAssessments: state.riskAssessments.map((c) =>
          c.id === Number(action.riskAssessmentId)
            ? {
                ...c,
                validation: {
                  valid: action.results?.valid,
                  errors: action.results?.errors,
                },
              }
            : c
        ),
        loading: false,
      };

    case GET_FULL_RISK_ASSESSMENT_BEGIN:
      return {
        ...state,
        fullRiskAssessment: action.fullRiskAssessment,
        loading: false,
      };

    // Steps
    case GET_STEP_BEGIN:
    case UPDATE_STEP_BEGIN:
    case VALIDATE_STEP_BEGIN:
      return {
        ...state,
        stepLoading: action.doInBackground ? false : true,
      };

    case GET_STEP_SUCCESS:
    case UPDATE_STEP_SUCCESS: {
      return {
        ...state,
        steps: {
          ...state.steps,
          [action.riskAssessmentId]: { ...state.steps[action.riskAssessmentId], [action.stepNr]: action.step },
        },
        stepLoading: false,
      };
    }

    // When we successfully validate a step, it can either have errors or it can have become valid. In either case we
    // want to update the riskAssessments["this step's risk assessment's id"].validation to reflect the new state.
    case VALIDATE_STEP_SUCCESS:
      return {
        ...state,
        riskAssessments: state.riskAssessments.map((c) =>
          c.id === Number(action.riskAssessmentId)
            ? {
                ...c,
                validation: {
                  ...c.validation,
                  valid: c?.validation?.valid && action.results?.valid,
                  errors: action.results?.valid
                    ? _.omit(c.validation?.errors || {}, action.stepNr)
                    : { ...(c.validation.errors || {}), [action.stepNr]: action.results },
                },
              }
            : c
        ),
        steps: { ...state.steps, [action.stepNr]: { ...state.steps[action.stepNr], completed: action.result?.valid } },
        stepLoading: false,
      };

    default:
      return state;
  }
}
