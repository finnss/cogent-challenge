import { Typography } from '@mui/material';
import i18n from '/i18n';

/**
 * Remove a property from an object
 * @param {string} key
 * @param {object} object
 * @returns {object} new object without property
 */
export function omitKey(key, { [key]: _, ...withoutKey }) {
  return withoutKey;
}

/**
 * Function that returns the user to previous page (from location.state.from)
 * or a fallback page if state.from does not exist in history state
 * @param {History} history
 * @param {import('/modules').App} app
 * @param {string} fallback
 */
export function exitPage(history, fallback) {
  history.replace(history.location.state?.from ?? fallback);
}

/**
 * Truncates a string and addd ellipsis at the end if the string length exceeds limit
 * @param {string} str
 * @param {number} limit
 * @returns {string}
 */
export function truncate(str, limit = 120) {
  if (str?.length > limit) {
    return str.substring(0, limit) + '...';
  }
  return str;
}

/**
 * Convert a combination of first name and last name to a single string with initials
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string}
 */
export function nameInitials(firstName, lastName) {
  return `${firstName?.charAt(0) ?? '?'}${lastName?.charAt(0) ?? '?'}`.toUpperCase();
}

/**
 * Retrieves the errors relevant for the given name, including when the name is nested like aggressor.fullName.
 * @param {string} name
 * @param {object} errors
 * @returns {object}
 */
export function getFieldError(name, errors) {
  const nameParts = name?.includes('.') && name.split('.');
  return errors && (nameParts && errors[nameParts[0]] ? errors[nameParts[0]][nameParts[1]] : errors[name]);
}

export const STEP_URL_NAMES = {
  1: 'information',
  2: 'aggressor_risk_factors',
  3: 'aggressor_situation',
  4: 'victim_vulnerability',
  5: 'other_info',
  6: 'subjective_assessment',
  7: 'measures_for_victim',
  8: 'measures_for_aggressor',
  9: 'summary',
  0: 'summary',
};

export const getStepUrl = (riskAssessmentId, stepNr, leadingSlash = false, trailingSlash = false) => {
  // TODO Decide if backand and frontend should have same URL scheme for these final
  // "name" parts of the url.
  return `${leadingSlash ? '/' : ''}riskAssessments/${riskAssessmentId}/steps/${stepNr}/${STEP_URL_NAMES[stepNr]}${
    trailingSlash ? '/' : ''
  }`;
};

export const getButtonOptions = (includeUnsure = false, unsureLabel, labelPlacement) => {
  if (includeUnsure) {
    return [
      {
        name: 'yes',
        label: i18n.t('common.actions.yes'),
        value: 'yes',
        labelPlacement: labelPlacement ? labelPlacement : 'end',
      },
      {
        name: 'no',
        label: i18n.t('common.actions.no'),
        value: 'no',
        labelPlacement: labelPlacement ? labelPlacement : 'end',
      },
      {
        name: 'unsure',
        label: unsureLabel ? unsureLabel : '-',
        value: 'unsure',
        labelPlacement: labelPlacement ? labelPlacement : 'end',
      },
    ];
  } else {
    return [
      {
        name: 'yes',
        label: i18n.t('common.actions.yes'),
        value: true,
        labelPlacement: labelPlacement ? labelPlacement : 'end',
      },
      {
        name: 'no',
        label: i18n.t('common.actions.no'),
        value: false,
        labelPlacement: labelPlacement ? labelPlacement : 'end',
      },
    ];
  }
};

export const getAssessmentLevelButtonOptions = (t) => [
  { name: t('components.togge_button_group.low'), label: t('components.toggle_button_group.low'), value: 'low' },
  {
    name: t('components.togge_button_group.moderate'),
    label: t('components.toggle_button_group.moderate'),
    value: 'moderate',
  },
  { name: t('components.togge_button_group.high'), label: t('components.toggle_button_group.high'), value: 'high' },
];

export const renderCaseMembers = (caseObj, t) => (
  <div>
    <Typography variant='body2'>
      <span className='WeakText MR'>{t('routes.persons.aggressor_short')}</span>
      <span>{caseObj.aggressor.fullName}</span>
    </Typography>
    <Typography variant='body2'>
      <span className='WeakText MR'>{t('routes.persons.victim_short')}</span>
      <span>{caseObj.victim.fullName}</span>
    </Typography>
  </div>
);

export const formatRiskAssessmentResultSummary = (t, riskAssessment) => {
  if (!riskAssessment || (!riskAssessment.nearFutureRisk && !riskAssessment.severeViolenceRisk))
    return <Typography variant='body2'>{t('errors.unknown')}</Typography>;

  return (
    <div>
      <Typography variant='body2'>
        {riskAssessment.nearFutureRisk ? (
          <>
            <b>{t(`common.strings.assessment_levels.${riskAssessment.nearFutureRisk}`)}</b> (
            {t('routes.assessments.steps.6.near_future_risk')})
          </>
        ) : (
          t('errors.unknown')
        )}
      </Typography>
      <Typography variant='body2'>
        {riskAssessment.severeViolenceRisk ? (
          <>
            <b>{t(`common.strings.assessment_levels.${riskAssessment.severeViolenceRisk}`)}</b> (
            {t('routes.assessments.steps.6.severe_violence_risk')})
          </>
        ) : (
          t('errors.unknown')
        )}
      </Typography>
    </div>
  );
};

