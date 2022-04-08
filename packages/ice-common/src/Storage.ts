class Storage {
    setItem: (key: string, value: string) => Promise<void> = (key, value) => Promise.resolve();

    getItem: (key: string) => Promise<string|null> = (key) => Promise.resolve(null);

    removeItem: (key: string) => Promise<void> = (key) => Promise.resolve();
}

export default new Storage();