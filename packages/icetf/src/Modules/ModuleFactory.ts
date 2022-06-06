import BaseModule from './BaseModule';

type ModuleData = {
    module: BaseModule,
    dependModules: Array<BaseModule>,
    isPreInit: boolean,
    isInit: boolean,
    isPostInit: boolean
}

class ModuleFactory {
    moduleDatas: Array<ModuleData> = [];
    // 已排序的模块
    sortedModuleDatas: Array<ModuleData> = [];
    // 当前异步加载的任务
    tasks: Array<Promise<BaseModule>> = [];

    register<TModule extends BaseModule>(module: TModule, dependModules: Array<TModule | Promise<TModule>>) {
        let moduleData = {
            module: module,
            dependModules: [] as Array<TModule>,
            isPreInit: false,
            isInit: false,
            isPostInit: false,
        };
        this.moduleDatas.push(moduleData);

        dependModules.forEach(dependModule => {
            if (dependModule instanceof Promise) {
                dependModule.then(e => {
                    moduleData.dependModules.push(e);
                });
                this.tasks.push(dependModule);
                return;
            }

            moduleData.dependModules.push(dependModule);
        });
    }

    init() {
        return Promise.all(this.tasks).then(() => {
            for (let n = 0; n < this.moduleDatas.length; n++) {
                this.moduleSort(this.moduleDatas[n]);
            }

            let exec = Promise.resolve();
            for (let n = 0; n < this.sortedModuleDatas.length; n++) {
                exec = exec.then(() => {
                    return this.preInitialize(this.sortedModuleDatas[n]);
                })
            }

            for (let n = 0; n < this.sortedModuleDatas.length; n++) {
                exec = exec.then(() => {
                    return this.initialize(this.sortedModuleDatas[n]);
                })
            }

            for (let n = 0; n < this.sortedModuleDatas.length; n++) {
                exec = exec.then(() => {
                    return this.postInitialize(this.sortedModuleDatas[n]);
                })
            }

            return exec;
        });
    }

    moduleSort(moduleData: ModuleData) {
        if (moduleData.dependModules) {
            for (let n = 0; n < moduleData.dependModules.length; n++) {
                let dependModuleData = this.moduleDatas.find(item => item.module == moduleData.dependModules[n]);
                if (!dependModuleData) {
                    throw new Error(`模块${moduleData.module.key}所依赖的模块${moduleData.dependModules[n].key}未注册，请注册其依赖的模块`);
                }

                // dependModuleData 已在排序过的列表中，则表明已对 dependModuleData 以及 dependModuleData 的依赖进行过排序
                if (this.sortedModuleDatas.findIndex(item => item == dependModuleData) >= 0) {
                    continue;
                }

                this.moduleSort(dependModuleData)
            }
        }

        this.sortedModuleDatas.push(moduleData);
    }

    preInitialize(moduleData: ModuleData) {
        if (moduleData.isPreInit) {
            return;
        }

        moduleData.isPreInit = true;

        return moduleData.module.preInitialize();
    }

    initialize(moduleData: ModuleData) {
        if (moduleData.isInit) {
            return;
        }

        moduleData.isInit = true;

        return moduleData.module.initialize();
    }

    postInitialize(moduleData: ModuleData) {
        if (moduleData.isPostInit) {
            return;
        }

        moduleData.isPostInit = true;

        return moduleData.module.postInitialize();
    }
}

export default new ModuleFactory();