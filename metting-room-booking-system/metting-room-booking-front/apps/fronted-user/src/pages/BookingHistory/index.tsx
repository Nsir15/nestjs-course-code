import { FC, Key, memo, useMemo } from 'react'
import { ISearchFormProps, PageTable, wrapRequest } from '@meeting-room/shared'
import { fetchBookingList } from '@/api/booking'
import { Booking } from '@/types/api'
import { useAntdTable } from 'ahooks'
import { Form, Popconfirm, Table, TableColumnsType } from 'antd'
import dayjs from 'dayjs'

interface IProps {}
const Component: FC<IProps> = (props) => {
  // const {} = props
  const [form] = Form.useForm()
  const searchFormFieldConfig: ISearchFormProps['formFieldsConfig'] = useMemo(() => {
    return [
      {
        type: 'input',
        label: '会议室名称',
        name: 'meetingRoomName',
      },
      {
        type: 'select',
        label: '状态',
        name: 'status',
      },
      {
        type: 'rangePicker',
        label: '时间段',
        name: 'timeRange',
        showTime: true,
      },
    ]
  }, [])

  const columns: TableColumnsType<Booking.IBookingItem> = useMemo(() => {
    return [
      {
        title: '会议室名称',
        dataIndex: 'meetingRoomName',
        render: (_, record) => {
          return record.room?.name
        },
      },
      {
        title: '预定状态',
        dataIndex: 'status',
        onFilter: (value, record) => {
          return record.status!.startsWith(value as string)
        },
        filters: [
          {
            text: '审批通过',
            value: '审批通过',
          },
          {
            text: '审批驳回',
            value: '审批驳回',
          },
          {
            text: '申请中',
            value: '申请中',
          },
          {
            text: '已解除',
            value: '已解除',
          },
        ],
      },
      {
        title: '预定人',
        dataIndex: 'bookerName',
        render: (_, record) => {
          return record.user?.username
        },
      },
      {
        title: '预定开始时间',
        dataIndex: 'startTime',
        render: (_, record) => {
          return record.startTime ? dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss') : ''
        },
      },
      {
        title: '预定结束时间',
        dataIndex: 'endTime',
        render: (_, record) => {
          return record.endTime ? dayjs(record.endTime).format('YYYY-MM-DD HH:mm:ss') : ''
        },
      },
      {
        title: '预定时长',
        dataIndex: 'duration',
        render: (_, record) => {
          const { startTime, endTime } = record
          if (!startTime || !endTime) return '-'
          const start = dayjs(startTime)
          const end = dayjs(endTime)
          const hour = end.diff(start, 'hour')
          const minute = end.diff(start, 'minute') % 60
          return `${hour}小时${minute}分钟`
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      // {
      //   title: '操作',
      //   dataIndex: 'operation',
      //   render: (_, record) => {
      //     return (
      //       <Popconfirm title="提示" okText="确定" cancelText="取消" onConfirm={() => {}}>
      //         <a
      //           href="javascript:void(0)"
      //           onClick={(e) => {
      //             e.preventDefault()
      //           }}
      //         >
      //           解除预定
      //         </a>
      //       </Popconfirm>
      //     )
      //   },
      // },
    ]
  }, [])

  const getBookingList = async (
    { current, pageSize }: { current: number; pageSize: number },
    formData: Booking.IBookingQueryParams
  ) => {
    const [, data] = await wrapRequest(
      fetchBookingList({
        ...formData,
        current,
        pageSize,
        startTime: formData.timeRange?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
        endTime: formData.timeRange?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
      })
    )
    const result: { list: Booking.IBookingItem[]; total: number } = {
      list: [],
      total: 0,
    }
    if (data) {
      result.list = data.list
      result.total = data.total
    }

    return result
  }

  const { tableProps, search } = useAntdTable(getBookingList, { form })

  return (
    <PageTable
      title="预定记录"
      form={form}
      formFieldsConfig={searchFormFieldConfig}
      onReset={search.reset}
      onSubmit={search.submit}
    >
      <Table {...tableProps} columns={columns} bordered></Table>
    </PageTable>
  )
}

export default memo(Component)
