import { encode, decode } from 'js-base64';
import Storage from '../Storage';

class Token {
    readonly tokenStorageKey: string = '_icetoken_';
    token: string | null = null;
    userInfo: any = null;

    async init() {
        let token = await Storage.getItem(this.tokenStorageKey);
        if (token) {
            this.setToken(token);
        }
    }

    setToken(token: string) {
        let userInfo = this.decodeUserInfo(token);
        if (userInfo) {
            this.userInfo = userInfo;
        }
        this.token = token;
        Storage.setItem(this.tokenStorageKey, token);
    }

    clearToken() {
        this.userInfo = null;
        this.token = null;
        Storage.removeItem(this.tokenStorageKey);
    }

    private decodeUserInfo(token: string) {
        var userInfo;
        // 解码 token
        try {
            var strings = token.split(".");
            userInfo = JSON.parse(decode(strings[1].replace(/-/g, "+").replace(/_/g, "/")));
        }
        catch (ex) {
        }

        return userInfo;
    }
}

export default new Token();