var moduleDatas: Array<any> = [];
// 已排序的模块
var sortedModuleDatas: Array<any> = [];

class ModuleFactory
{
    register(moduleType: any, dependModuleTypes: any)
    {
        moduleDatas.push({
            module: null,
            moduleType: moduleType,
            dependModuleTypes: dependModuleTypes,
            isPreInit: false,
            isInit: false,
            isPostInit: false
        });
    }

    init(){
        for(let n = 0; n < moduleDatas.length; n++)
        {
            this.moduleSort(moduleDatas[n]);
        }

        let exec = Promise.resolve();
        for(let n = 0; n < sortedModuleDatas.length; n++)
        {
            exec = exec.then(()=>{
                return this.preInitialize(sortedModuleDatas[n]);
            })
        }

        for(let n = 0; n < sortedModuleDatas.length; n++)
        {
            exec = exec.then(()=>{
                return this.initialize(sortedModuleDatas[n]);
            })
        }

        for(let n = 0; n < sortedModuleDatas.length; n++)
        {
            exec = exec.then(()=>{
                return this.postInitialize(sortedModuleDatas[n]);
            })
        }

        return exec;
    }

    moduleSort(moduleData: any){
        if(moduleData.dependModuleTypes)
        {
            for(let n = 0; n < moduleData.dependModuleTypes.length; n++){
                let dependModuleData = moduleDatas.find(item=>item.moduleType == moduleData.dependModuleTypes[n]);
                if(!dependModuleData){
                    throw new Error(`模块${moduleData.moduleType}所依赖的模块未注册，请注册其依赖的模块`);
                }

                // dependModuleData 已在排序过的列表中，则表明已对 dependModuleData 以及 dependModuleData 的依赖进行过排序
                if(sortedModuleDatas.findIndex(item => item == dependModuleData) >= 0){
                    continue;
                }

                this.moduleSort(dependModuleData)
            }
        }

        moduleData.module = new moduleData.moduleType();

        sortedModuleDatas.push(moduleData);
    }

    preInitialize(moduleData: any)
    {
        if(moduleData.isPreInit){
            return;
        }

        moduleData.isPreInit = true;

        return moduleData.module.preInitialize();
    }

    initialize(moduleData: any)
    {
        if(moduleData.isInit){
            return;
        }

        moduleData.isInit = true;

        return moduleData.module.initialize();
    }

    postInitialize(moduleData: any)
    {
        if(moduleData.isPostInit){
            return;
        }

        moduleData.isPostInit = true;

        return moduleData.module.postInitialize();
    }
}

export default new ModuleFactory();