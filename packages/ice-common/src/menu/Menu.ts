import React from "react";

export default interface Menu {
	// 菜单的名称
	name: string;
	// 菜单显示图标
	icon: React.ReactNode;
	// 菜单显示文本，如果langName为空，则显示text
	text?: string;
	// 多语言name
	langName?: string;
	// 菜单的组件
	component: React.ComponentType;
	// 子菜单
	menuItems: Array<Menu> | null;
	// 是否在菜单栏隐藏
	hidden?: boolean;
	// 允许访问
	allowAccess?: () => boolean;
}