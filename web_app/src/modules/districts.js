import API from '../api';

const GET_DISTRICTS_BEGIN = 'GET_DISTRICTS_BEGIN';
const GET_DISTRICTS_SUCCESS = 'GET_DISTRICTS_SUCCESS';
const GET_DISTRICT_BEGIN = 'GET_DISTRICT_BEGIN';
const GET_DISTRICT_SUCCESS = 'GET_DISTRICT_SUCCESS';

const initialState = {
  districts: [],
  loading: false,
};

export const getDistricts =
  (doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: GET_DISTRICTS_BEGIN, doInBackground });
    const districts = await API.districts.getDistricts();
    dispatch({ type: GET_DISTRICTS_SUCCESS, districts });
    return districts;
  };

export const getDistrict =
  (id, doInBackground = false) =>
  async (dispatch) => {
    dispatch({ type: GET_DISTRICT_BEGIN, doInBackground });
    const district = await API.districts.getDistrict(id);
    dispatch({ type: GET_DISTRICT_SUCCESS, district });
    return district;
  };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_DISTRICTS_BEGIN:
    case GET_DISTRICT_BEGIN:
      return {
        ...state,
        loading: action.doInBackground ? false : true,
      };

    case GET_DISTRICT_SUCCESS:
      return {
        ...state,
        districts: state.districts.map((p) => p.id).includes(action.district.id)
          ? state.districts.map((district) => (district.id === action.district.id ? action.district : district))
          : [...state.districts, action.district],
        loading: false,
      };

    case GET_DISTRICTS_SUCCESS:
      return {
        ...state,
        districts: action.districts,
        loading: false,
      };

    default:
      return state;
  }
}
