import API from './api';

export const deleteSituation = (evaluationId, situationId) => {
  API.DELETE(`riskEvaluations/${evaluationId}/situation/${situationId}`)
}