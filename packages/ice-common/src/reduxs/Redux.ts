import { BaseIceRedux, Reducer } from 'icetf';
import { reducer } from "./Reducer";

class Redux extends BaseIceRedux {
    rootReducer: Reducer | null = reducer;

    constructor() {
        super("ice_common");
    }
}

export default new Redux();