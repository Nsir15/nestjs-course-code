import { FC, memo, useMemo, useRef } from 'react'
import { MeetingRoom } from '@/types/api'
import { ISearchFormProps, PageTable, wrapRequest } from '@meeting-room/shared'
import { useAntdTable } from 'ahooks'
import { Button, Form } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { getMeetingRoomList } from '@/api/meetingRoom'
import ApplyModal, { IApplyModalRef } from './ApplyModal'
import dayjs from 'dayjs'

interface IProps {}
const Component: FC<IProps> = (props) => {
  const [form] = Form.useForm()
  const applyModalRef = useRef<IApplyModalRef>(null)
  const searchFormConfig: ISearchFormProps['formFieldsConfig'] = useMemo(() => {
    return [
      {
        label: '会议室名称',
        name: 'name',
        type: 'input',
      },
      {
        label: '容纳人数',
        name: 'capacity',
        type: 'input',
      },
      {
        label: '状态',
        name: 'status',
        type: 'select',
        options: [
          {
            label: '空闲',
            value: MeetingRoom.Status.Available,
          },
          {
            label: '预定',
            value: MeetingRoom.Status.Reversed,
          },
        ],
      },
    ]
  }, [])

  const columns: ColumnsType<MeetingRoom.ListItem> = useMemo(() => {
    return [
      {
        title: '会议室名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '容纳人数',
        dataIndex: 'capacity',
        key: 'capacity',
      },
      {
        title: '会议室地址',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: '设备',
        dataIndex: 'equipment',
        key: 'equipment',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          return status === MeetingRoom.Status.Available ? '空闲' : '预定'
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (_, record) => {
          return record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 100,
        render: (_, record) => {
          return (
            <Button
              color="primary"
              variant="link"
              // disabled={record.status === MeetingRoom.Status.Reversed}
              onClick={() =>
                applyModalRef.current?.show({ roomId: record.id, meetingRoomName: record.name })
              }
            >
              预定
            </Button>
          )
        },
      },
    ]
  }, [])

  const fetchData = async (
    { current, pageSize }: { current: number; pageSize: number },
    formData: MeetingRoom.IListParams
  ) => {
    const [, data] = await wrapRequest(
      getMeetingRoomList({
        offset: current,
        limit: pageSize,
        ...formData,
      })
    )
    const result: { list: MeetingRoom.ListItem[]; total: number } = {
      list: [],
      total: 0,
    }
    if (data) {
      result.list = data.list
      result.total = data.total
    }
    return result
  }

  const { tableProps, search } = useAntdTable(fetchData, {
    form,
  })

  return (
    <>
      <PageTable
        title=" 会议室列表"
        form={form}
        formFieldsConfig={searchFormConfig}
        onReset={search.reset}
        onSubmit={search.submit}
      >
        <Table {...tableProps} rowKey={'id'} columns={columns} bordered></Table>
      </PageTable>
      <ApplyModal ref={applyModalRef}></ApplyModal>
    </>
  )
}

export default memo(Component)
