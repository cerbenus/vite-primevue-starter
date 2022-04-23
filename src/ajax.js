import axiosBase from 'axios';
import router from './router';
import events, { AJAX_ERROR, SHOW_SPINNER, HIDE_SPINNER } from './eventBus';
import { mainStore } from './store';

//import mockup from './mockup/mockApi'; // comment this out in order to use the real API

const axios = axiosBase.create({
  baseURL: '/api/v1', // this will be prepended to all URLs
});

//mockup(axios); // install the mockup adapter - comment this out in order to use the real API

axios.defaults.timeout = 20 * 1000; // 20 seconds before we cancel the AJAX call

/*
  API response generally looks like this:

  {
    error:
    {
      code:      // Numeric code from ErrorCode defined below
      message:   // Human readable message string
      fieldList: // Optional array of field names and validation errors
      [
        {
          field:   // Field name string
          message: // Human readable string
          code:    // Optional field error code, e.g. specific validation error code
        }
      ]
    },
    data:
    .... // the actual data from the API - can be either Array or Object, or Boolean (in some cases)
  }
 */

// we broadcast the error so that either an error popup will be shown,
// or the relevant subscribed form takes the appropriate action
function checkError(err)
{
  if (err.response && err.response.status === 404)
  {
    events.emit(AJAX_ERROR,
      {
        code: 'NOT_FOUND',
        message: 'API endpoint was not found (' + err.config.url + ')'
      });
  }
  else if (err.response && err.response.status === 401)
  {
    const store = mainStore();
    store.logout();
    router.push({ name: 'login' });
  }
  else if (err.response && err.response.data)
  {
    events.emit(AJAX_ERROR, err.response.data.error || err.response.data);
  }
  else
  {
    events.emit(AJAX_ERROR, err.message || err);
  }
}

// we show the global spinner just before the AJAX request is started
axios.interceptors.request.use(
  config =>
  {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token)
    {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    events.emit(SHOW_SPINNER);
    return config;
  },
  error =>
  {
    events.emit(HIDE_SPINNER);
    // we return NULL in case of error
    checkError(error);
  }
);

// we hide the global spinner as soon as we get an error or all of the data
axios.interceptors.response.use(
  response =>
  {
    events.emit(HIDE_SPINNER);
    return response.data.data;
  },
  error =>
  {
    events.emit(HIDE_SPINNER);
    // we return NULL in case of error
    checkError(error);
  }
);

export default axios;
