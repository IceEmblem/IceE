import { BaseIceRedux, BaseModule } from 'icetf';

export declare class Module extends BaseModule {
    preInitialize(): void;
    initialize(): Promise<[void, void]>;
    postInitialize(): void;
}

export namespace Lang {
    let lang: string;
    function init(): Promise<void>;
    function register(language: string, textObject: any): void;
    function registerCallback(call: (lang: string) => void): void;
    function removeCallback(call: (lang: string) => void) : void;
    function t(name: string): string;
    function changeLanguage(lng: string): void;
}

export namespace Storage {
    let setItem: (key: string, value: string) => Promise<void>;
    let getItem: (key: string) => Promise<string | null>;
    let removeItem: (key: string) => Promise<void>;
}

export declare class Tool {
    static imageToBase64String(file: any, setBase64StringFun: (base64: string) => void): false | undefined;
    static fileToBase64String(file: any, setBase64StringFun: (base64: string) => void): void;
    static deepCopy(obj: any): any;
    static guid(): string;
    static dateFormat(inputDate: Date | string | null, fmt?: string): string | null;
    static getUrlVariable(urlSearch: string, variable: string): string | undefined;
    static random(): number;
    static sum(arr: Array<number>);
}

export namespace Token {
    let token: string | null;
    function init(): Promise<void>;
    function setToken(token: string): void;
}

export * from '../src/reduxs/Actions';
export * from '../src/reduxs/Reducer';