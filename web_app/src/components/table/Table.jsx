import React, { memo, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTable, usePagination, useSortBy } from 'react-table';
import {
  Table as MTable,
  TableBody,
  TableCell as MTableCell,
  TableContainer,
  TableHead as MTableHead,
  TablePagination,
  TableRow as MTableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import { TABLE_PAGINATION_ALL } from '../../util';
import '../../style/table.scss';
import clsx from 'clsx';
import { Diversity2Sharp } from '@mui/icons-material';

const TableToolbar = ({ title, toolbarComponent }) => {
  return (
    <Toolbar className='ToolbarRoot'>
      <Typography variant='h6' className='ToolbarTitle'>
        {title}
      </Typography>
      {toolbarComponent}
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  toolbarComponent: PropTypes.node,
};

TableToolbar.defaultProps = {
  toolbarComponent: null,
};

const TableHead = ({ headerGroups, handleSort }) => (
  <MTableHead>
    {headerGroups.map((headerGroup) => {
      const headerProps = headerGroup.getHeaderGroupProps();
      return (
        <MTableRow {...headerProps} key={headerProps.key}>
          {headerGroup.headers.map((column) => {
            const columnProps = column.getHeaderProps();
            return (
              <MTableCell
                {...columnProps}
                sortDirection={column.isSorted && column.isSortedDesc ? 'desc' : 'asc'}
                align={column.align}
                style={column.colWidth && { width: column.colWidth }}
                key={columnProps.key}>
                <TableSortLabel
                  disabled={!column.canSort}
                  active={column.isSorted}
                  direction={column.isSortedDesc ? 'desc' : 'asc'}
                  onClick={() => handleSort(column)}>
                  {column.render('Header')}
                </TableSortLabel>
              </MTableCell>
            );
          })}
        </MTableRow>
      );
    })}
  </MTableHead>
);

TableHead.propTypes = {
  headerGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSort: PropTypes.func.isRequired,
};

const TablePage = memo(({ page, prepareRow, onRowClick, activeRow }) => {
  return page.map((row) => (
    <TableRow key={row.id} row={row} prepareRow={prepareRow} onClick={onRowClick} isActive={row.id === activeRow} />
  ));
});

TablePage.propTypes = {
  page: PropTypes.arrayOf(PropTypes.object),
  prepareRow: PropTypes.func,
  onRowClick: PropTypes.func,
  activeRow: PropTypes.string,
};

// Memoized table row
const TableRow = memo(({ row, prepareRow, onClick, isActive }) => {
  prepareRow(row);
  return (
    <MTableRow
      {...row.getRowProps()}
      hover
      selected={isActive}
      onClick={(e) => (onClick ? onClick(e, row) : {})}
      className='TableRow'
      classes={{
        selected: 'TableRowSelected',
        hover: clsx('TableRowHover', onClick && 'TableRowClick'),
      }}>
      {row.cells.map((cell) => {
        const cellProps = cell.getCellProps();
        return (
          <MTableCell id={row.id} {...cellProps} align={cell.column.align} key={cellProps.key}>
            {cell.render('Cell')}
          </MTableCell>
        );
      })}
      {onClick && (
        <MTableCell style={{ padding: 0, verticalAlign: 'middle' }}>
          <ArrowForwardIcon className='TableArrow' />
        </MTableCell>
      )}
    </MTableRow>
  );
});

TableRow.propTypes = {
  row: PropTypes.object,
  prepareRow: PropTypes.func,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};

const MetaRow = memo(({ metaRow, headers, onClick }) => (
  <MTableRow hover onClick={onClick} classes={{ hover: onClick && 'TableRowClick' }}>
    <MTableCell id={-1} align={headers[0].align} className='MetaRowCell'>
      {metaRow.Name}
    </MTableCell>
    {metaRow.cells.map((cell, idx) => (
      <MTableCell id={-1} key={idx} align={headers[idx + 1].align} className='MetaRowCell'>
        {cell}
      </MTableCell>
    ))}
  </MTableRow>
));

MetaRow.propTypes = {
  metaRow: PropTypes.object,
  headers: PropTypes.arrayOf(PropTypes.object),
  onClick: PropTypes.func,
};

const HeaderRowOutsideTable = ({ title, subtitle, includeCount, data }) => {
  const { t } = useTranslation();
  return (
    <Grid item xs={12} className='SpaceBetween HeaderRowOutsideTable'>
      {title ? (
        <Grid item container flexDirection='column' spacing={1} style={{ marginLeft: 0 }}>
          <Typography variant='h6'>{title}</Typography>
          {subtitle &&
            (typeof subtitle === 'string' ? (
              <Typography variant='body2' className='WeakText'>
                {subtitle}
              </Typography>
            ) : (
              subtitle
            ))}
        </Grid>
      ) : (
        <span> </span>
      )}
      {includeCount && (
        <Grid
          item
          container
          flexDirection='row'
          spacing={1}
          style={{ justifyContent: 'end', alignItems: 'end' }}
          className='WeakText'>
          {includeCount && <span>{`${t('common.strings.amount')}: ${data?.length}`}</span>}
        </Grid>
      )}
    </Grid>
  );
};

HeaderRowOutsideTable.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  includeCount: PropTypes.bool,
  data: PropTypes.any,
};

const Table = ({
  columns,
  hiddenColumns,
  data,
  title,
  subtitle,
  dense,
  rowsPerPageOptions,
  defaultSort,
  metaRow,
  sortStateChanged,
  activeRow,
  onClick,
  pagination,
  includeCount,
  hideTable,
}) => {
  const { t } = useTranslation();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    headers,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    toggleSortBy,
    state,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: defaultSort ? [{ id: defaultSort.id, desc: defaultSort.desc }] : [],
        pageSize: rowsPerPageOptions[0],
        hiddenColumns,
      },
      autoResetPage: true,
    },
    useSortBy,
    usePagination
  );

  const handleChangePage = (_, newPage) => gotoPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    gotoPage(0);
  };

  const handleSort = (column) => {
    toggleSortBy(column.id, !column.isSortedDesc, false);
    if (sortStateChanged) {
      sortStateChanged(new SortState(column.id, !column.isSortedDesc));
    }
  };

  const onRowClick = React.useMemo(
    () =>
      onClick
        ? (e, row) => {
            onClick(e, row);
          }
        : null,
    [onClick, data]
  );

  return (
    <Grid container spacing={1}>
      {(title || subtitle || includeCount) && (
        <HeaderRowOutsideTable title={title} subtitle={subtitle} includeCount={includeCount} data={data} />
      )}

      {!hideTable && (
        <Grid item xs={12}>
          <Paper className='TableContainer'>
            <TableContainer>
              <MTable {...getTableProps()} size={dense ? 'small' : 'medium'}>
                <TableHead headerGroups={headerGroups} handleSort={handleSort} />
                <TableBody {...getTableBodyProps()}>
                  <TablePage page={page} prepareRow={prepareRow} onRowClick={onRowClick} activeRow={activeRow} />
                  {metaRow && <MetaRow metaRow={metaRow} headers={headers} onClick={onRowClick} />}
                </TableBody>
              </MTable>
            </TableContainer>

            {pagination && (
              <TablePagination
                rowsPerPageOptions={[
                  ...rowsPerPageOptions,
                  { value: TABLE_PAGINATION_ALL, label: t('components.table.all') },
                ]}
                component='div'
                labelRowsPerPage={t('components.table.label_rows_per_page')}
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to === -1 ? count : to} av ${count !== -1 ? count : `mer enn ${to}`}`
                }
                count={data?.length || 0}
                rowsPerPage={state.pageSize}
                page={state.pageIndex}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  hiddenColumns: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  dense: PropTypes.bool,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  defaultSort: PropTypes.object,
  toolbarComponent: PropTypes.node,
  metaRow: PropTypes.object,
  sortStateChanged: PropTypes.func,
  activeRow: PropTypes.string,
  onClick: PropTypes.func,
  pagination: PropTypes.bool,
  includeCount: PropTypes.bool,
  hideTable: PropTypes.bool,
};

Table.defaultProps = {
  hiddenColumns: [],
  dense: false,
  rowsPerPageOptions: [15, 30, 100],
  defaultSort: [],
  toolbarComponent: null,
  metaRow: null,
  sortStateChanged: null,
  activeRow: '',
  onClick: null,
  pagination: false,
  includeCount: false,
  hideTable: false,
};

export default memo(Table);
