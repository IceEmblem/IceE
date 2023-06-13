import api from '../apis/TestApi';
import { iceCreateSlick } from 'ice-common';

export const slice = iceCreateSlick('test', api);
export const actions = slice.actions;
export const reducer = slice.reducer;