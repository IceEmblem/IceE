import Page from "./Page";

class PageProvider {
    pages: Array<Page> = [];

    register(page: Page) {
        this.addAndSort(page);
    }

    private addAndSort(page: Page) {
        let insertIndex = this.pages.length;
        for (let n = 0; n < this.pages.length; n++) {
            // 如果插入页面的优先级大于当前页面，则排在当前页面的前面
            if (this.pages[n].priority < page.priority) {
                insertIndex = n;
                break;
            }

            // 如果插入页面的优先级等于当前页面
            if (this.pages[n].priority == page.priority) {
                // 如果插入页面的url包含当前页面，则排在页面的前面
                if(page.url.startsWith(this.pages[n].url)){
                    insertIndex = n;
                    break;
                }
            }
        }

        this.pages.splice(insertIndex, 0, page);
    }
}

const pageProvider = new PageProvider();

export default pageProvider;