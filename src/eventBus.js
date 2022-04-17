import mitt from 'mitt';

const emitter = mitt();

export default emitter;

export const AJAX_ERROR = 'AJAX_ERROR';
export const SHOW_SPINNER = 'SHOW_SPINNER';
export const HIDE_SPINNER = 'HIDE_SPINNER';
