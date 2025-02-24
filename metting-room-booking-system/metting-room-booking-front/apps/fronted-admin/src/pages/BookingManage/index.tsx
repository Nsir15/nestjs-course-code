import { approveBooking, getBookingList, rejectBooking, unbindBooking } from '@/api/bookingManage'
import { Booking } from '@/types/api'
import { ISearchFormProps, message, PageTable, wrapRequest } from '@meeting-room/shared'
import { useAntdTable } from 'ahooks'
import { Button, Form, Space } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { FC, memo, useMemo } from 'react'

interface IProps {}
const Component: FC<IProps> = () => {
  const [form] = Form.useForm()
  const searchFromConfig: ISearchFormProps['formFieldsConfig'] = useMemo(() => {
    return [
      {
        label: '会议室名称',
        name: 'meetingRoomName',
        type: 'input',
      },
      {
        label: '状态',
        name: 'status',
        type: 'select',
        options: [
          // 申请中，审批通过，审批驳回，已解除
          {
            label: '申请中',
            value: '申请中',
          },
          {
            label: '审批通过',
            value: '审批通过',
          },
          {
            label: '审批驳回',
            value: '审批驳回',
          },
          {
            label: '已解除',
            value: '已解除',
          },
        ],
      },
      {
        label: '时间范围',
        name: 'timeRange',
        type: 'rangePicker',
        showTime: true,
      },
    ]
  }, [])

  const columns: ColumnsType<Booking.IBookingItem> = useMemo(() => {
    return [
      {
        title: '会议室名称',
        dataIndex: 'meetingName',
        render: (_, record) => {
          return record.room?.name
        },
      },
      {
        title: '预约人',
        dataIndex: 'userName',
        render: (_, record) => {
          return record.user?.username
        },
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        render: (value) => {
          return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        },
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        render: (value) => {
          return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 150,
        render: (_, record) => {
          return (
            <Space>
              {record.status !== '审批通过' && (
                <Button
                  color="primary"
                  variant="link"
                  onClick={() => handleBookingProcess(record.id!, 'approve')}
                >
                  通过
                </Button>
              )}
              {record.status !== '审批驳回' && (
                <Button
                  color="primary"
                  variant="link"
                  onClick={() => handleBookingProcess(record.id!, 'reject')}
                >
                  驳回
                </Button>
              )}
              {record.status !== '已解除' && (
                <Button
                  color="primary"
                  variant="link"
                  onClick={() => handleBookingProcess(record.id!, 'unbind')}
                >
                  解除
                </Button>
              )}
            </Space>
          )
        },
      },
    ]
  }, [])

  const handleBookingProcess = async (bookingId: number, type: 'approve' | 'reject' | 'unbind') => {
    const actionMap = {
      approve: approveBooking,
      reject: rejectBooking,
      unbind: unbindBooking,
    }

    try {
      const [error] = await wrapRequest(actionMap[type](bookingId))
      if (!error) {
        message.success('操作成功')
        search.submit()
      }
    } catch (error) {
      message.error('操作失败')
    }
  }

  const fetchData = async (
    { current, pageSize }: { current: number; pageSize: number },
    formData: Omit<Booking.IListQueryParams, 'current' | 'pageSize'>
  ) => {
    const { timeRange, ...rest } = formData
    const [, data] = await wrapRequest(
      getBookingList({
        current,
        pageSize,
        startTime: timeRange?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
        endTime: timeRange?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
        ...rest,
      })
    )
    const result: { list: AnyRecord[]; total: number } = {
      list: [],
      total: 0,
    }
    if (data) {
      result.list = data.list
      result.total = data.total
    }
    return result
  }

  const { tableProps, search } = useAntdTable(fetchData, { form })

  return (
    <PageTable
      title="预定列表"
      form={form}
      formFieldsConfig={searchFromConfig}
      onReset={search.reset}
      onSubmit={search.submit}
    >
      <Table {...tableProps} columns={columns} bordered></Table>
    </PageTable>
  )
}

export default memo(Component)
