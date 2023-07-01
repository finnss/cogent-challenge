import API from '../api';

const GET_PERSON_BEGIN = 'GET_PERSON_BEGIN';
const GET_PERSON_SUCCESS = 'GET_PERSON_SUCCESS';
const GET_DETAILED_PERSON_BEGIN = 'GET_DETAILED_PERSON_BEGIN';
const GET_DETAILED_PERSON_SUCCESS = 'GET_DETAILED_PERSON_SUCCESS';
const REGISTER_PERSON_BEGIN = 'REGISTER_PERSON_BEGIN';
const REGISTER_PERSON_SUCCESS = 'REGISTER_PERSON_SUCCESS';
const REGISTER_PERSON_FAILURE = 'REGISTER_PERSON_FAILURE';
const UPDATE_PERSON_BEGIN = 'UPDATE_PERSON_BEGIN';
const UPDATE_PERSON_SUCCESS = 'UPDATE_PERSON_BEGIN';

const initialState = {
  persons: [],
  loading: false,
};

export const getPerson =
  (id, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: GET_PERSON_BEGIN, doInBackground });
    const person = await API.persons.getPerson(id);
    dispatch({ type: GET_PERSON_SUCCESS, person });
    return person;
  };

export const getDetailedPerson =
  (id, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: GET_DETAILED_PERSON_BEGIN, doInBackground });
    const person = await API.persons.getDetailedPerson(id);
    dispatch({ type: GET_DETAILED_PERSON_SUCCESS, person });
    return person;
  };

export const registerPerson =
  (newPerson, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: REGISTER_PERSON_BEGIN, doInBackground });
    const person = await API.persons.registerPerson(newPerson);
    dispatch({ type: REGISTER_PERSON_SUCCESS, person });
    return person;
  };

export const updatePerson =
  (updatedPerson, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_PERSON_BEGIN, doInBackground });
    const person = await API.persons.updatePerson(updatedPerson);
    dispatch({ type: UPDATE_PERSON_SUCCESS, person });
    return person;
  };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_PERSON_BEGIN:
    case REGISTER_PERSON_BEGIN:
    case UPDATE_PERSON_BEGIN:
      return {
        ...state,
        loading: action.doInBackground ? false : true,
      };

    case GET_PERSON_SUCCESS:
    case GET_DETAILED_PERSON_SUCCESS:
    case UPDATE_PERSON_SUCCESS:
      return {
        ...state,
        persons: state.persons.map((p) => p.id).includes(action.person.id)
          ? state.persons.map((person) => (person.id === action.person.id ? action.person : person))
          : [...state.persons, action.person],
        loading: false,
      };

    case REGISTER_PERSON_SUCCESS:
      return {
        ...state,
        persons: [...state.persons, action.person],
        loading: false,
      };

    default:
      return state;
  }
}
