/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import NoImg from '/assets/no_img.png';
import Table from '/components/table/Table';
import DetailedImageModal from '/components/jobs/DetailedImageModal';
import { deleteJob } from '/modules/jobs';
import { showToast } from '/modules/toast';
import { getImage } from '/modules/images';
import { getImageUrl, truncate } from '/util';
import '/style/jobs.scss';
import '/style/jobstable.scss';
import '/style/table.scss';
import Link from '/components/common/Link';

const JobsTable = ({ jobs, truncateUrl, deleteCallback, ...props }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [dataForDetailedImageModal, setDataForDetailedImageModal] = useState(null);

  const jobColumns = useMemo(
    () => [
      {
        Header: t('components.jobs_table.thumbnail'),
        accessor: 'thumbnail',
        Cell: ({ cell }) => {
          return (
            <img
              src={getImageUrl(cell?.value?.path) || NoImg}
              width={100}
              height={100}
              style={{ objectFit: 'contain', marginTop: '8px' }}
            />
          );
        },
        colWidth: '110px',
      },
      {
        Header: t('components.jobs_table.original_file_name'),
        accessor: 'originalFileName',
        Cell: ({ cell }) => <Typography variant='body2'>{cell.row.original.image.originalName}</Typography>,
      },
      {
        Header: t('components.jobs_table.thumbnail_url'),
        accessor: 'thumbnail_url',
        Cell: ({ cell }) => {
          const url = getImageUrl(cell?.row?.original?.thumbnail?.path);
          return url ? <Link to={url}>{truncateUrl ? truncate(url, 50) : url}</Link> : '–';
        },
      },
      {
        Header: t('components.jobs_table.started_at'),
        accessor: 'createdAt',
        Cell: ({ cell }) => (
          <Typography variant='body2'>{cell.value ? dayjs(cell.value).format('MMMM D YYYY, HH:mm') : ''}</Typography>
        ),
        colWidth: '170px',
      },
      {
        Header: t('components.jobs_table.status'),
        accessor: 'status',
        Cell: ({ cell }) => {
          const statusText = t(`components.jobs_table.${cell.value}`);
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

  const onClickView = async (job) => {
    const detailedImage = await dispatch(getImage(job?.image?.id));
    if (detailedImage) {
      setDataForDetailedImageModal({ ...job, image: detailedImage });
    } else {
      dispatch(showToast(t('errors.detailed_image')));
    }
  };

  const onClickDownload = (job) => {
    const imageUrl = getImageUrl(job?.thumbnail?.path);

    if (imageUrl) {
      saveAs(imageUrl, job.image.filename);
    } else {
      dispatch(showToast(t('errors.download_no_url', 5000, 'error')));
    }
  };

  const onClickDelete = async (id) => {
    const deletedId = await dispatch(deleteJob(id, true));
    if (deletedId) {
      dispatch(showToast(t('components.jobs_table.deleted')));
      deleteCallback && deleteCallback(id);
    } else {
      dispatch(showToast(t('errors.cannot_delete')));
    }
  };

  const RowActions = React.memo(({ row }) => (
    <Box display='flex' justifyContent='center'>
      <Tooltip title={t('common.actions.view')}>
        <IconButton size='small' onClick={() => onClickView(row)}>
          <ViewIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={t('components.jobs_table.download')}>
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
    <>
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

      <DetailedImageModal
        dataForDetailedImageModal={dataForDetailedImageModal}
        setDataForDetailedImageModal={setDataForDetailedImageModal}
      />
    </>
  );
};

JobsTable.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.object).isRequired,
  truncateUrl: PropTypes.bool,
  deleteCallback: PropTypes.func,
};

JobsTable.defaultProps = {
  truncateUrl: false,
};

export default React.memo(JobsTable);
