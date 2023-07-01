import API from './api';
import { STEP_URL_NAMES } from '/util';

export const deleteMeasure = (riskAssessmentId, measureId, stepNr) => {
    const stepUrlName = STEP_URL_NAMES[stepNr]
    API.DELETE(`riskAssessments/${riskAssessmentId}/steps/${stepNr}/${stepUrlName}/measure/${measureId}`)
}