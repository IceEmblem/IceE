import React from 'react';
import { Col, Row, Space, Button, Modal, Input, InputNumber, Radio, DatePicker, CheckboxOptionType, Checkbox, Select } from 'antd';
import { ReloadOutlined, FileSearchOutlined, SyncOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

export type DateRange = [Date, Date]

export type NumRange = [number, number]

export type fliterProps = {
    setValue: (value: any) => void,
    value: any,
}

export const TextFilter = (props: fliterProps & {
    isNumber?: boolean
}) => {
    let { value, setValue, isNumber } = props;

    if (isNumber == true) {
        return <InputNumber
            className='w-full'
            placeholder='Input'
            controls={false}
            value={value}
            onChange={val => setValue(val)}
        />
    }

    return <Input
        placeholder='Input'
        value={value}
        onChange={e => setValue(e.target.value)}
    />
}

export const TimeFilter = (props: fliterProps) => {
    let { value, setValue } = props;

    // min.toDate()?.toISOString().substring(0, 19);
    let range: DateRange = value || [undefined, undefined]

    return <div className='flex items-center'>
        <DatePicker
            placeholder='Select Date'
            className='w-1/2'
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            value={range[0] ? dayjs(range[0]) : undefined}
            onChange={(value) => {
                setValue([value?.toDate(), range[1]]);
            }}
        />
        -
        <DatePicker
            placeholder='Select Date'
            className='w-1/2'
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            value={range[1] ? dayjs(range[1]) : undefined}
            onChange={(value) => {
                setValue([range[0], value?.toDate()]);
            }}
        />
    </div>
}

export const ChecksFilter = (props: fliterProps & {
    filterValues: Array<CheckboxOptionType | string>
}) => {
    let { value, setValue, filterValues } = props;

    return <div className='flex'>
        <Checkbox.Group
            options={filterValues}
            value={value}
            onChange={(vals: any) => {
                setValue(vals);
            }}
        >
        </Checkbox.Group>
    </div>
}

export const RadioFilter = (props: fliterProps & {
    filterValues: Array<CheckboxOptionType>
}) => {
    let { value, setValue, filterValues } = props;

    return <div className='flex'>
        <Radio.Group
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
            }}
        >
            {
                filterValues.map(item => (<Radio key={item.value as any} value={item.value} disabled={item.disabled}>{item.label}</Radio>))
            }
        </Radio.Group>
    </div>
}

export const SelectFilter = (props: fliterProps & {
    filterValues: Array<{ label: string, value: string | number | boolean | number }>
}) => {
    let { value, setValue, filterValues } = props;

    return <div className='flex'>
        <Select
            showSearch
            allowClear
            placeholder='Select'
            style={{ minWidth: 180 }}
            value={value}
            onChange={(val) => {
                setValue(val);
            }}
            filterOption={(input, option) => {
                return option?.title?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
        >
            {
                filterValues.map(item => (<Select.Option key={item.value as any} value={item.value} title={item.label}>{item.label}</Select.Option>))
            }
        </Select>
    </div>
}

export const NumFilter = (props: fliterProps) => {
    let { value, setValue } = props;

    let range: NumRange = value || [undefined, undefined]

    return <div className='flex items-center'>
        <InputNumber
            className='flex-grow'
            placeholder='Min'
            max={99999999}
            value={range[0]}
            onChange={(value) => {
                setValue([value, range[1]]);
            }}
        />
        -
        <InputNumber
            className='flex-grow'
            placeholder='Max'
            max={99999999}
            value={range[1]}
            onChange={(value) => {
                setValue([range[0], value]);
            }}
        />
    </div>
}

export type FilterColumnType = {
    title: string,
    dataIndex: string,
    filter: React.ComponentType<fliterProps>
}

const LabelEX = class extends React.Component<{
    text: React.ReactNode,
    children: React.ReactNode,
}> {
    render() {
        return <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
                style={{
                    display: 'inline-block',
                    flexShrink: 0,
                    marginRight: '0.5rem'
                }}
            >{this.props.text}</span>
            {this.props.children}
        </div>
    }
}

type Props = {
    defaultFilters?: any,
    columns: Array<FilterColumnType>
    onChange: (values: any) => void;
    btns?: React.ReactNode
}

export default class extends React.Component<Props> {
    state: any;

    constructor(props: Props) {
        super(props);
        if (props.defaultFilters) {
            this.state = {
                isModalVisible: false,
                ...props.defaultFilters
            }
        }
        else {
            this.state = {
                isModalVisible: false,
            }
        }
    }

    render() {
        return <Row align='bottom' style={{ gap: '0.5rem' }}>
            {
                this.props.columns.map(item => {
                    let Filter = item.filter;

                    return (
                        <Col key={item.dataIndex} style={{ marginRight: '0.25rem' }}>
                            <LabelEX text={item.title}>
                                <Filter
                                    value={this.state[item.dataIndex]}
                                    setValue={(value) => {
                                        let state: any = {};
                                        state[item.dataIndex] = value;
                                        this.setState(state);
                                    }}
                                />
                            </LabelEX>
                        </Col>
                    )
                })
            }
            <div className='flex-grow'></div>
            <Col>
                <Space>
                    <Button
                        onClick={() => {
                            let { isModalVisible, ...other } = this.state;
                            Object.keys(other).forEach(key => {
                                other[key] = undefined;
                            });
                            this.setState(other);
                            this.props.onChange(other);
                        }}
                    >重置</Button>
                    <Button type='primary'
                        onClick={() => {
                            let { isModalVisible, ...other } = this.state;
                            this.props.onChange(other);
                        }}
                    >查询</Button>
                    {this.props.btns}
                </Space>
            </Col>
        </Row>
    }
}