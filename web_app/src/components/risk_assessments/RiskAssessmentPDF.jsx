/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Link, Image } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import { camelToSnakeCase, getUsedSources, prepadZeroes } from '/util';
import { capitalize, formatAdminBids, formatDate, formatPersonNr } from '/util/formatters';
import { getFullRiskAssessment } from '/modules/riskAssessments';
import { useTranslation } from 'react-i18next';
import Arial from '/assets/Arial.ttf';
import ArialBold from '/assets/Arial-Bold.ttf';
import ArialItalic from '/assets/Arial-Italic.ttf';
import ArialBoldItalic from '/assets/Arial-BoldItalic.ttf';
import Copyright from '/assets/copyright.png';

// Fonts need to be explicitly imported and set here in order to work with the
// react-pdf library. Italic and Bold versions are not included by default, so without this
// those don't work.
Font.register({
  family: 'Arial',
  fonts: [
    { src: Arial },
    { src: ArialItalic, fontStyle: 'italic' },
    {
      src: ArialBold,
      fontWeight: 500,
    },
    {
      src: ArialBoldItalic,
      fontWeight: 500,
      fontStyle: 'italic',
    },
  ],
});

// Create styles. They are a bit messy, but since they are only used here in a PDF-version
// that has nothing to do with MUI and even uses a different syntax behind the scenes
// compared to the rest of our styles, I allowed myself to be a bit quick-and-dirty. (finnss)
const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    fontSize: 10,
    padding: 20,
    fontFamily: 'Arial',
  },
  section: {
    marginVertical: 5,
    width: '100%',
  },
  marginBottom: {
    marginBottom: 10,
  },
  marginBottomSmall: {
    marginBottom: 5,
  },
  marginBottomBig: {
    marginBottom: 20,
  },
  marginTop: {
    marginTop: 10,
  },
  marginTopSmall: {
    marginTop: 5,
  },
  marginLeft: {
    marginLeft: 10,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  headerText: {
    fontStyle: 'italic',
    color: 'grey',
  },
  mainTitle: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
    paddingBottom: 15,
    borderBottom: '1px solid grey',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 5,
  },
  subtitle2: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 10,
  },

  italic: {
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: 500,
  },

  table: {
    display: 'table',
    width: '100%',
    border: '2px solid black',
    borderRight: 0,
    borderBottom: 0,
    boxShadow: 0,
  },
  dottedTable: {
    display: 'table',
    width: '100%',
    border: '2px dotted #bbb',
    borderRight: 0,
    borderBottom: 0,
    boxShadow: 0,
  },
  riskFactorEvaluationTable: {
    display: 'table',
    width: '100%',
    border: '2px solid black',
    borderRight: 0,
    borderBottom: 0,
    boxShadow: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    width: '100%',
    borderBottom: '2px solid black',
  },
  tableRowDotted: {
    margin: 'auto',
    flexDirection: 'row',
    width: '100%',
    borderBottom: '2px dotted #bbb',
  },
  tableCol: {
    borderRight: '2px solid black',
  },
  tableCol80: {
    borderRight: '2px solid black',
    width: '75%',
  },
  tableCol100: {
    borderRight: '2px solid black',
    width: '100%',
  },
  tableCol10: {
    borderRight: '2px solid black',
    width: '12.5%',
  },
  tableColDotted33: {
    borderRight: '2px dotted #bbb',
    width: '33.3333%',
    width: 'calc(100% / 3)',
  },

  tableColDotted50: {
    borderRight: '2px dotted #bbb',
    width: '50%',
  },

  tableColDotted100: {
    borderRight: '2px dotted #bbb',
    width: '100%',
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    width: '100%',
  },

  yellowBorder: {
    border: '2px dotted #ebb500',
    width: '100%',
    textAlign: 'center',
    padding: 5,
  },

  yellowWarningBox: {
    border: '2px dotted grey',
    backgroundColor: '#fff4cc',
    width: '100%',
    padding: 5,
  },

  greyBorder: {
    border: '2px dotted #bbb',
    width: '100%',
    padding: 5,
  },
  greyBox: {
    border: '2px dotted #bbb',
    backgroundColor: '#efefef',
    width: '100%',
    padding: 5,
  },
  blueBox: {
    border: '2px dotted #666',
    backgroundColor: '#c5d4f7',
    width: '100%',
    padding: 5,
    paddingBottom: 0,
    lineHeight: 2,
  },
  blackBorder: {
    border: '2px solid black',
    width: '100%',
    padding: 5,
  },
  subjectiveAssessment: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
  },
  greenText: {
    color: '#26853c',
    fontWeight: 500,
  },
  yellowText: {
    color: '#ebb500',
    fontWeight: 500,
  },
  redText: {
    color: '#df2b36',
    fontWeight: 500,
  },
  ul: {
    flexDirection: 'column',
    paddingLeft: 5,
    marginTop: 4,
  },
  li: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  liText: {},
  liDot: {
    paddingHorizontal: 10,
  },

  riskFactorEvaluationHeader: {
    backgroundColor: '#000',
    color: 'white',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    border: '2px solid black',
  },
  riskFactorEvaluationTitle: {
    fontSize: 18,
  },
  riskFactorEvaluationSubtitle: {
    marginTop: 4,
    fontSize: 12,
  },
  riskFactorEvaluationTableHeaderCell: {
    fontSize: 10,
    width: '100%',
    paddingLeft: 10,
    paddingRight: 20,
    paddingVertical: 10,
    backgroundColor: '#eee',
  },

  riskFactorEvaluationTableCell: {
    padding: 5,
    fontSize: 10,
    width: '100%',
  },
  max80: {
    width: '95%',
  },
  // Vertical centering impossibru :( :'(
  verticalCenter: {
    // paddingTop: 5,
    // display: 'table',
    // display: 'table-cell',
    // verticalAlign: 'middle',
    // textAlign: 'center',
    // height: '100%',
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'space-around',
    // textAlign: 'center',
    // alignContent: 'center',
    // alignItems: 'center',
    // alignSelf: 'center',
    // flex: 1,
    // height: 'inherit',
    // height: '100%',
  },
  riskFactorEvaluationLetterHeader: {
    fontSize: 11,
    textAlign: 'center',
    // paddingTop: 10,
    // height: 20,

    // display: 'flex',
    // alignSelf: 'center',
    // flexDirection: 'column',
    // justifyContent: 'center',
    // textAlign: 'center',
    // alignContent: 'center',
    // alignItems: 'center',
    // flex: 1,
    // display: 'table-cell',
    // verticalAlign: 'middle',
    // height: '100%',
  },
  riskFactorEvaluationLetter: {
    fontSize: 16,
    textAlign: 'center',
    // paddingTop: 10,
    // height: '10px',
    // display: 'table-cell',
    // verticalAlign: 'middle',
  },
  riskFactorEvaluationTableIntroTitle: {
    fontSize: 14,
    paddingLeft: 13,
  },

  riskFactorEvaluationTableIntroSubtitle: {
    paddingTop: 10,
    paddingLeft: 25,
  },

  step6Header: {
    backgroundColor: '#4266d1',
    color: 'white',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    border: '2px solid black',
    borderBottom: 0,
  },
  step6HeaderTitle: {
    fontSize: 18,
  },

  pastSubjectiveAssessment: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 15,
  },
  finalText: {
    marginTop: 20,
    fontSize: 12,
    lineHeight: 1.5,
    width: '100%',
  },
  copyright: {
    width: 10,
  },
});

