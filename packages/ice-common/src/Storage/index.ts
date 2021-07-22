class IEStorage {
    //读取cookies 
    getValue! : (name: string) => Promise<string>;
    
    //写cookies  
    setValue! : (name: string, value: string, expiredays: number | undefined) => Promise<void>;

    //删除cookies
    delValue! : (name: string) => Promise<void>;

    
}

export default new IEStorage();