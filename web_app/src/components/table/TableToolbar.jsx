/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Popover, Stack, Typography, Divider, Box, Chip } from '@mui/material';
import { FilterList as FilterListIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Search from '/components/common/Search';

/**
 * Toolbar displayed over table that contains search, row actions etc...
 * @returns {JSX.Element} - TableToolbar
 */
function TableToolbar(
  { actions, setFilter, resetFilters, filters, filterValues, exportCsv, showSearch, paginationComponent },
  ref
) {
  const [filterAnchor, setFilterAnchor] = useState(null);

  const handleSearchQuery = useMemo(
    () => _.debounce((query) => setFilter('search', query || undefined), 200),
    [setFilter]
  );

  useEffect(() => {
    return () => handleSearchQuery.cancel();
  }, []);

  // filters that have the "component" property defined are visible
  const visibleFilters = useMemo(() => filters?.filter((f) => !!f.component), [filters]);
  const showFilters = Boolean(visibleFilters?.length > 0);

  return (
    <div className='TableToolbar' ref={ref}>
      {showFilters && (
        <Button
          className='FilterBtn'
          variant='outlined'
          color='primary'
          startIcon={<FilterListIcon />}
          onClick={(e) => setFilterAnchor(e.currentTarget)}>
          Filter
        </Button>
      )}
      {showSearch && <Search onChange={handleSearchQuery} />}
      {showFilters && (
        <FiltersPopover
          filters={visibleFilters}
          filterValues={filterValues}
          setFilter={setFilter}
          resetFilters={resetFilters}
          open={Boolean(filterAnchor)}
          anchorEl={filterAnchor}
          onClose={() => setFilterAnchor(null)}
        />
      )}
      {paginationComponent}
      {actions && <TableActions actions={actions} exportCsv={exportCsv} />}
      {showFilters && (
        <SelectedFilters
          filters={visibleFilters}
          filterValues={filterValues}
          setFilter={setFilter}
          resetFilters={resetFilters}
        />
      )}
    </div>
  );
}

TableToolbar = forwardRef(TableToolbar);
TableToolbar.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object),
  setFilter: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
  filters: PropTypes.arrayOf(PropTypes.object),
  filterValues: PropTypes.object,
  exportCsv: PropTypes.func.isRequired,
  showSearch: PropTypes.bool.isRequired,
  paginationComponent: PropTypes.element,
};

function FiltersPopover({ filters, filterValues, setFilter, resetFilters, open, anchorEl, onClose }) {
  const { t } = useTranslation();

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      PaperProps={{ sx: { p: 2 } }}>
      <Stack spacing={2} direction='row' divider={<Divider orientation='vertical' flexItem />}>
        {filters.map((filter) => (
          <Box key={filter.name} display='grid' gridAutoFlow='column' gridTemplateRows='repeat(5, min-content)'>
            <Typography variant='subtitle2' color='secondary' sx={{ p: 1, textAlign: 'center', gridColumn: 'span 5' }}>
              {filter.label}
            </Typography>
            <filter.component filter={filter} setFilter={setFilter} value={filterValues[filter.name]} />
          </Box>
        ))}
      </Stack>
      <Stack spacing={1} mt={2} direction='row'>
        <Button variant='outlined' size='small' onClick={onClose}>
          {t('lukk')}
        </Button>
        <Button variant='outlined' size='small' onClick={resetFilters}>
          {t('reset')}
        </Button>
      </Stack>
    </Popover>
  );
}

/**
 * Check if a filter has been changed from the default value
 * @returns {boolean}
 */
const isFilterChanged = () => {
  const currentValue = filterValues[filter.name];
  const unchanged = currentValue === filter.defaultValue || _.isEqual(currentValue, filter.defaultValue);
  return !unchanged;
};

/**
 * Displays filter values as chips and allows to reset the filters, if they
 * have been changed from default values
 * @returns {JSX.Element} - SelectedFilters
 */
function SelectedFilters({ filters, filterValues, setFilter, resetFilters }) {
  const { t } = useTranslation();

  // show reset filter button if any filters have been changed
  const anyChanged = filters.some((f) => isFilterChanged(f, filterValues));

  return (
    <Stack className='SelectedFilters' direction='row' spacing={1}>
      {anyChanged && (
        <Button onClick={resetFilters} startIcon={<DeleteIcon />}>
          {t('reset_filter')}
        </Button>
      )}
      {filters.map((filter) => {
        const value = filterValues[filter.name];
        const chips = value != null ? filter.chips?.(value) : [];
        const shouldShowDelete = isFilterChanged(filter, filterValues);

        return chips?.map(([chipValue, label]) => (
          <Chip
            key={label}
            label={label}
            onDelete={shouldShowDelete ? () => filter.onClick(setFilter, value, chipValue) : null}
          />
        ));
      })}
    </Stack>
  );
}

function TableActions({ actions, exportCsv }) {
  return (
    <div className='Actions'>
      {actions
        .filter((action) => action.condition ?? true)
        .map((action) => {
          const Icon = action.icon;
          const onClick = action.action === 'export' ? exportCsv : action.action;

          return (
            <Button
              key={action.label}
              variant={action.variant ?? 'contained'}
              onClick={onClick}
              startIcon={Icon && <Icon />}>
              {action.label}
            </Button>
          );
        })}
    </div>
  );
}

TableActions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object),
  exportCsv: PropTypes.func,
};

export default TableToolbar;
