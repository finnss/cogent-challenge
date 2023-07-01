import { memo, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@mui/material';
import { toJSDate } from '/util/converters';
import { dateTime } from '/util/formatters';
import { useTranslation } from 'react-i18next';

/**
 * Wraps a component and shows "received: {date}" in tooltip on mouseover
 * @returns {JSX.Element}
 */
function TimestampTooltip({ timestamp, children }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const title = useMemo(() => (open ? `${t('mottatt')}: ${dateTime(toJSDate(timestamp))}` : ''), [open]);

  if (timestamp) {
    return (
      <Tooltip
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        title={title}
        disableInteractive
        placement='top-start'>
        {children}
      </Tooltip>
    );
  }

  return children;
}

TimestampTooltip = memo(TimestampTooltip);
TimestampTooltip.propTypes = {
  timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]),
  children: PropTypes.node,
};

export default TimestampTooltip;
