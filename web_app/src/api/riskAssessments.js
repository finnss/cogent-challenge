import { getStepUrl } from '../util';
import API from './api';

export const getRiskAssessment = (id) => API.GET(`riskAssessments/${id}`);

export const startRiskAssessment = (caseId, isExternal) => {
  return API.POST('riskAssessments', { caseId, isExternal });
};

export const deleteRiskAssessment = (id) => API.DELETE(`riskAssessments/${id}`);

export const valiateRiskAssessment = (id) => {
  return API.POST(`riskAssessments/${id}/validate`);
};

export const getFullRiskAssessment = (id) => API.GET(`riskAssessments/${id}/full`);

// Steps
export const getStep = (riskAssessmentId, stepNr) => API.GET(getStepUrl(riskAssessmentId, stepNr, false, true));

export const updateStep = (riskAssessmentId, stepNr, step) => {
  return API.PATCH(getStepUrl(riskAssessmentId, stepNr, false, true), step);
};

export const validateStep = (riskAssessmentId, stepNr) =>
  API.POST(`${getStepUrl(riskAssessmentId, stepNr, false, true)}/validate`);
