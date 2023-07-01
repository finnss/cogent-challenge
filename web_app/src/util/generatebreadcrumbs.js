import { getStepUrl, prepadZeroes } from '.';

const generateBreadcrumbs = ({
  t,
  location,
  person,
  caseId,
  riskAssessmentId,
  currentCase,
  riskAssessment,
  stepNr,
}) => {
  const breadcrumbs = [{ title: t('common.actions.search'), path: '/' }];

  // Persons page
  if (person) {
    breadcrumbs.push({ title: person.fullName || person.personNr || person.id, path: `/persons/${person.id}` });
    return breadcrumbs;
  }

  // Cases page
  if (caseId && currentCase) {
    const personCrumbs = createFromPersonBreadcrumbs(location?.state?.from, currentCase);
    if (personCrumbs) breadcrumbs.push(personCrumbs);

    breadcrumbs.push({ title: `S${prepadZeroes(caseId)}`, path: `/cases/${caseId}` });
    return breadcrumbs;
  }

  // Risk Assessments page
  if (riskAssessmentId) {
    if (riskAssessment && location?.state?.from) {
      const navigatedFrom = location.state.from.split('/').filter((p) => p !== '')[0];
      if (navigatedFrom === 'persons') {
        const personCrumbs = createFromPersonBreadcrumbs(location.state.from, riskAssessment.case);
        if (personCrumbs) breadcrumbs.push(personCrumbs);
      } else if (navigatedFrom === 'cases') {
        const caseCrumbs = createFromCaseBreadcrumbs(location.state.from, riskAssessment);
        if (caseCrumbs) breadcrumbs.push.apply(breadcrumbs, caseCrumbs);
      }
    }

    if (riskAssessment?.completed) {
      breadcrumbs.push({
        title: `V${prepadZeroes(riskAssessment.id)}`,
        path: getStepUrl(riskAssessmentId, stepNr, true),
      });
    } else {
      breadcrumbs.push({ title: t('routes.assessments.new'), path: getStepUrl(riskAssessmentId, stepNr, true) });
    }

    return breadcrumbs;
  }

  return breadcrumbs;
};

const createFromPersonBreadcrumbs = (fromString, currentCase) => {
  if (fromString && currentCase) {
    const linkParts = fromString.split('/').filter((p) => p !== '');
    if (linkParts.length === 2 && linkParts[0] === 'persons') {
      const personId = Number(linkParts[1]);
      const { aggressor, victim } = currentCase;
      const fromUser = aggressor.id === personId ? aggressor : victim.id === personId ? victim : undefined;
      if (fromUser) {
        return {
          title: fromUser.fullName,
          path: `/persons/${fromUser.id}`,
        };
      }
    }
  }
  return undefined;
};

const createFromCaseBreadcrumbs = (fromString, currentRiskAssessment) => {
  const crumbs = [];
  if (fromString && currentRiskAssessment) {
    const linkParts = fromString.split('/').filter((p) => p !== '');

    if (linkParts.length > 0 && linkParts[0] === 'cases') {
      // When naviagating person => search = assessment, we add &fromPersonId=... when
      // navigating from Cases, allowing risk assessments to show both.
      const innerLinkParts = linkParts[1]?.split('&');
      const caseId = innerLinkParts && innerLinkParts[0];
      const fromCaseId = caseId && currentRiskAssessment?.caseId === Number(caseId) && caseId;
      if (fromCaseId) {
        // if innerLinkParts' length is greater than one, that should mean we have a fromPersonId query param
        if (innerLinkParts?.length > 1) {
          const queryParamSplit = innerLinkParts[1].split('=');
          if (queryParamSplit[0] === 'fromPersonId') {
            const personId = queryParamSplit[1];
            const personBreadcrumbs = createFromPersonBreadcrumbs(`persons/${personId}`, currentRiskAssessment.case);
            if (personBreadcrumbs) {
              crumbs.push(personBreadcrumbs);
            }
          }
        }

        crumbs.push({
          title: `S${prepadZeroes(fromCaseId)}`,
          path: `/cases/${fromCaseId}`,
        });
      }
    }
  }
  return crumbs.length > 0 ? crumbs : undefined;
};

export default generateBreadcrumbs;
