import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useNavigate, useOutletContext } from 'react-router-dom';

import Login from './pages/Login';
import Person from './pages/Person';
import SearchPage from './pages/SearchPage';
import ProtectedRoute from './common/ProtectedRoute';
import Case from './pages/Case';
import { STEP_URL_NAMES } from '../util';
import Step_1_Information from './pages/risk_assessments/steps/Step_1_Information';
import Step_2_AggressorRiskFactors from './pages/risk_assessments/steps/Step_2_AggressorRiskFactors';
import Step_3_AggressorSituation from './pages/risk_assessments/steps/Step_3_Aggressor_Situation';
import Step_4_VictimVulnerability from './pages/risk_assessments/steps/Step_4_VictimVulnerability';
import Step_5_OtherInfo from './pages/risk_assessments/steps/Step_5_OtherInfo';
import Step_6_SubjectiveAssessment from './pages/risk_assessments/steps/Step_6_SubjectiveAssessment';
import Step_7_MeasuresForVictim from './pages/risk_assessments/steps/Step_7_MeasuresForVictim';
import Step_8_MeasuresForAggressor from '/routes/pages/risk_assessments/steps/Step_8_MeasuresForAggressor';
import Step_9_Summary from '/routes/pages/risk_assessments/steps/Step_9_Summary';
import RiskAssessment from '/routes/pages/risk_assessments/RiskAssessment';
import HelpAdmin from '/routes/pages/HelpAdmin';
import Statistics from '/routes/pages/Statistics';
import ErrorPage from '/routes/common/ErrorPage';
import Container from '/components/Container';

const Routing = () => {
  const { t } = useTranslation();

  return (
    <Routes>
      <Route path='/login' element={<Login />} />

      {/* Search Page */}
      <Route element={<ProtectedRoute requiredPermissions={['search']} title={t('routes.search.page_title')} />}>
        <Route path='/' element={<SearchPage />} />
      </Route>

      {/* Person */}
      <Route element={<ProtectedRoute requiredPermissions={['person_read']} title={t('routes.persons.page_title')} />}>
        <Route path='/persons/:id' element={<Person />} />
      </Route>

      {/* Case */}
      <Route element={<ProtectedRoute requiredPermissions={['case_read']} title={t('routes.cases.page_title')} />}>
        <Route path='/cases/:caseId' element={<Case />} />
      </Route>

      {/*-- Risk assessment steps -- */}
      <Route
        element={
          <ProtectedRoute title={t('routes.assessments.page_title')} requiredPermissions={['assessment_read']} />
        }>
        <Route path={`/riskAssessments/:riskAssessmentId`} element={<RiskAssessment />}>
          {/* Step 1 */}
          <Route
            path={`/riskAssessments/:riskAssessmentId/steps/1/${STEP_URL_NAMES[1]}`}
            element={<Step_1_Information />}
          />

          {/* Step 2 */}
          <Route
            path={`/riskAssessments/:riskAssessmentId/steps/2/${STEP_URL_NAMES[2]}`}
            element={<Step_2_AggressorRiskFactors />}
          />

          {/** Step 3 */}
          <Route
            path={`/riskAssessments/:riskAssessmentId/steps/3/${STEP_URL_NAMES[3]}`}
            element={<Step_3_AggressorSituation />}
          />

          {/** Step 4 */}
          <Route
            path={`/riskAssessments/:riskAssessmentId/steps/4/${STEP_URL_NAMES[4]}`}
            element={<Step_4_VictimVulnerability />}
          />

          {/** Step 5 */}
          <Route
            path={`/riskAssessments/:riskAssessmentId/steps/5/${STEP_URL_NAMES[5]}`}
            element={<Step_5_OtherInfo />}
          />

          {/** Step 6 */}
          <Route
            path={`/riskAssessments/:riskAssessmentId/steps/6/${STEP_URL_NAMES[6]}`}
            element={<Step_6_SubjectiveAssessment />}
          />

          {/* Step 7 */}
          <Route
            path={`/riskAssessments/:riskAssessmentId/steps/7/${STEP_URL_NAMES[7]}`}
            element={<Step_7_MeasuresForVictim />}
          />

          {/* Step 8 */}
          <Route
            path={`/riskAssessments/:riskAssessmentId/steps/8/${STEP_URL_NAMES[8]}`}
            element={<Step_8_MeasuresForAggressor />}
          />

          {/* Step 9 */}
          <Route
            path={`/riskAssessments/:riskAssessmentId/steps/9/${STEP_URL_NAMES[9]}`}
            element={<Step_9_Summary />}
          />

          {/* Fallback */}
          <Route path='' element={<RiskAssessmentFallback />} />
          <Route path='*' element={<RiskAssessmentFallback />} />
        </Route>
      </Route>
      {/* Statistics */}
      <Route
        element={
          <ProtectedRoute
            requiredPermissions={['statistics_read_personal']}
            title={t('routes.statistics.page_title')}
          />
        }>
        <Route path='/statistics' element={<Statistics />} />
      </Route>

      {/* Help Admin */}
      <Route element={<ProtectedRoute requiredPermissions={['help_write']} title={t('routes.help.page_title')} />}>
        <Route path='/helpAdmin' element={<HelpAdmin />} />
      </Route>

      {/* Fallback */}
      <Route
        path='*'
        element={
          <Container showErrorPage>
            <ErrorPage statusCode={404} />
          </Container>
        }
      />
    </Routes>
  );
};

const RiskAssessmentFallback = () => {
  const navigate = useNavigate();
  const { riskAssessment } = useOutletContext();

  useEffect(() => {
    if (riskAssessment) {
      navigate(
        riskAssessment.completed
          ? `/riskAssessments/${riskAssessment.id}/steps/9/summary`
          : `/riskAssessments/${riskAssessment.id}/steps/1/information`
      );
    }
  }, [riskAssessment]);
};

export default memo(Routing);
