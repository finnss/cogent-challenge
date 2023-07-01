import { memo, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Wraps a component and shows text in tooltip on mouseover
 * @param {string} text
 * @returns {JSX.Element}
 */
function InfoIconTooltip({ text, className }) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip
      className={className}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      title={text}
      disableInteractive
      placement='top-start'>
      <InfoIcon />
    </Tooltip>
  );
}

InfoIconTooltip = memo(InfoIconTooltip);
InfoIconTooltip.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default InfoIconTooltip;
