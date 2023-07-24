export interface Menu {
	// 菜单的名称
	name: string;
	// 菜单显示图标
	icon: React.ReactNode;
	// 菜单显示文本，如果langName为空，则显示text
	text?: string;
	// 多语言name
	langName?: string;
	// 菜单的组件
	component?: React.ComponentType<any>;
	// 子菜单
	menuItems?: Array<Menu> | null;
	// 是否在菜单栏隐藏
	hidden?: boolean;
	// 允许访问
	allowAccess?: () => boolean;
}

export interface MenuWithUrl extends Menu {
    // 子菜单
    menuItems: Array<MenuWithUrl> | null;
    // url
    url: string,
}

interface MenuWithUrlSort extends MenuWithUrl {
    sort: number,
}

export class MenuProvider {
    public menus: Array<MenuWithUrlSort> = [];
    public preUrl: string;

    constructor(preUrl: string) {
        this.preUrl = preUrl;
    }

    // 注册导航栏菜单
    registerMenu(menu: Menu, sort: number = 0) {
        let menuWithUrl = this._createMenuWithUrl(menu, this.preUrl);
        let menuWithUrlSort = {
            ...menuWithUrl,
            sort: sort
        }

        let index = this.menus.findIndex(e => e.sort >= sort);
        if (index == -1) {
            this.menus.push(menuWithUrlSort);
        }
        else {
            this.menus.splice(index, 0, menuWithUrlSort);
        }
    }

    // 通过url查找菜单
    urlToMenus(url: string) {
        let menuNames = url.replace(`${this.preUrl}/`, '').split('/');

        let result: Array<MenuWithUrl> = [];
        let curmenus: Array<MenuWithUrl> | null | undefined = this.menus as Array<MenuWithUrl>;

        for (let name of menuNames) {
            if (!curmenus) {
                return result;
            }

            let menu: MenuWithUrl | undefined = curmenus.find(e => e.name == name);
            if (!menu) {
                return result;
            }

            result.push(menu);
            curmenus = menu.menuItems;
        }

        return result;
    }

    // 获取菜单url
    getUrl(menuNames: string[]) {
        return `${this.preUrl}/${menuNames.join('/')}`;
    }

    // 生成 MenuWithUrl
    private _createMenuWithUrl(menu: Menu, parentUrl: string) {
        let url = `${parentUrl}/${menu.name}`;

        let newMenu: MenuWithUrl = {
            name: menu.name,
            icon: menu.icon,
            text: menu.text,
            langName: menu.langName,
            component: menu.component,
            menuItems: null,
            url: url,
            hidden: menu.hidden,
            allowAccess: menu.allowAccess
        }

        if (menu.menuItems) {
            newMenu.menuItems = menu.menuItems.map(item => {
                return this._createMenuWithUrl(item, url);
            })
        }

        return newMenu;
    }
}

export default abstract class GroupMenuProvider {
    // 路由前缀
    public abstract preRoute: string;

    // 当前后台
    public abstract backstage: string;

    // 菜单
    protected abstract mapMenus: Map<string, MenuProvider>;

    // 获取菜单提供器
    private _getMenuProvider = (backstage: string) => this.mapMenus.get(backstage)!;

    // 注册导航栏菜单
    // menu: 菜单
    // backstage: 注册的后台类型
    registerMenu(menu: Menu, backstage: string, sort: number = 0) {
        this._getMenuProvider(backstage).registerMenu(menu, sort);
    }

    // 通过URL查找菜单
    urlToMenus(url: string, backstage: string = this.backstage) {
        return this._getMenuProvider(backstage).urlToMenus(url);
    }

    // 获取注册的菜单
    // backstage: 注册的后台类型
    getMenus(backstage: string = this.backstage) {
        return this._getMenuProvider(backstage).menus;
    }

    // 通过菜单生成对应的url
    getUrl(menuNames: string[], backstage: string = this.backstage) {
        return this._getMenuProvider(backstage).getUrl(menuNames);
    }
}

// class MenuProviderEx extends MenuProvider {
//     preRoute = '/back';
//     backstage = 'admin';
//     mapMenus = new Map<string, _MenuProvider>();
// }