import { ReactNode } from "react";

export default class Page{
    constructor(
        public name:string, 
        public url:string,
        public component:ReactNode,
        public priority: number = 0)
    {
    }
}