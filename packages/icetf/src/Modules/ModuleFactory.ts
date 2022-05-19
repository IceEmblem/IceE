class ModuleFactory {
    moduleDatas: Array<any> = [];
    // 已排序的模块
    sortedModuleDatas: Array<any> = [];
    // 当前异步加载的任务
    tasks: Array<Promise<any>> = [];

    register(moduleType: any, dependModuleTypes: Array<any | Promise<any>>) {
        let moduleData = {
            module: null,
            moduleType: moduleType,
            dependModuleTypes: [] as Array<any>,
            isPreInit: false,
            isInit: false,
            isPostInit: false
        };
        this.moduleDatas.push(moduleData);

        dependModuleTypes.forEach(dependModuleType => {
            if (dependModuleType instanceof Promise) {
                dependModuleType.then(e => {
                    moduleData.dependModuleTypes.push(e);
                });
                this.tasks.push(dependModuleType);
                return;
            }

            moduleData.dependModuleTypes.push(dependModuleType);
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

    moduleSort(moduleData: any) {
        if (moduleData.dependModuleTypes) {
            for (let n = 0; n < moduleData.dependModuleTypes.length; n++) {
                let dependModuleData = this.moduleDatas.find(item => item.moduleType == moduleData.dependModuleTypes[n]);
                if (!dependModuleData) {
                    throw new Error(`模块${moduleData.moduleType}所依赖的模块未注册，请注册其依赖的模块`);
                }

                // dependModuleData 已在排序过的列表中，则表明已对 dependModuleData 以及 dependModuleData 的依赖进行过排序
                if (this.sortedModuleDatas.findIndex(item => item == dependModuleData) >= 0) {
                    continue;
                }

                this.moduleSort(dependModuleData)
            }
        }

        moduleData.module = new moduleData.moduleType();

        this.sortedModuleDatas.push(moduleData);
    }

    preInitialize(moduleData: any) {
        if (moduleData.isPreInit) {
            return;
        }

        moduleData.isPreInit = true;

        return moduleData.module.preInitialize();
    }

    initialize(moduleData: any) {
        if (moduleData.isInit) {
            return;
        }

        moduleData.isInit = true;

        return moduleData.module.initialize();
    }

    postInitialize(moduleData: any) {
        if (moduleData.isPostInit) {
            return;
        }

        moduleData.isPostInit = true;

        return moduleData.module.postInitialize();
    }
}

export default new ModuleFactory();