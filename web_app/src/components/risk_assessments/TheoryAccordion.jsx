import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import '/style/riskassessments.scss';

/**
 *
 * @param {string} text - Text to be shown when opening the accordion
 * @param {string} source - source for the theory text
 * @returns {JSX.Element} - Component to render an accordion displaying
 *                          the relevant theory for a specific part of a Risk Assessment
 */
const TheoryAccordion = ({ text, source, sx, className }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Accordion
      expanded={expanded === 'panel'}
      onChange={toggleExpanded('panel')}
      elevation={0}
      className='TheoryAccordion'>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <MenuBookIcon className='MenuBookIcon' />
        <Typography variant='body2' style={{ marginLeft: '8px' }}>
          {t('routes.assessments.relevant_theory')}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {text?.split('\n').map((s, index) => (
          <Typography variant='body2' key={index} style={{ paddingBottom: '8px' }}>
            {s}
          </Typography>
        ))}
        <Typography variant='body2' className='WeakText'>
          {source}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

TheoryAccordion.propTypes = {
  text: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  sx: PropTypes.object,
  className: PropTypes.string,
};

export default memo(TheoryAccordion);
