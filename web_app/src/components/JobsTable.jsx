/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import NoImg from '../assets/no_img.png';
import Table from './table/Table';
import '/style/jobs.scss';
import '/style/jobstable.scss';
import '/style/table.scss';

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
            <img src={cell?.value?.data ? `data:${cell?.value?.contentType};base-64,${cell?.value.data}` : NoImg} />
          );
        },
      },
      {
        Header: t('routes.jobs.file_name'),
        accessor: 'originalFileName',
        Cell: ({ cell }) => <Typography variant='body2'>{cell.row.original.image.filename}</Typography>,
      },
      {
        Header: t('routes.jobs.status'),
        accessor: 'status',
        Cell: ({ cell }) => <Typography variant='body2'>{t(`routes.jobs.${cell.value}`)}</Typography>,
      },
      {
        Header: t('routes.jobs.started_at'),
        accessor: 'createdAt',
        Cell: ({ cell }) => (
          <Typography variant='body2'>{cell.value ? dayjs(cell.value).format('MMMM D YYYY, HH:mm') : ''}</Typography>
        ),
      },
      {
        Header: t('common.strings.actions'),
        Cell: ({ cell }) => {
          const onEditClick = () => this.handleEdit(cell.row.original);
          const onDeleteClick = () => this.handleDelete(cell.row.original);
          // The default profile with id 0 (none selected) should not be deletable
          const shouldShowDelete = cell.row.original.id !== 0;
          return <RowActions onEdit={onEditClick} onDelete={onDeleteClick} shouldShowDelete={shouldShowDelete} t={t} />;
        },
      },
    ],
    []
  );

  const onJobRowClick = (e, row) => {
    const job = row?.original;
    const { imageId } = job;
    navigate(`/images/${imageId}`);
  };

  const RowActions = React.memo(({ onEdit, onDelete, shouldShowDelete, t }) => (
    <Box display='inline-flex' justifyContent='space-between' width='4rem'>
      <Tooltip title={t('common.actions.edit')}>
        <IconButton size='small' onClick={onEdit}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      {shouldShowDelete && (
        <Tooltip title={t('common.actions.delete')}>
          <IconButton size='small' onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
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
        onClick={onJobRowClick}
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
