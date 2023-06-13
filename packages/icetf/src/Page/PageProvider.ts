import { ReactNode } from "react";

export type Page = {
    name: string,
    url: string,
    element: ReactNode
}

class PageProvider {
    pages: Array<Page> = [];

    register(page: Page) {
        this.addAndSort(page);
    }

    private addAndSort(page: Page) {
        let insertIndex = this.pages.length;
        for (let n = 0; n < this.pages.length; n++) {
            // 如果插入页面的url包含当前页面，则排在页面的前面
            if (page.url.startsWith(this.pages[n].url)) {
                insertIndex = n;
                break;
            }
        }

        this.pages.splice(insertIndex, 0, page);
    }
}

const pageProvider = new PageProvider();

export default pageProvider;