export const camelToSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const getUsedSources = (step1, t) =>
  !step1
    ? []
    : [
        step1.usedSourceAgent && {
          key: 'usedSourceAgent',
          value: t('routes.assessments.steps.1.used_source_agent'),
        },
        step1.usedSourceBL && { key: 'usedSourceBL', value: t('routes.assessments.steps.1.used_source_BL') },
        step1.usedSourcePO && { key: 'usedSourcePO', value: t('routes.assessments.steps.1.used_source_PO') },
        step1.usedSourceIndicia && {
          key: 'usedSourceIndicia',
          value: t('routes.assessments.steps.1.used_source_indicia'),
        },
        step1.usedSourceCase && {
          key: 'usedSourceCase',
          value: t('routes.assessments.steps.1.used_source_case'),
        },
        step1.usedSourceDUF && { key: 'usedSourceDUF', value: t('routes.assessments.steps.1.used_source_DUF') },
        step1.usedSourceFREG && { key: 'usedSourceFREG', value: t('routes.assessments.steps.1.used_source_FREG') },
        step1.usedSourceAggressor && {
          key: 'usedSourceAggressor',
          value: t('routes.assessments.steps.1.used_source_aggressor'),
        },
        step1.usedSourceVictim && {
          key: 'usedSourceVictim',
          value: t('routes.assessments.steps.1.used_source_victim'),
        },
        step1.usedSourcePolice && {
          key: 'usedSourcePolice',
          value: t('routes.assessments.steps.1.used_source_police'),
        },
        step1.usedSourceOther && {
          key: 'usedSourceOther',
          value: `${t('routes.assessments.steps.1.used_source_other')}: ${step1.usedSourceOtherDesc}`,
        },
      ].filter(Boolean);

export { default as useDisableShiftSelect } from './usedisableshiftselect';
export { default as useQueryParams } from './usequeryparams';
export { default as useKeyPress } from './usekeypress';
export { default as useOnClickOutside } from './useonclickoutside';
export { default as generateBreadcrumbs } from './generatebreadcrumbs';
export { default as getPersonCard } from './getpersoncard';
export { default as prepadZeroes } from './prepadzeroes';
export { default as useExitPagePrompt } from './useexitpageprompt';
export * from './converters';
export * from './validation';
export * from './file';
export const TABLE_PAGINATION_ALL = 9999;
export const GENDERS = ['mann', 'kvinne', 'annet'];
export const CIVIL_STATUSES = ['single', 'cohabitation', 'engaged', 'married', 'divorced', 'widow'];
export const INFORMATION_SOURCES = [
  'remove',
  'Agent 5.0',
  'BL',
  'PO',
  'Folkeregisteret',
  'Indicia',
  'Strasak',
  'DUF',
  'FREG',
  'Samtale med voldsutøver',
  'Samtale med voldsutsatt',
  'Samtaler med etterforsker, påtaleansvarlig',
  'Annet',
];
// The suggested measures are different for aggressor/victim
export const PREVENTIVE_MEASURES = {
  AGGRESSOR: {
    POLICE: [
      'oppfoelgingssamtale',
      'veiledning',
      'besoeksforbud',
      'varetekt',
      'ova',
      'tverrfaglig_moete',
      'bekymringsmelding',
    ],
    HEALTH: ['henvisning_til_fastlege', 'psykisk_helsevern', 'rusbehandling'],
    OFFICIAL: [
      'advokat',
      'nav',
      'boligkontor',
      'familievernkontor',
      'forvaltning_forebyggende',
      'soning',
      'kriminalomsorgen',
      'friomsorgen',
    ],
    OTHER: ['atv', 'sinnemestring', 'seif', 'konfliktraad', 'roede_kors'],
  },
  VICTIM: {
    POLICE: [
      'oppfoelgingssamtale',
      'veiledning',
      'besoeksforbud',
      'barnehuset',
      'mva',
      'ova',
      'bekymringsmelding',
      'tverrfaglig_moete',
      'relokasering',
      'adressesperre',
    ],
    HEALTH: ['henvisning_til_fastlege', 'psykisk_helsevern', 'rusbehandling'],
    OFFICIAL: [
      'bistandsadvokat',
      'krisesenter',
      'nav',
      'boligkontor',
      'barnevernet',
      'familievernkontor',
      'vern_for_eldre',
    ],
    OTHER: ['atv', 'roede_kors', 'seif', 'kompetanseteam', 'konfliktraad'],
  },
};
