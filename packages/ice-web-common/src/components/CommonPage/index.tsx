import React, { forwardRef } from 'react';
import { IceSlice, IceSliceState } from 'ice-common';
import Table, { TableEXColumnType, Sorter } from './Table';
import { useSelector, useDispatch } from 'react-redux';
import { FilterColumnType } from './HighLevelSearch';

export type CommonPageProps = {
    slice: IceSlice,
    // antd Table columns
    columns: Array<TableEXColumnType>,
    filterColumns: Array<FilterColumnType>,
    // antd Table scroll
    scroll?: { x?: number, y?: number }
    // ant rowKey
    rowKey?: string,
    // 行选择
    rowSelection?: {
        // 选择行时回调
        onSelectChange: (selectedRowKeys: Array<any>, selectedRows: Array<any>) => void,
        // 选择行的key
        selectedRowKeys: Array<any>,
        // 选择的行
        selectedRows: Array<any>,
    },
    // 工具条
    bottomTools?: React.ReactNode,
    // 分类设置
    classConfig?: {
        // 分类
        classes: Array<{ label: React.ReactNode, value: string }>,
        // api 查询时使用的名称
        queryName: string,
        // 默认值
        defaultValue?: string
    },
    // 工具栏
    tools?: React.ReactNode,
    // 导出动作
    exportAction?: (rows: Array<any>, filter?: any) => void,
    // 页大小
    pageSizeOptions?: string[] | number[]
};

export type CommonPageRefType = BaseCommonPage;

class BaseCommonPage extends React.Component<CommonPageProps & {
    state: IceSliceState,
    dispatch: ReturnType<typeof useDispatch>
}> {
    state = {
        loading: false,
        init: false
    }

    componentDidMount(): void {
        // 如果页面未渲染过，则使用默认参数
        if (this.props.state.page < 0) {
            let sortField;
            let sortDirection;
            let filter = {};
            let defaultSortCol = this.props.columns.find(e => e.defaultSortOrder);
            if (defaultSortCol) {
                sortField = defaultSortCol.dataIndex as string;
                sortDirection = defaultSortCol.defaultSortOrder == 'ascend' ? 'ascend' : 'descend'
            }
            if (this.props.classConfig && this.props.classConfig.defaultValue) {
                filter[this.props.classConfig.queryName] = this.props.classConfig.defaultValue;
            }
            this.setState({ loading: true });
            this.props.dispatch(this.props.slice.asyncActions.fetchPageDatas({
                page: 1,
                pageSize: 30,
                filter: filter,
                sortField: sortField,
                sortDirection: sortDirection
            }) as any).finally(() => {
                this.setState({ loading: false });
            });
            this.setState({ init: true });
            return;
        }
        this.setState({ init: true });
    }

    onChange = async (page?: number, pageSize?: number, filter?: any, sorter?: Sorter) => {
        try {
            let sortField = sorter?.field || this.props.state.sortField;
            let sortDirection = sorter?.order || this.props.state.sortDirection;
            this.setState({ loading: true });
            await this.props.dispatch(this.props.slice.asyncActions.fetchPageDatas({
                page: page || this.props.state.page,
                pageSize: pageSize || this.props.state.pageSize,
                filter: filter || this.props.state.filter,
                sortField: sortField,
                sortDirection: sortDirection
            }) as any);
            this.props.rowSelection?.onSelectChange([], []);
        }
        catch { }
        this.setState({ loading: false });
    }

    render(): React.ReactNode {
        if (this.state.init == false) {
            return <></>;
        }

        return <Table
            isLoading={this.state.loading}
            page={this.props.state.page}
            pageSize={this.props.state.pageSize}
            total={this.props.state.total}
            datas={this.props.state.datas}
            filter={this.props.state.filter}
            sorter={this.props.state.sortField ? {
                columnKey: this.props.state.sortField,
                field: this.props.state.sortField,
                order: this.props.state.sortDirection || 'descend'
            } : undefined}
            onChange={this.onChange}
            {...this.props}
        />
    }
}

const CommonPage = forwardRef<BaseCommonPage, CommonPageProps>((props: CommonPageProps, ref) => {
    const state: IceSliceState = useSelector((state: any) => state[props.slice.name]);
    const dispatch = useDispatch();

    return <BaseCommonPage
        ref={ref}
        state={state}
        dispatch={dispatch}
        {...props}
    />
});

export default CommonPage;