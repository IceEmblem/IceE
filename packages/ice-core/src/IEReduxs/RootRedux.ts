import { BaseIceRedux } from 'icetf';
import { reducer } from "./Reducer";

class Redux extends BaseIceRedux {
    reducer = reducer;

    constructor() {
        super("Root");
    }
}

export default new Redux();