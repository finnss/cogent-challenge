import { memo } from 'react';
import { Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import '/style/infocard.scss';
import ContentBox from './ContentBox';
import Link from './Link';
import { useTranslation } from 'react-i18next';

/**
 * Displays an object {"label": "content"} like a table of 2 columns without a header row
 * @param {{ data: object }}
 * @param {{ sx: string }}
 * @param {{ className: string }}
 * @returns {JSX.Element}
 */
const InfoCard = ({ data, sx, className }) => {
  const { t } = useTranslation();

  const splitValue = (data) => {
    const split = data?.split('\n');
    return split?.length > 1
      ? split.reduce(
          (soFar, current) =>
            soFar === '' ? (
              <>{current}</>
            ) : (
              <>
                {soFar}
                <br />
                {current}
              </>
            ),
          ''
        )
      : data;
  };

  const renderValue = (value) => {
    if (!value || value.length === 0 || (typeof value === 'string' && value.trim() === '')) return t('errors.unknown');

    if (typeof value === 'string') {
      return splitValue(value);
    }
    if (typeof value === 'object') {
      const text = splitValue(value.text);
      if (value.link)
        return (
          <Link to={value.link} style={{ fontWeight: 500 }}>
            {text}
          </Link>
        );
      return { text };
    }
    return value;
  };

  return (
    <ContentBox className={clsx('InfoCard', className)} noPadding sx={sx || {}}>
      {Object.keys(data).map((key) => (
        <div className='Row' key={key}>
          <span className='Key'>{key}</span>

          <span className='Value'>{renderValue(data[key])}</span>
        </div>
      ))}
    </ContentBox>
  );
};

InfoCard.propTypes = {
  data: PropTypes.object.isRequired,
  sx: PropTypes.object,
  className: PropTypes.string,
};

export default memo(InfoCard);
