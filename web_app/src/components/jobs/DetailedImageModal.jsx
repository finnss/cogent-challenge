/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

import NoImg from '/assets/no_img.png';
import Table from '/components/table/Table';
import Modal from '/components/common/Modal';
import Link from '/components/common/Link';
import { deleteJob } from '/modules/jobs';
import { showToast } from '/modules/toast';
import { getImageUrl } from '/util';
import '/style/jobs.scss';
import '/style/jobstable.scss';
import '/style/table.scss';

/**
 * DetailedImageModal is a modal used to show detailed information about an image. This modal
 * is shown when the user clicks on a row in the jobs table to get more details.
 */
const DetailedImageModal = ({ dataForDetailedImageModal, setDataForDetailedImageModal, deleteCallback }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        Header: t('components.detailed_image.full_size_image'),
        accessor: 'image_path',
        Cell: ({ cell }) => <img src={getImageUrl(cell.row.original.image.path) || NoImg} />,
      },
      {
        Header: t('components.jobs_table.thumbnail'),
        accessor: 'thumbnail',
        Cell: ({ cell }) => (
          <img
            src={getImageUrl(cell?.value?.path) || NoImg}
            width={100}
            height={100}
            style={{ objectFit: 'contain', marginTop: '8px' }}
          />
        ),
        colWidth: '110px',
      },
      {
        Header: t('components.jobs_table.original_file_name'),
        accessor: 'originalFileName',
        Cell: ({ cell }) => <Typography variant='body2'>{cell.row.original.image.originalName}</Typography>,
      },
      {
        Header: t('components.detailed_image.image_url'),
        accessor: 'image_url',
        Cell: ({ cell }) => {
          const url = getImageUrl(cell?.row?.original?.image?.path);
          return url ? <Link to={url}>{url}</Link> : '–';
        },
      },
      {
        Header: t('components.jobs_table.thumbnail_url'),
        accessor: 'thumbnail_url',
        Cell: ({ cell }) => {
          const url = getImageUrl(cell?.row?.original?.thumbnail?.path);
          return url ? <Link to={url}>{url}</Link> : '–';
        },
      },
      {
        Header: t('components.detailed_image.image_uploaded_at'),
        accessor: 'uploadedAt',
        Cell: ({ cell }) => (
          <Typography variant='body2'>
            {cell?.row?.original?.image?.createdAt
              ? dayjs(cell.row.original.image.createdAt).format('MMMM D YYYY, HH:mm')
              : ''}
          </Typography>
        ),
        colWidth: '170px',
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

  const onClickDownload = (job) => {
    const imageUrl = getImageUrl(job?.thumbnail?.path);
    if (imageUrl) {
      saveAs(imageUrl, job?.thumbnail?.filename);
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
    <Modal
      title={t('components.detailed_image.title')}
      open={dataForDetailedImageModal !== null}
      onClose={() => setDataForDetailedImageModal(null)}
      actions={[
        {
          label: t('common.actions.close'),
          action: () => setDataForDetailedImageModal(null),
          variant: 'text',
        },
      ]}
      className='ImageModal'>
      <Grid container spacing={3}>
        {dataForDetailedImageModal && (
          <Table
            columns={columns}
            data={[dataForDetailedImageModal]}
            defaultSort={{ id: 'uploadedAt', desc: true }}
            dense
            includeCount={false}
          />
        )}
      </Grid>
    </Modal>
  );
};

DetailedImageModal.propTypes = {
  dataForDetailedImageModal: PropTypes.object,
  setDataForDetailedImageModal: PropTypes.any.isRequired,
  deleteCallback: PropTypes.func,
};

export default React.memo(DetailedImageModal);
