import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Storage from '../Storage';

class LangProvider {
    // {
    //     en: {
    //       translation: enUsTrans,
    //     },
    //     zh: {
    //       translation: zhCnTrans,
    //     },
    // }
    private _resources: any = {};

    private _changeCallbacks: Array<(lang: string) => void> = [];

    public lang = 'zh_cn';

    // 初始化
    init() {
        return Storage.getItem('lang').then(lang => {
            if (lang) {
                this.lang = lang;
            }
    
            i18next.use(initReactI18next) //init i18next
                .init({
                    //引入资源文件
                    resources: this._resources,
                    //选择默认语言，选择内容为上述配置中的key，即en/zh
                    fallbackLng: this.lang,
                    debug: false,
                    interpolation: {
                        escapeValue: false, // not needed for react as it escapes by default
                    },
                });
        });
    }

    // 注册语言
    register(language: string, textObject: any) {
        if (!this._resources[language]) {
            this._resources[language] = {
                translation: {
                    ...textObject
                }
            }
        }
        else {
            this._resources[language].translation = {
                ...this._resources[language].translation,
                ...textObject
            }
        }
    }

    // 注册回调，在语言改变时回调
    registerCallback(call: (lang: string) => void) {
        this._changeCallbacks.push(call);
    }

    // 移除回调函数
    removeCallback(call: (lang: string) => void) {
        this._changeCallbacks = this._changeCallbacks.filter(e => e != call);
    }

    // 获取文本
    t(name: string) {
        return i18next.t(name);
    }

    // 切换语言
    changeLanguage(lng: string) {
        if (lng == this.lang) {
            return;
        }

        if (!this._resources[lng]) {
            return;
        }

        this.lang = lng;
        i18next.changeLanguage(lng);
        Storage.setItem('lang', lng);
        this._changeCallbacks.forEach(call => {
            call(this.lang);
        });
    }
}

export default new LangProvider();