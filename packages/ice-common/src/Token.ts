import Storage from './Storage';

class Token {
    private _tokenName = '_token_';
    public token: string | null = null;

    init() {
        return Storage.getItem(this._tokenName).then(token => {
            this.token = token;
        });
    }

    setToken(token: string) {
        Storage.setItem(this._tokenName, token);
        this.token = token;
    }
}

export default new Token();