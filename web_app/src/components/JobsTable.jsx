/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, CircularProgress, Grid, IconButton, Tooltip, Typography, capitalize } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import NoImg from '../assets/no_img.png';
import Table from './table/Table';
import '/style/jobs.scss';
import '/style/jobstable.scss';
import '/style/table.scss';
import { deleteJob } from '/modules/jobs';

const JobsTable = ({ jobs, ...props }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const jobColumns = useMemo(
    () => [
      {
        Header: t('routes.jobs.thumbnail'),
        accessor: 'thumbnail',
        Cell: ({ cell }) => {
          console.log('rendering thumbnail. cell.value', cell.value);
          return (
            <img
              // src={cell?.value?.data ? { uri: `data:${cell?.value?.contentType};base-64,${cell?.value.data}` } : NoImg}
              src={cell?.value?.path ? `${API_HOST.replace('/api', '')}/${cell?.value.path}` : NoImg}
              width={100}
              height={100}
              style={{ objectFit: 'contain' }}
            />
          );
        },
        colWidth: '110px',
      },
      {
        Header: t('routes.jobs.file_name'),
        accessor: 'originalFileName',
        Cell: ({ cell }) => <Typography variant='body2'>{cell.row.original.image.filename}</Typography>,
      },
      {
        Header: t('routes.jobs.started_at'),
        accessor: 'createdAt',
        Cell: ({ cell }) => (
          <Typography variant='body2'>{cell.value ? dayjs(cell.value).format('MMMM D YYYY, HH:mm') : ''}</Typography>
        ),
        colWidth: '170px',
      },
      {
        Header: t('routes.jobs.status'),
        accessor: 'status',
        Cell: ({ cell }) => {
          const statusText = t(`routes.jobs.${cell.value}`);
          const statusImg =
            {
              processing: <CircularProgress className='ProcessingIcon' />,
              complete: <CheckCircleIcon className='CompleteIcon' />,
            }[cell.value] || null;
          return (
            <>
              <Typography variant='body2' className={`JobStatus ${cell.value === 'pending' ? 'WeakText Italic' : ''}`}>
                {statusText} {statusImg}
              </Typography>
            </>
          );
        },
        colWidth: '140px',
      },
      {
        Header: t('common.strings.actions'),
        Cell: ({ cell }) => {
          return <RowActions row={cell.row.original} />;
        },
        colWidth: '50px',
      },
    ],
    []
  );

  const onClickView = (job) => {
    console.log('view clicked! job', job);
  };

  const onClickDownload = (job) => {
    console.log('download clicked! job', job);
  };

  const onClickDelete = (id) => {
    dispatch(deleteJob(id));
  };

  const RowActions = React.memo(({ row }) => (
    <Box display='flex' justifyContent='center'>
      <Tooltip title={t('common.actions.view')}>
        <IconButton size='small' onClick={() => onClickView(row)}>
          <ViewIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={t('common.actions.download')}>
        <IconButton size='small' onClick={() => onClickDownload(row)}>
          <DownloadIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={t('common.actions.delete')}>
        <IconButton size='small' onClick={() => onClickDelete(row.id)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  ));

  return (
    <Grid item xs={12} className='JobsTable'>
      <Table
        title={t('routes.jobs.page_title')}
        subtitle={t('routes.jobs.jobs_description')}
        columns={jobColumns}
        data={jobs || []}
        defaultSort={{ id: 'createdAt', desc: true }}
        dense
        includeCount={jobs?.length > 0}
        hideTable={jobs?.length === 0}
        {...props}
      />
    </Grid>
  );
};

JobsTable.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default React.memo(JobsTable);
