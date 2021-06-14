import { BaseIceRedux } from 'icetf'

class Redux extends BaseIceRedux {
    constructor() {
        super("Root");
    }
}

const RootRedux = new Redux();

export default RootRedux