// Create Document Component
const RiskAssessmentPDF = ({ riskAssessment }) => {
  const { t } = useTranslation();

  const { step1, step2, step3, step4, step5, step6, step7, step8, step9, victim, aggressor, pastRiskAssessments } =
    riskAssessment;
  const dbCase = riskAssessment.case;

  const getStyleForSubjectiveAssessment = (level) =>
    ({
      low: styles.greenText,
      moderate: styles.yellowText,
      high: styles.redText,
    }[level]);

  const usedSources = useMemo(() => getUsedSources(step1, t), [step1]);

  // The static header at the top of each page in the PDF.
  const Header = () => (
    <View style={styles.section} fixed>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>
            {t('routes.cases.case')}: {prepadZeroes(dbCase.id)} ({t('routes.persons.aggressor_short')}:{' '}
            {aggressor.fullName}, {t('routes.persons.victim_short')}: {victim.fullName})
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerText}>
            {formatDate(riskAssessment.completedAt) || '01.01.2023'}, {formatAdminBids(riskAssessment.adminBids)}
          </Text>
        </View>
      </View>
    </View>
  );

  // Used twice in the summary section of the PDF; once for aggressor and once for victim.
  const PersonSummary = ({ role, person }) => (
    <>
      <Text style={styles.subtitle}>{t(`common.strings.${role}`)}</Text>
      <View style={styles.dottedTable}>
        <View style={styles.tableRowDotted}>
          <View style={styles.tableColDotted50}>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>
                <Text style={styles.bold}>{t('common.strings.name')}:</Text> {person.fullName}
              </Text>
              <Text style={styles.cellText}>
                <Text style={styles.bold}>{t('routes.persons.person_nr')}:</Text>{' '}
                {person.personNr ? formatPersonNr(person.personNr) : t('errors.unknown')}
              </Text>
              <Text style={styles.cellText}>
                <Text style={styles.bold}>{t('routes.persons.gender')}:</Text>{' '}
                {person.gender ? capitalize(person.gender) : t('errors.unknown')}
              </Text>
              <Text style={styles.cellText}>
                <Text style={styles.bold}>{t('routes.persons.address')}:</Text>{' '}
                {`${person.streetAddress}, ${person.postArea}`}
              </Text>
              {person.altStretAddress && (
                <Text style={styles.cellText}>
                  <Text style={styles.bold}>{t('routes.assessments.steps.1.alt_address_title')}:</Text>{' '}
                  {`${person.altStreetAddress}, ${person.altPostArea} ${
                    person.altAddressDescription ? `(${person.altAddressDescription})` : ''
                  }`}
                </Text>
              )}
              <Text style={styles.cellText}>
                <Text style={styles.bold}>{t('common.strings.phone_nr')}:</Text> {person.phoneNr || t('errors.unknown')}
              </Text>
              <Text style={styles.cellText}>
                <Text style={styles.bold}>{t('routes.assessments.steps.1.email')}:</Text>{' '}
                {person.email ? <Link to={person.email}>{person.email}</Link> : t('errors.unknown')}
              </Text>
            </View>
          </View>

          <View style={styles.tableColDotted50}>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>
                <Text style={styles.bold}>{t('routes.assessments.steps.1.civil_status')}:</Text>{' '}
                {person.civilStatus ? t(`common.strings.civil_statuses.${person.civilStatus}`) : ''}
              </Text>
              <Text style={styles.cellText}>
                <Text style={styles.bold}>{t('routes.assessments.steps.1.citizenship')}:</Text> {person.citizenship}
              </Text>
              <Text style={styles.cellText}>
                <Text style={styles.bold}>{t('routes.assessments.steps.1.residence_permit')}:</Text>{' '}
                {person.residencePermit}
              </Text>
              <Text style={styles.cellText}>
                <Text style={styles.bold}>{t('routes.assessments.steps.1.birth_country')}:</Text> {person.birthCountry}
              </Text>
              <Text style={styles.cellText}>
                <Text style={styles.bold}>{t('routes.assessments.steps.1.birth_place')}:</Text> {person.birthPlace}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );

  // Common component for each risk factor evaluation in steps 2, 3, and 4.
  const RiskFactorEvaluation = ({ tag, stepNr }) => {
    const titles = {
      violence: 'one_violence',
      threat: 'two_threat',
      escalation: 'three_escalation',
      restrainingViolation: 'four_restraining_violation',
      attitude: 'five_attitude',

      otherCrime: 'six_other_crime',
      relationshipProblems: 'seven_relationship',
      economicalProblems: 'eight_economy',
      drugs: 'nine_drugs',
      psychologicalProblems: 'ten_psychological',

      inconsistentAttitude: 'inconsistent_attitude',
      extremeFear: 'extreme_fear',
      noHelp: 'no_help',
      exposed: 'exposed',
      personalIssues: 'personal_issues',
    };

    const step = riskAssessment[`step${stepNr}`];
    const listItem = `routes.assessments.steps.${stepNr}.${camelToSnakeCase(tag)}_list_item`;

    return (
      <>
        <View style={styles.tableRow} wrap>
          <View style={styles.tableCol80} wrap>
            <View style={styles.riskFactorEvaluationTableHeaderCell} wrap>
              <View style={styles.max80} wrap>
                <Text style={styles.riskFactorEvaluationTableIntroTitle} wrap>
                  {t(`routes.assessments.steps.${stepNr}.${titles[tag] || tag}`)}
                </Text>

                <View style={styles.ul} wrap>
                  {!t(`${listItem}1`).includes('routes.') && (
                    <View style={styles.li} break={false}>
                      <View style={styles.liDot}>
                        <Text>•</Text>
                      </View>
                      <View style={styles.liText}>
                        <Text>{t(`${listItem}1`)}</Text>
                      </View>
                    </View>
                  )}
                  {!t(`${listItem}2`).includes('routes.') && (
                    <View style={styles.li} break={false}>
                      <View style={styles.liDot}>
                        <Text>•</Text>
                      </View>
                      <View style={styles.liText}>
                        <Text>{t(`${listItem}2`)}</Text>
                      </View>
                    </View>
                  )}
                  {!t(`${listItem}3`).includes('routes.') && (
                    <View style={styles.li} break={false}>
                      <View style={styles.liDot}>
                        <Text>•</Text>
                      </View>
                      <View style={styles.liText}>
                        <Text>{t(`${listItem}3`)}</Text>
                      </View>
                    </View>
                  )}
                  {!t(`${listItem}4`).includes('routes.') && (
                    <View style={styles.li} break={false}>
                      <View style={styles.liDot}>
                        <Text>•</Text>
                      </View>
                      <View style={styles.liText}>
                        <Text>{t(`${listItem}4`)}</Text>
                      </View>
                    </View>
                  )}
                  {!t(`${listItem}5`).includes('routes.') && (
                    <View style={styles.li} break={false}>
                      <View style={styles.liDot}>
                        <Text>•</Text>
                      </View>
                      <View style={styles.liText}>
                        <Text>{t(`${listItem}5`)}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.tableCol10} wrap>
            <View style={styles.riskFactorEvaluationTableCell} wrap>
              <View style={styles.verticalCenter} wrap>
                <Text style={styles.riskFactorEvaluationLetterHeader}>
                  {t('routes.assessments.relevant_situation')}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.tableCol10} wrap>
            <View style={styles.riskFactorEvaluationTableCell} wrap>
              <View style={styles.verticalCenter} wrap>
                <View style={styles.riskFactorEvaluationLetterHeader} wrap>
                  <Text>{t('routes.assessments.previous_situation')}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableRow} wrap>
          <View style={styles.tableCol80} wrap>
            <View style={styles.riskFactorEvaluationTableCell} wrap>
              <Text style={styles.subtitle}>{t('routes.assessments.relevant_situation')}</Text>
              <Sitations situations={step[`${tag}RiskEvaluation`]?.currentSituations} />

              <Text style={styles.subtitle}>{t('routes.assessments.previous_situation')}</Text>
              <Sitations situations={step[`${tag}RiskEvaluation`]?.previousSituations} />

              {pastRiskAssessments?.length > 0 && (
                <View>
                  <Text style={styles.subtitle}>
                    {t('routes.risk_factor_evaluation.information_from_past_assessments')}
                  </Text>

                  {pastRiskAssessments.map((pastAssessment) => (
                    <View key={pastAssessment.id}>
                      <Text>
                        <Text style={styles.bold}>{t('common.strings.performed')}: </Text>
                        <Text>
                          {pastAssessment?.completedAt ? formatDate(riskAssessment?.completedAt) : t('errors.unknown')}
                        </Text>
                        <Text>
                          {'  '}•{'  '}
                        </Text>
                        <Text>
                          {pastAssessment?.adminBids ? formatAdminBids(pastAssessment.adminBids) : t('errors.unknown')}
                        </Text>
                      </Text>

                      <View style={styles.section}>
                        <Sitations
                          situations={pastAssessment[`step${step.stepNr}`][`${tag}RiskEvaluation`]?.currentSituations}
                          isPast
                        />
                        <Sitations
                          situations={pastAssessment[`step${step.stepNr}`][`${tag}RiskEvaluation`]?.previousSituations}
                          isPast
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.tableCol10} wrap>
            <View style={styles.riskFactorEvaluationTableCell} wrap>
              <View style={styles.verticalCenter} wrap>
                <Text style={styles.riskFactorEvaluationLetter}>
                  {['j', 'n'].includes(step[`${tag}RiskEvaluation`]?.currentEvaluation)
                    ? capitalize(step[`${tag}RiskEvaluation`]?.currentEvaluation)
                    : '–'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.tableCol10} wrap>
            <View style={styles.riskFactorEvaluationTableCell} wrap>
              <View style={styles.verticalCenter} wrap>
                <Text style={styles.riskFactorEvaluationLetter}>
                  {['j', 'n'].includes(step[`${tag}RiskEvaluation`]?.previousEvaluation)
                    ? capitalize(step[`${tag}RiskEvaluation`]?.previousEvaluation)
                    : '–'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  };

  // Common component for situations.
  const Sitations = ({ situations, includeBorder = true, isPast = false }) => {
    const realSituations = situations.filter(
      (situation) =>
        !(
          situation.date === null &&
          situation.source === null &&
          situation.sourceDescription === null &&
          situation.informationFromSource === null
        )
    );
    return realSituations?.length > 0 ? (
      realSituations?.map((situation) => (
        <View style={styles.marginBottom} key={situation.id} wrap break={false}>
          <View style={isPast ? styles.greyBox : includeBorder ? styles.greyBorder : undefined} wrap>
            <View style={styles.marginBottomSmall} wrap>
              <Text style={styles.italic}>
                <Text style={styles.bold}>{t('common.strings.date')}: </Text>
                <Text>{situation.date ? formatDate(situation.date) : t('errors.unknown')}</Text>

                <Text>
                  {'  '}•{'  '}
                </Text>

                <Text style={styles.bold}>{t('common.strings.source')}: </Text>
                <Text>
                  {situation.source || t('errors.unknown')}, {situation.sourceDescription || t('errors.unknown')}
                </Text>
              </Text>
            </View>

            <View wrap>
              <Text>
                <Text style={styles.bold}>{t('routes.persons.information')}: </Text>
                <Text>{situation.informationFromSource || t('errors.unknown')}</Text>
              </Text>
            </View>
          </View>
        </View>
      ))
    ) : (
      <View style={styles.marginBottom} wrap>
        <Text style={styles.italic}>{t('common.strings.none')}.</Text>
      </View>
    );
  };

  const certaintyOptions = { yes: t('common.actions.yes'), no: t('common.actions.no'), unsure: '–' };

  // The bulk of the content of Step 5. Separated into a component simply in order to avoid repetition
  // in the "Past Risk Assessments" part of Step 5.
  const Step5Weapons = ({ step, isPast = false }) => (
    <View style={styles.marginTop} wrap>
      <View style={isPast ? styles.greyBox : styles.greyBorder} wrap>
        <View style={styles.marginBottomBig}>
          <Text style={styles.bold}>{t('routes.assessments.steps.5.weapon_registry_checked')}?</Text>
          <Text style={styles.marginTopSmall}>
            <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
            <Text>{step.weaponRegistryChecked ? t('common.actions.yes') : t('common.actions.no')}</Text>
          </Text>
        </View>

        <View style={styles.marginBottomBig}>
          <Text style={styles.bold}>{t('routes.assessments.steps.5.weapon_registered')}</Text>
          <Text style={styles.marginTopSmall}>
            <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
            <Text>{step.aggressorHasRegisteredWeapon ? t('common.actions.yes') : t('common.actions.no')}</Text>
          </Text>
        </View>

        <View style={styles.marginBottomBig}>
          <Text style={styles.bold}>{t('routes.assessments.steps.5.weapon_type')}</Text>
          <Text style={styles.marginTopSmall}>
            <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
            <Text>{step.weaponType}</Text>
          </Text>
        </View>

        <View style={styles.marginBottomBig}>
          <Text style={styles.bold}>{t('routes.assessments.steps.5.previously_associated_weapons')}</Text>
          <Text style={styles.marginTopSmall}>
            <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
            <Text>{step.aggressorPreviouslyHandledWeapons ? t('common.actions.yes') : t('common.actions.no')}</Text>
          </Text>
        </View>

        <View style={styles.marginBottomBig}>
          <Sitations situations={step.weaponSituations} includeBorder={false} />
        </View>

        <View style={styles.marginBottomBig}>
          <Text style={styles.bold}>{t('routes.assessments.steps.5.reported_concern')}</Text>
          <Text style={styles.marginTopSmall}>
            <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
            <Text>{step.concernReported ? t('common.actions.yes') : t('common.actions.no')}</Text>
          </Text>
        </View>

        <View style={styles.marginBottomBig}>
          <View style={styles.marginBottomSmall} wrap>
            <Text style={styles.italic}>
              <Text style={styles.bold}>{t('routes.assessments.steps.5.reported_concern_date')}: </Text>
              <Text>{step.concernReportedAt || t('errors.unknown')}</Text>
            </Text>
          </View>
          <View wrap>
            <Text>
              <Text style={styles.bold}>{t('routes.assessments.steps.5.reported_concern_details')}: </Text>
              <Text>{step.concernReportDetails || t('errors.unknown')}</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Common component used to render the Preventive Measures in Step 7 and 8.
  const PreventiveMeasure = ({ measures, category, isPast = false }) => {
    return measures?.map((measure) => (
      <View style={styles.marginBottom} key={`${category}-${measure.id}`}>
        <View style={isPast ? styles.greyBox : styles.greyBorder}>
          <Text style={styles.bold}>
            {t(`routes.assessments.steps.7.category_${category}`)}: {t(`preventive_measures.${measure.type}`)}
          </Text>
          <Text style={styles.marginTopSmall}>{measure.comment}</Text>
        </View>
      </View>
    ));
  };

  // Main return of the component!
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Header />

        {/* Main title */}
        <View style={styles.section}>
          <Text style={styles.mainTitle}>
            {t('routes.assessments.steps.9.read_only.page_title', { id: `V${prepadZeroes(riskAssessment.id)}` })}
          </Text>
        </View>

        {/* Main summary table row */}
        <View style={styles.section}>
          <View style={styles.dottedTable}>
            <View style={styles.tableRowDotted}>
              <View style={styles.tableColDotted33}>
                <View style={styles.tableCell}>
                  <Text style={styles.cellText}>
                    <Text style={styles.bold}>{t('routes.cases.case')}:</Text> {prepadZeroes(dbCase.id)}
                  </Text>
                  <Text style={styles.cellText}>
                    <Text style={styles.bold}>{t('routes.assessments.steps.1.assessment_performed_by')}:</Text>{' '}
                    {formatAdminBids(riskAssessment.adminBids)}
                  </Text>
                  <Text style={styles.cellText}>
                    <Text style={styles.bold}>{t('routes.assessments.steps.1.assessment_started_at')}:</Text>{' '}
                    {formatDate(riskAssessment.createdAt)}
                  </Text>
                </View>
              </View>

              <View style={styles.tableColDotted33}>
                <View style={styles.tableCell}>
                  <Text style={styles.cellText}>
                    <Text style={styles.bold}>{t('routes.assessments.steps.1.assessment_submitted_at')}:</Text>{' '}
                    {formatDate(riskAssessment.completedAt)}
                  </Text>
                  <Text style={styles.cellText}>
                    <Text style={styles.bold}>{t('routes.assessments.steps.1.police_report_number_short')}:</Text>{' '}
                    {step1.policeReportNumber}
                  </Text>
                  <Text style={styles.cellText}>
                    <Text style={styles.bold}>{t('routes.assessments.steps.1.police_report_date')}:</Text>{' '}
                    {formatDate(step1.policeReportDate)}
                  </Text>
                </View>
              </View>

              <View style={styles.tableColDotted33}>
                <View style={styles.tableCell}>
                  <Text style={styles.cellText}>
                    <Text style={styles.bold}>{t('routes.assessments.steps.1.indicia_document_id')}:</Text>{' '}
                    {step1.indiciaDocumentId}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Distribution codes (H-1, H-2, etc) */}
        {step1?.usedDistributionCodes?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.yellowBorder}>
              <View style={styles.italic}>
                <Text>
                  <Text style={styles.bold}>{t('common.strings.note')}: </Text>
                  <Text>{t('routes.assessments.steps.1.warning_1')}</Text>
                </Text>

                <View style={styles.ul}>
                  {step1?.usedDistributionCodes?.map((distributionCode) => (
                    <View key={distributionCode}>
                      <Text key={distributionCode} style={styles.li}>
                        <Text style={styles.bold}>H-{distributionCode[1]}</Text>{' '}
                        {t(`routes.assessments.steps.9.${distributionCode}`)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Subjective Assessment Summary */}
        <View style={styles.section}>
          <Text style={styles.title}>{t('routes.assessments.steps.6.subjective_assessment_description')}</Text>

          <View style={styles.yellowWarningBox}>
            <Text style={styles.italic}>
              {riskAssessment.step6.subjectiveAssessmentDescription || t('errors.unknown')}
            </Text>
          </View>

          <View style={styles.subjectiveAssessment}>
            <Text style={styles.marginBottom}>{t('routes.assessments.steps.6.risk_if_no_action')}</Text>
            <br />
            <Text>
              {t('routes.assessments.steps.6.near_future_long')}:{' '}
              <Text style={getStyleForSubjectiveAssessment(step6.nearFutureRisk)}>
                {step6.nearFutureRisk
                  ? t(`components.toggle_button_group.${step6.nearFutureRisk}`)
                  : t('errors.unknown')}
              </Text>
            </Text>
            <br />
            <Text>
              {t('routes.assessments.steps.6.severe_violence_long')}:{' '}
              <Text style={getStyleForSubjectiveAssessment(step6.severeViolenceRisk)}>
                {step6.severeViolenceRisk
                  ? t(`components.toggle_button_group.${step6.severeViolenceRisk}`)
                  : t('errors.unknown')}
              </Text>
            </Text>
          </View>
        </View>

        {/* Information and sources (step1) */}
        <View style={styles.section}>
          <Text style={styles.title}>{t('routes.assessments.steps.1.step_name')}</Text>

          {/* Aggressor */}
          <PersonSummary role='aggressor' person={aggressor} />

          {/* Victim */}
          <PersonSummary role='victim' person={victim} />
        </View>
      </Page>
      {/* End Page 1 */}

      {/* Page 2 */}
      <Page size='A4' style={styles.page}>
        <Header />

        {/* Step 1 continued: Relationship */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>{t('routes.assessments.steps.1.relationship_desc')}</Text>

          <View style={styles.greyBorder}>
            <Text>
              <Text style={styles.bold}>{t('routes.assessments.steps.1.relationship_desc')}:</Text>{' '}
              <Text style={styles.italic}>{step1.relationshipDesc}</Text>
            </Text>
            <Text>
              <Text style={styles.bold}>{t('routes.assessments.steps.1.are_children_involved')}</Text>{' '}
              {step1.areChildrenInvolved ? t('common.actions.yes') : t('common.actions.no')}
            </Text>
          </View>
        </View>

        {/* Used information sources */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>{t('routes.assessments.steps.1.information_sources')}</Text>

          <View style={styles.greyBorder}>
            <View style={styles.ul}>
              {usedSources.map((source) => (
                <View key={source.key} style={styles.li}>
                  <View style={styles.liDot}>
                    <Text>•</Text>
                  </View>
                  <View style={styles.liText}>
                    <Text>{source.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.subtitle}>{t('routes.assessments.assessment_procedure')}</Text>
        <View style={styles.blueBox}>
          <View>
            <View style={styles.marginBottom}>
              <Text variant='body2' className='WeakText'>
                {t('routes.assessments.j_description_long')}
              </Text>
              <Text>{t('routes.assessments.d_description_long')}</Text>
              <Text>{t('routes.assessments.n_description_long')}</Text>
              <Text>{t('routes.assessments.insufficient_description_long')}</Text>
            </View>

            <View style={styles.marginBottom}>
              <Text>{t('routes.assessments.relevant_situation')}: </Text>
              <Text>{t('routes.assessments.relevant_situation_description')}</Text>
            </View>

            <View>
              <Text>{t('routes.assessments.previous_situation')}: </Text>
              <Text>{t('routes.assessments.previous_situation_description')}</Text>
            </View>
          </View>
        </View>
      </Page>
      {/* End Page 2 */}

      {/* Page 3 ++. From now on, the page does not wrap, meaning its content can spill into different pages. 
        This is because we do not know the length of the current and previous situations for each risk factor
        evaluation. As a result, the following pages are not numbered in these comments. Instead we indicate
        why we explicitly inserted a page break={false}, typically because we've reached a new Step. */}
      <Page size='A4' style={styles.page} wrap>
        <Header />

        {/* Step 2 */}
        <View style={styles.section} wrap>
          <View style={styles.riskFactorEvaluationHeader}>
            <Text style={styles.riskFactorEvaluationTitle}>{t('routes.assessments.steps.2.step_name')}</Text>
            <Text style={styles.riskFactorEvaluationSubtitle}>{t('routes.assessments.steps.2.step_description')}</Text>
          </View>

          <View style={styles.riskFactorEvaluationTable} wrap>
            <RiskFactorEvaluation tag='violence' stepNr={2} />
            <RiskFactorEvaluation tag='threat' stepNr={2} />
            <RiskFactorEvaluation tag='escalation' stepNr={2} />
            <RiskFactorEvaluation tag='restrainingViolation' stepNr={2} />
            <RiskFactorEvaluation tag='attitude' stepNr={2} />
            {/* End of Table */}
          </View>
        </View>
      </Page>

      {/* Page for Step 3 */}
      <Page size='A4' style={styles.page} wrap>
        <Header />

        <View style={styles.section} wrap>
          <View style={styles.riskFactorEvaluationHeader}>
            <Text style={styles.riskFactorEvaluationTitle}>{t('routes.assessments.steps.4.step_name')}</Text>
          </View>

          <View style={styles.riskFactorEvaluationTable} wrap>
            <RiskFactorEvaluation tag='otherCrime' stepNr={3} />
            <RiskFactorEvaluation tag='relationshipProblems' stepNr={3} />
            <RiskFactorEvaluation tag='economicalProblems' stepNr={3} />
            <RiskFactorEvaluation tag='drugs' stepNr={3} />
            <RiskFactorEvaluation tag='psychologicalProblems' stepNr={3} />

            {/* End of Table */}
          </View>
        </View>
      </Page>

      {/* Page for Step43 */}
      <Page size='A4' style={styles.page} wrap>
        <Header />

        <View style={styles.section} wrap>
          <View style={styles.riskFactorEvaluationHeader}>
            <Text style={styles.riskFactorEvaluationTitle}>{t('routes.assessments.steps.3.step_name')}</Text>
            <Text style={styles.riskFactorEvaluationSubtitle}>{t('routes.assessments.steps.4.step_description')}</Text>
          </View>

          <View style={styles.riskFactorEvaluationTable} wrap>
            <RiskFactorEvaluation tag='inconsistentAttitude' stepNr={4} />
            <RiskFactorEvaluation tag='extremeFear' stepNr={4} />
            <RiskFactorEvaluation tag='noHelp' stepNr={4} />
            <RiskFactorEvaluation tag='exposed' stepNr={4} />
            <RiskFactorEvaluation tag='personalIssues' stepNr={4} />
            {/* End of Table */}
          </View>
        </View>
      </Page>

      {/* Page for Step 5 */}
      <Page size='A4' style={styles.page} wrap>
        <Header />

        <View style={styles.section} wrap>
          <View style={styles.riskFactorEvaluationHeader}>
            <Text style={styles.riskFactorEvaluationTitle}>{t('routes.assessments.steps.5.step_name')}</Text>
          </View>

          <View style={styles.riskFactorEvaluationTable} wrap>
            {/* Step 5 Weapons row */}
            <View style={styles.tableRow} wrap>
              <View style={styles.tableCol100} wrap>
                <View style={styles.riskFactorEvaluationTableHeaderCell} wrap>
                  <Text style={styles.riskFactorEvaluationTableIntroTitle} wrap>
                    {t('routes.assessments.steps.5.weapon_information')}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.tableRow} wrap>
              <View style={styles.tableCol100} wrap>
                <View style={styles.tableCell} wrap>
                  <Step5Weapons step={step5} />

                  {pastRiskAssessments?.length > 0 && (
                    <View>
                      <Text style={styles.subtitle}>
                        {t('routes.risk_factor_evaluation.information_from_past_assessments')}
                      </Text>

                      {pastRiskAssessments.map((pastAssessment) => (
                        <View style={styles.marginBottom} key={pastAssessment.id}>
                          <Text>
                            <Text style={styles.bold}>{t('common.strings.performed')}: </Text>
                            <Text>
                              {pastAssessment?.completedAt
                                ? formatDate(pastAssessment?.completedAt)
                                : t('errors.unknown')}
                            </Text>
                            <Text>
                              {'  '}•{'  '}
                            </Text>
                            <Text>
                              {pastAssessment?.adminBids
                                ? formatAdminBids(pastAssessment?.adminBids)
                                : t('errors.unknown')}
                            </Text>
                          </Text>
                          <Step5Weapons step={pastAssessment?.step5} isPast />
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Step 5 Children row */}
            <View style={styles.tableRow} wrap>
              <View style={styles.tableCol100} wrap>
                <View style={styles.riskFactorEvaluationTableHeaderCell} wrap>
                  <Text style={styles.riskFactorEvaluationTableIntroTitle} wrap>
                    {t('routes.assessments.steps.5.childrens_role_title')}
                  </Text>
                  <Text style={styles.riskFactorEvaluationTableIntroSubtitle}>
                    {t('routes.assessments.steps.5.childrens_role_desc1')}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.tableRow} wrap>
              <View style={styles.tableCol100} wrap>
                <View style={styles.tableCell} wrap>
                  <Text style={styles.subtitle}>{t('routes.assessments.steps.5.information_about_children')}</Text>
                  <Sitations situations={step5.childrenSituations} />

                  <Text style={styles.subtitle}>{t('routes.assessments.situation')}</Text>

                  <View style={styles.dottedTable}>
                    <View style={styles.tableRowDotted}>
                      <View style={styles.tableColDotted100}>
                        <View style={styles.tableCell}>
                          <View style={styles.marginLeft}>
                            <Text style={styles.bold}>{t('routes.assessments.steps.5.violence_against_children')}</Text>
                            <View style={styles.marginLeft}>
                              <Text style={styles.marginTopSmall}>
                                <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
                                <Text style={styles.italic}>
                                  {certaintyOptions[step5.doParentsHaveChildViolenceHistory] || t('errors.unknown')}
                                </Text>
                              </Text>

                              <Text style={styles.marginTopSmall}>
                                <Text style={styles.bold}>
                                  {t('routes.risk_factor_evaluation.elaborating_source')}:{' '}
                                </Text>
                                <Text>{step5.doParentsHaveChildViolenceHistoryDesc}</Text>
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.tableRowDotted}>
                      <View style={styles.tableColDotted100}>
                        <View style={styles.tableCell}>
                          <View style={styles.marginLeft}>
                            <Text style={styles.bold}>{t('routes.assessments.steps.5.child_violence_history')}</Text>
                            <View style={styles.marginLeft}>
                              <Text style={styles.marginTopSmall}>
                                <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
                                <Text style={styles.italic}>
                                  {certaintyOptions[step5.childIsExposedToPartnerViolence] || t('errors.unknown')}
                                </Text>
                              </Text>

                              <Text style={styles.marginTopSmall}>
                                <Text style={styles.bold}>
                                  {t('routes.risk_factor_evaluation.elaborating_source')}:{' '}
                                </Text>
                                <Text>{step5.childIsExposedToPartnerViolenceDesc}</Text>
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.tableRowDotted}>
                      <View style={styles.tableColDotted100}>
                        <View style={styles.tableCell}>
                          <View style={styles.marginLeft}>
                            <Text style={styles.bold}>{t('routes.assessments.steps.5.child_threatened')}</Text>
                            <View style={styles.marginLeft}>
                              <Text style={styles.marginTopSmall}>
                                <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
                                <Text style={styles.italic}>
                                  {certaintyOptions[step5.childIsThreatened] || t('errors.unknown')}
                                </Text>
                              </Text>

                              <Text style={styles.marginTopSmall}>
                                <Text style={styles.bold}>
                                  {t('routes.risk_factor_evaluation.elaborating_source')}:{' '}
                                </Text>
                                <Text>{step5.childIsThreatenedDesc}</Text>
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.tableRowDotted}>
                      <View style={styles.tableColDotted100}>
                        <View style={styles.tableCell}>
                          <View style={styles.marginLeft}>
                            <Text style={styles.bold}>{t('routes.assessments.steps.5.violence_exposure')}</Text>
                            <View style={styles.marginLeft}>
                              <Text style={styles.marginTopSmall}>
                                <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
                                <Text style={styles.italic}>
                                  {certaintyOptions[step5.didChildExposureIncrease] || t('errors.unknown')}
                                </Text>
                              </Text>

                              <Text style={styles.marginTopSmall}>
                                <Text style={styles.bold}>
                                  {t('routes.risk_factor_evaluation.elaborating_source')}:{' '}
                                </Text>
                                <Text>{step5.didChildExposureIncreaseDesc}</Text>
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.tableRowDotted}>
                      <View style={styles.tableColDotted100}>
                        <View style={styles.tableCell}>
                          <View style={styles.marginLeft}>
                            <Text style={styles.bold}>{t('routes.assessments.steps.5.violence_during_pregnancy')}</Text>
                            <View style={styles.marginLeft}>
                              <Text style={styles.marginTopSmall}>
                                <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
                                <Text style={styles.italic}>
                                  {certaintyOptions[step5.violenceDuringPregnancy] || t('errors.unknown')}
                                </Text>
                              </Text>

                              <Text style={styles.marginTopSmall}>
                                <Text style={styles.bold}>
                                  {t('routes.risk_factor_evaluation.elaborating_source')}:{' '}
                                </Text>
                                <Text>{step5.violenceDuringPregnancyDesc}</Text>
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.tableRowDotted}>
                      <View style={styles.tableColDotted100}>
                        <View style={styles.tableCell}>
                          <View style={styles.marginLeft}>
                            <Text style={styles.bold}>{t('routes.assessments.steps.5.other_info')}</Text>
                            <View style={styles.marginLeft}>
                              <Text style={styles.marginTopSmall}>
                                <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
                                <Text style={styles.italic}>
                                  {certaintyOptions[step5.otherChildInfo] || t('errors.unknown')}
                                </Text>
                              </Text>

                              <Text style={styles.marginTopSmall}>
                                <Text style={styles.bold}>
                                  {t('routes.risk_factor_evaluation.elaborating_source')}:{' '}
                                </Text>
                                <Text>{step5.otherChildInfoDesc}</Text>
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.marginBottom}>
                    {pastRiskAssessments?.length > 0 && (
                      <View>
                        <Text style={styles.subtitle}>
                          {t('routes.risk_factor_evaluation.information_from_past_assessments')}
                        </Text>

                        {pastRiskAssessments.map((pastAssessment) => (
                          <View key={pastAssessment.id}>
                            <Text>
                              <Text style={styles.bold}>{t('common.strings.performed')}: </Text>
                              <Text>
                                {pastAssessment?.completedAt
                                  ? formatDate(pastAssessment?.completedAt)
                                  : t('errors.unknown')}
                              </Text>
                              <Text>
                                {'  '}•{'  '}
                              </Text>
                              <Text>
                                {pastAssessment?.adminBids
                                  ? formatAdminBids(pastAssessment?.adminBids)
                                  : t('errors.unknown')}
                              </Text>
                            </Text>
                            <View style={styles.section}>
                              <View style={styles.greyBox}>
                                <View style={styles.marginLeft}>
                                  <Text style={styles.bold}>
                                    {t('routes.assessments.steps.5.violence_against_children')}
                                  </Text>
                                  <View style={styles.marginBottomBig}>
                                    <View style={styles.marginLeft}>
                                      <Text style={styles.marginTopSmall}>
                                        <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
                                        <Text style={styles.italic}>
                                          {certaintyOptions[pastAssessment.step5.doParentsHaveChildViolenceHistory] ||
                                            t('errors.unknown')}
                                        </Text>
                                      </Text>

                                      <Text style={styles.marginTopSmall}>
                                        <Text style={styles.bold}>
                                          {t('routes.risk_factor_evaluation.elaborating_source')}:{' '}
                                        </Text>
                                        <Text>{pastAssessment.step5.doParentsHaveChildViolenceHistoryDesc}</Text>
                                      </Text>
                                    </View>
                                  </View>
                                </View>

                                <View style={styles.marginLeft}>
                                  <Text style={styles.bold}>
                                    {t('routes.assessments.steps.5.child_violence_history')}
                                  </Text>
                                  <View style={styles.marginBottomBig}>
                                    <View style={styles.marginLeft}>
                                      <Text style={styles.marginTopSmall}>
                                        <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
                                        <Text style={styles.italic}>
                                          {certaintyOptions[pastAssessment.step5.childIsExposedToPartnerViolence] ||
                                            t('errors.unknown')}
                                        </Text>
                                      </Text>

                                      <Text style={styles.marginTopSmall}>
                                        <Text style={styles.bold}>
                                          {t('routes.risk_factor_evaluation.elaborating_source')}:{' '}
                                        </Text>
                                        <Text>{pastAssessment.step5.childIsExposedToPartnerViolenceDesc}</Text>
                                      </Text>
                                    </View>
                                  </View>
                                </View>

                                <View style={styles.marginLeft}>
                                  <Text style={styles.bold}>{t('routes.assessments.steps.5.child_threatened')}</Text>
                                  <View style={styles.marginBottomBig}>
                                    <View style={styles.marginLeft}>
                                      <Text style={styles.marginTopSmall}>
                                        <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
                                        <Text style={styles.italic}>
                                          {certaintyOptions[pastAssessment.step5.childIsThreatened] ||
                                            t('errors.unknown')}
                                        </Text>
                                      </Text>

                                      <Text style={styles.marginTopSmall}>
                                        <Text style={styles.bold}>
                                          {t('routes.risk_factor_evaluation.elaborating_source')}:{' '}
                                        </Text>
                                        <Text>{pastAssessment.step5.childIsThreatenedDesc}</Text>
                                      </Text>
                                    </View>
                                  </View>
                                </View>

                                <View style={styles.marginLeft}>
                                  <Text style={styles.bold}>{t('routes.assessments.steps.5.violence_exposure')}</Text>
                                  <View style={styles.marginBottomBig}>
                                    <View style={styles.marginLeft}>
                                      <Text style={styles.marginTopSmall}>
                                        <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
                                        <Text style={styles.italic}>
                                          {certaintyOptions[pastAssessment.step5.didChildExposureIncrease] ||
                                            t('errors.unknown')}
                                        </Text>
                                      </Text>

                                      <Text style={styles.marginTopSmall}>
                                        <Text style={styles.bold}>
                                          {t('routes.risk_factor_evaluation.elaborating_source')}:{' '}
                                        </Text>
                                        <Text>{pastAssessment.step5.didChildExposureIncreaseDesc}</Text>
                                      </Text>
                                    </View>
                                  </View>
                                </View>

                                <View style={styles.marginLeft}>
                                  <Text style={styles.bold}>
                                    {t('routes.assessments.steps.5.violence_during_pregnancy')}
                                  </Text>
                                  <View style={styles.marginBottomBig}>
                                    <View style={styles.marginLeft}>
                                      <Text style={styles.marginTopSmall}>
                                        <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
                                        <Text style={styles.italic}>
                                          {certaintyOptions[pastAssessment.step5.violenceDuringPregnancy] ||
                                            t('errors.unknown')}
                                        </Text>
                                      </Text>

                                      <Text style={styles.marginTopSmall}>
                                        <Text style={styles.bold}>
                                          {t('routes.risk_factor_evaluation.elaborating_source')}:{' '}
                                        </Text>
                                        <Text>{pastAssessment.step5.violenceDuringPregnancyDesc}</Text>
                                      </Text>
                                    </View>
                                  </View>
                                </View>

                                <View style={styles.marginLeft}>
                                  <Text style={styles.bold}>{t('routes.assessments.steps.5.other_info')}</Text>
                                  <View style={styles.marginBottomBig}>
                                    <View style={styles.marginLeft}>
                                      <Text style={styles.marginTopSmall}>
                                        <Text style={styles.bold}>{t('common.strings.answer')}: </Text>
                                        <Text style={styles.italic}>
                                          {certaintyOptions[pastAssessment.step5.otherChildInfo] || t('errors.unknown')}
                                        </Text>
                                      </Text>

                                      <Text style={styles.marginTopSmall}>
                                        <Text style={styles.bold}>
                                          {t('routes.risk_factor_evaluation.elaborating_source')}:{' '}
                                        </Text>
                                        <Text>{pastAssessment.step5.otherChildInfoDesc}</Text>
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* Step 5 Other info row */}
            <View style={styles.tableRow} wrap>
              <View style={styles.tableCol100} wrap>
                <View style={styles.riskFactorEvaluationTableHeaderCell} wrap>
                  <Text style={styles.riskFactorEvaluationTableIntroTitle} wrap>
                    {t('routes.assessments.steps.5.other_relevant_assessment_information')}
                  </Text>
                  <Text style={styles.riskFactorEvaluationTableIntroSubtitle}>
                    {t('routes.assessments.steps.5.other_relevant_assessment_information_desc')}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.tableRow} wrap>
              <View style={styles.tableCol100} wrap>
                <View style={styles.tableCell} wrap>
                  <Text style={styles.subtitle}>{t('routes.assessments.relevant_situation')}</Text>
                  <Sitations situations={step5.otherRelevantSituations} />

                  <View style={styles.marginBottom}>
                    {pastRiskAssessments?.length > 0 && (
                      <View>
                        <Text style={styles.subtitle}>
                          {t('routes.risk_factor_evaluation.information_from_past_assessments')}
                        </Text>

                        {pastRiskAssessments.map((pastAssessment) => (
                          <View key={pastAssessment.id}>
                            <Text>
                              <Text style={styles.bold}>{t('common.strings.performed')}: </Text>
                              <Text>
                                {pastAssessment?.completedAt
                                  ? formatDate(riskAssessment?.completedAt)
                                  : t('errors.unknown')}
                              </Text>
                              <Text>
                                {'  '}•{'  '}
                              </Text>
                              <Text>
                                {pastAssessment?.adminBids
                                  ? formatAdminBids(pastAssessment?.adminBids)
                                  : t('errors.unknown')}
                              </Text>
                            </Text>

                            <View style={styles.section}>
                              <Sitations situations={pastAssessment.step5.otherRelevantSituations} isPast />
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* End of Table */}
          </View>
        </View>
      </Page>

      {/* Page for Step 6: Subjective assessment */}
      <Page size='A4' style={styles.page} wrap>
        <Header />

        <View style={styles.section} wrap>
          <View style={styles.step6Header}>
            <Text style={styles.step6HeaderTitle}>{t('routes.assessments.steps.6.step_name')}</Text>
          </View>

          {/* Subjective Assessment Summary */}
          <View style={styles.blackBorder}>
            <Text style={styles.subtitle2}>{t('routes.assessments.steps.6.step_explanation')}</Text>

            <View style={styles.marginBottomSmall}>
              <View style={styles.yellowWarningBox}>
                <Text style={styles.italic}>
                  {riskAssessment.step6.subjectiveAssessmentDescription || t('errors.unknown')}
                </Text>
              </View>
            </View>

            <View style={styles.subjectiveAssessment}>
              <Text>
                {t('routes.assessments.steps.6.near_future_long')}:{' '}
                <Text style={getStyleForSubjectiveAssessment(step6.nearFutureRisk)}>
                  {step6.nearFutureRisk
                    ? t(`components.toggle_button_group.${step6.nearFutureRisk}`)
                    : t('errors.unknown')}
                </Text>
              </Text>
              <br />
              <Text>
                {t('routes.assessments.steps.6.severe_violence_long')}:{' '}
                <Text style={getStyleForSubjectiveAssessment(step6.severeViolenceRisk)}>
                  {step6.severeViolenceRisk
                    ? t(`components.toggle_button_group.${step6.severeViolenceRisk}`)
                    : t('errors.unknown')}
                </Text>
              </Text>
            </View>

            {pastRiskAssessments?.length > 0 && (
              <View>
                <View style={styles.marginTop}>
                  <Text style={styles.subtitle}>{t('routes.assessments.previous_risk_assessments')}</Text>
                </View>

                {pastRiskAssessments.map((pastAssessment) => (
                  <View key={pastAssessment.id}>
                    <View style={styles.marginBottomSmall}>
                      <Text>
                        <Text style={styles.bold}>{t('common.strings.performed')}: </Text>
                        <Text>
                          {pastAssessment?.completedAt ? formatDate(pastAssessment?.completedAt) : t('errors.unknown')}
                        </Text>
                        <Text>
                          {'  '}•{'  '}
                        </Text>
                        <Text>
                          {pastAssessment?.adminBids ? formatAdminBids(pastAssessment?.adminBids) : t('errors.unknown')}
                        </Text>
                      </Text>
                    </View>

                    <View style={styles.marginBottom}>
                      <View style={styles.greyBox}>
                        <Text style={styles.italic}>
                          {pastAssessment.step6.subjectiveAssessmentDescription || t('errors.unknown')}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.pastSubjectiveAssessment}>
                      <Text>
                        {t('routes.assessments.steps.6.near_future_long')}:{' '}
                        <Text style={styles.bold}>
                          {pastAssessment.step6.nearFutureRisk
                            ? t(`components.toggle_button_group.${pastAssessment.step6.nearFutureRisk}`)
                            : t('errors.unknown')}
                        </Text>
                      </Text>
                      <br />
                      <Text>
                        {t('routes.assessments.steps.6.severe_violence_long')}:{' '}
                        <Text style={styles.bold}>
                          {pastAssessment.step6.severeViolenceRisk
                            ? t(`components.toggle_button_group.${pastAssessment.step6.severeViolenceRisk}`)
                            : t('errors.unknown')}
                        </Text>
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>

      {/* Page for Step 7: Preventive Measures Victim */}
      <Page size='A4' style={styles.page} wrap>
        <Header />

        {/* Step 2 */}
        <View style={styles.section} wrap>
          <View style={styles.riskFactorEvaluationHeader}>
            <Text style={styles.riskFactorEvaluationTitle}>
              {t('routes.assessments.steps.9.suggested_measures_victim')}
            </Text>
          </View>

          <View style={styles.blackBorder}>
            <Text style={styles.subtitle2}>{t('routes.assessments.steps.7.new_measures')}</Text>

            <PreventiveMeasure measures={step7.policePreventiveMeasures} category='police' />
            <PreventiveMeasure measures={step7.healthPreventiveMeasures} category='health' />
            <PreventiveMeasure measures={step7.officialPreventiveMeasures} category='official' />
            <PreventiveMeasure measures={step7.otherPreventiveMeasures} category='other' />

            {pastRiskAssessments?.length > 0 && (
              <View>
                <Text style={styles.subtitle2}>{t('routes.assessments.steps.7.past_measures')}</Text>

                {pastRiskAssessments.map((pastAssessment) => (
                  <View style={styles.marginTop} key={pastAssessment.id}>
                    <PreventiveMeasure
                      measures={pastAssessment.step7.policePreventiveMeasures}
                      category='police'
                      isPast
                    />
                    <PreventiveMeasure
                      measures={pastAssessment.step7.healthPreventiveMeasures}
                      category='health'
                      isPast
                    />
                    <PreventiveMeasure
                      measures={pastAssessment.step7.officialPreventiveMeasures}
                      category='official'
                      isPast
                    />
                    <PreventiveMeasure
                      measures={pastAssessment.step7.otherPreventiveMeasures}
                      category='other'
                      isPast
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>

      {/* Page for Step 8: Preventive Measures Aggressor */}
      <Page size='A4' style={styles.page} wrap>
        <Header />

        {/* Step 2 */}
        <View style={styles.section} wrap>
          <View style={styles.riskFactorEvaluationHeader}>
            <Text style={styles.riskFactorEvaluationTitle}>
              {t('routes.assessments.steps.9.suggested_measures_aggressor')}
            </Text>
          </View>

          <View style={styles.blackBorder}>
            <Text style={styles.subtitle2}>{t('routes.assessments.steps.7.new_measures')}</Text>

            <PreventiveMeasure measures={step8.policePreventiveMeasures} category='police' />
            <PreventiveMeasure measures={step8.healthPreventiveMeasures} category='health' />
            <PreventiveMeasure measures={step8.officialPreventiveMeasures} category='official' />
            <PreventiveMeasure measures={step8.otherPreventiveMeasures} category='other' />

            {pastRiskAssessments?.length > 0 && (
              <View>
                <Text style={styles.subtitle2}>{t('routes.assessments.steps.7.past_measures')}</Text>

                {pastRiskAssessments.map((pastAssessment) => (
                  <View style={styles.marginTop} key={pastAssessment.id}>
                    <PreventiveMeasure
                      measures={pastAssessment.step8.policePreventiveMeasures}
                      category='police'
                      isPast
                    />
                    <PreventiveMeasure
                      measures={pastAssessment.step8.healthPreventiveMeasures}
                      category='health'
                      isPast
                    />
                    <PreventiveMeasure
                      measures={pastAssessment.step8.officialPreventiveMeasures}
                      category='official'
                      isPast
                    />
                    <PreventiveMeasure
                      measures={pastAssessment.step8.otherPreventiveMeasures}
                      category='other'
                      isPast
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.finalText}>
          <Text>{t('routes.assessments.steps.1.intro_name')}</Text>
          <Text>{t('routes.assessments.steps.1.intro_desc_1')} </Text>
          <Text>
            {/* 
                The React PDF library seemingly cannot render the copyright symbol, at least using our font (Arial)
                It was attempted to use Arial Unicode with no luck. So instead we just include an image as a 
                replacement.
            */}
            <Image src={Copyright} style={styles.copyright} />{' '}
            {t('routes.assessments.steps.1.intro_desc_2').replace('©', '')}
          </Text>
        </View>
      </Page>

      {/* End */}
    </Document>
  );
};

RiskAssessmentPDF.propTypes = {
  riskAssessment: PropTypes.any,
};

export const getProps = async (riskAssessmentId, dispatch) => {
  const riskAssessment = await dispatch(getFullRiskAssessment(riskAssessmentId, true));
  return { riskAssessment };
};

export default RiskAssessmentPDF;
