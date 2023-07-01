import { memo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Paper, CardHeader, IconButton, Button, Tooltip } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import clsx from 'clsx';
import '/style/card.scss';

const Card = ({
  className,
  title,
  subTitle,
  headerAction,
  primaryActions,
  secondaryActions,
  compact,
  sx,
  children,
}) => {
  const [showExpand, setShowExpand] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const contentRef = useRef();

  useEffect(() => {
    // Check if content is overflowing, and show expand button
    if (compact && contentRef.current) {
      const resizeObserver = new ResizeObserver(([content]) => {
        const target = content.target;
        const text = target.querySelector('p');

        const overflowing = target.scrollHeight > target.clientHeight || target.scrollWidth > target.clientWidth;
        const textOverflowing = text ? text.scrollWidth > text.clientWidth : false;

        // Show expand button if content is overflowing
        setShowExpand(overflowing || textOverflowing);
      });

      resizeObserver.observe(contentRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [compact, contentRef.current]);

  const toggleExpand = () => {
    setExpanded(!isExpanded);
  };

  return (
    <Paper className={clsx('Card', className)} variant='outlined' square sx={sx}>
      <CardHeader action={headerAction} title={title} subheader={subTitle} />
      <div className={clsx('CardContent', compact && !isExpanded && 'Compact')} ref={contentRef}>
        {children}
      </div>
      <div className='CardActions'>
        {primaryActions?.map(({ label, action }) => (
          <Button key={label} variant='text' onClick={action}>
            {label}
          </Button>
        ))}
        <div className='SecondaryActions'>
          {secondaryActions?.map(({ label, icon: Icon, action }) => (
            <Tooltip key={label} title={label}>
              <IconButton onClick={action}>
                <Icon />
              </IconButton>
            </Tooltip>
          ))}
          {(showExpand || isExpanded) && (
            <IconButton className={clsx('ExpandBtn', isExpanded && 'IsExpanded')} onClick={toggleExpand}>
              <ExpandMoreIcon />
            </IconButton>
          )}
        </div>
      </div>
    </Paper>
  );
};

Card.propTypes = {
  className: PropTypes.any,
  title: PropTypes.node,
  subTitle: PropTypes.node,
  headerAction: PropTypes.node,
  primaryActions: PropTypes.arrayOf(PropTypes.object),
  secondaryActions: PropTypes.arrayOf(PropTypes.object),
  compact: PropTypes.bool,
  sx: PropTypes.object,
  children: PropTypes.node,
};

Card.defaultProps = {
  compact: false,
};

export default memo(Card);
