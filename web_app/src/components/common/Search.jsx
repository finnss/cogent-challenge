import React, { memo, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, IconButton, InputBase } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import '/style/search.scss';

import Loading from './Loading';
import SearchResults from './SearchResults';
import { performSearch } from '../../modules/search';
import { useKeyPress, useOnClickOutside } from '../../util';
import PersonFormModal from '../forms/PersonFormModal';
import { showToast } from '/modules/toast';

const Search = ({
  initialValue,
  placeHolder,
  style,
  className,
  inputClassName,
  iconClassName,
  customIcon,
  onIconClick,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchResultWindowRef = useRef();

  const [searchText, setSearchText] = useState(initialValue);
  const [showRegisterPersonModal, setShowRegisterPersonModal] = useState(false);
  const isLoading = useSelector((state) => state.search.loading);
  const searchResults = useSelector((state) => state.search.results);
  const [showResults, setShowResults] = useState(false);
  useOnClickOutside(searchResultWindowRef, () => setShowResults(false));

  useEffect(() => {
    if (showResults) {
      setShowResults(false);
    }
  }, [searchText]);

  const onSearch = () => {
    dispatch(performSearch(searchText.trim()));
    setShowResults(true);
  };

  useKeyPress('Enter', showRegisterPersonModal ? () => {} : onSearch, [onSearch, showRegisterPersonModal]);

  const onRegisterPersonSuccess = async (id) => {
    dispatch(showToast(t('routes.persons.create_success'), 5000));
    navigate(`/persons/${id}`);
  };

  return (
    <Grid item xs={12} container direction='column' className={clsx('SearchContainer', className)} spacing={3}>
      <Grid item xs={12} sx={{ width: '100%' }}>
        <SearchInput
          onChange={(searchVal) => setSearchText(searchVal)}
          placeHolder={placeHolder || t('routes.search.placeholder')}
          value={searchText}
          className={clsx('SearchBox', inputClassName)}
          style={style}
          customIcon={customIcon || (isLoading && <Loading noText size={15} />)}
          onIconClick={onIconClick || onSearch}
          iconClassName={iconClassName}
        />
      </Grid>
      <Grid item xs={12} ref={searchResultWindowRef} className='SearchResultContainer'>
        {showResults && searchResults && (
          <SearchResults
            results={searchResults}
            searchText={searchText}
            onRegisterPerson={(formValues) => {
              setShowRegisterPersonModal(true);
            }}
          />
        )}
      </Grid>

      <PersonFormModal
        defaultValues={{
          fullName: !!searchText?.match(/^[-\s]*[A-Åa-å]+(?:[-\s][A-Åa-å]+)+[-\s]*$/i) ? searchText : undefined,
          personNr: searchText?.length === 11 ? searchText : undefined,
        }}
        open={showRegisterPersonModal}
        onClose={() => setShowRegisterPersonModal(false)}
        className='RegisterPersonModal'
        onSuccess={onRegisterPersonSuccess}
      />
    </Grid>
  );
};

Search.propTypes = {
  initialValue: PropTypes.string,
  placeHolder: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  iconClassName: PropTypes.string,
  customIcon: PropTypes.any,
  onIconClick: PropTypes.func,
};

Search.defaultProps = {
  initialValue: '',
  style: {},
  className: null,
  inputClassName: null,
  iconClassName: null,
};

/**
 * Displays an input field with search icon on the right hand side.
 * @param {{ initialValue: string }}
 * @param {{ placeHolder: string }}
 * @param {{ onChange: func }}
 * @param {{ style: object }}
 * @param {{ className: string }}
 * @param {{ iconClassName: string }}
 * @param {{ customIcon: JSX.Element }}
 * @param {{ onIconClick: func }}
 * @returns {JSX.Element}
 */
export const SearchInput = ({
  value,
  placeHolder,
  onChange,
  style,
  className,
  iconClassName,
  customIcon,
  onIconClick,
  hideIcon,
}) => {
  const { t } = useTranslation();

  return (
    <div className={clsx('SearchInput', className)} style={style || {}}>
      <InputBase
        value={value}
        placeholder={placeHolder || `${t('common.actions.search')}...`}
        onChange={(e) => {
          const t = e.target.value;
          onChange(t);
        }}
      />
      {!hideIcon && (
        <IconButton className={clsx('SearchIcon', iconClassName)} onClick={onIconClick}>
          {customIcon || <SearchIcon />}
        </IconButton>
      )}
    </div>
  );
};

SearchInput.propTypes = {
  value: PropTypes.string,
  placeHolder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  customIcon: PropTypes.any,
  onIconClick: PropTypes.func,
  hideIcon: PropTypes.bool,
};

SearchInput.defaultProps = {
  onIconClick: () => {},
  hideIcon: false,
};

export default memo(Search);
