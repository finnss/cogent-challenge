import API from '../api';

const SEARCH_BEGIN = 'SEARCH_BEGIN';
const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
const ALTERNATE_SEARCH_BEGIN = 'ALTERNATE_SEARCH_BEGIN';
const ALTERNATE_SEARCH_SUCCESS = 'ALTERNATE_SEARCH_SUCCESS';
const FREG_LOOKUP_BEGIN = 'FREG_LOOKUP_BEGIN';
const FREG_LOOKUP_SUCCESS = 'FREG_LOOKUP_SUCCESS';

const initialState = {
  results: undefined,
  fregResults: undefined,
  loading: false,
  fregLoading: false,
};

export const performSearch = (searchText) => async (dispatch) => {
  dispatch({ type: SEARCH_BEGIN });
  const results = await API.search.performSearch(searchText);
  dispatch({ type: SEARCH_SUCCESS, results });
  return results;
};

export const performAlternateSearch = (birthDateSearchText, lastNameSearchText) => async (dispatch) => {
  dispatch({ type: ALTERNATE_SEARCH_BEGIN });
  const results = await API.search.performAlternateSearch({
    birthDate: birthDateSearchText,
    lastName: lastNameSearchText,
  });
  dispatch({ type: ALTERNATE_SEARCH_SUCCESS, results });
  return results;
};

export const fregLookup = (personNr) => async (dispatch) => {
  dispatch({ type: FREG_LOOKUP_BEGIN });
  const results = await API.search.fregLookup(personNr);
  console.log('freg module results', results);

  // FIXME Dev FREG Person
  const dummyFregPerson = {
    personNr,
    fullName: 'Snill Snillson',
    birthDate: '1992-01-01',
    gender: 'kvinne',
    streetAddress: 'Voldsutøvergata 23',
    postArea: '0221 Oslo',
    civilStatus: 'single',
    citizenship: 'Norsk',
    residencePermit: 'Usikker',
    birthCountry: 'Pakistan',
    birthPlace: 'Islamabad',
  };
  const toReturn = results?.length > 0 ? results : dummyFregPerson;
  dispatch({ type: FREG_LOOKUP_SUCCESS, results: toReturn });
  return toReturn;
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_BEGIN:
    case ALTERNATE_SEARCH_BEGIN:
      return {
        ...state,
        results: undefined,
        loading: true,
      };
    case SEARCH_SUCCESS:
    case ALTERNATE_SEARCH_SUCCESS:
      return {
        ...state,
        results: action.results,
        loading: false,
      };
    case FREG_LOOKUP_BEGIN:
      return {
        ...state,
        fregResults: undefined,
        fregLoading: true,
      };
    case FREG_LOOKUP_SUCCESS:
      return {
        ...state,
        fregResults: action.results,
        fregLoading: false,
      };
    default:
      return state;
  }
}
