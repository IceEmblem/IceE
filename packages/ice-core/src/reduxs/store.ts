import { configureStore } from '@reduxjs/toolkit';
import { reducer as testReducer } from './testSlice';

export default configureStore({
    reducer: {
        test: testReducer,
    }
});