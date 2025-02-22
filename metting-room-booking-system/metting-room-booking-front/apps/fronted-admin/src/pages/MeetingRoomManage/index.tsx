import { deleteMeetingRoom, getMeetingRoomList } from '@/api/meetingRoomManage'
import { MeetingRoom } from '@/types/api'
import { ISearchFormProps, message, PageTable, wrapRequest } from '@meeting-room/shared'
import { useAntdTable } from 'ahooks'
import { Button, Form, Popconfirm, Space, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, memo, useRef, useCallback, useMemo } from 'react'
import CreateRoomModal, { ICreateRoomModalRef } from './createRoomModal'

interface IProps {}

const Component: FC<IProps> = () => {
  const [form] = Form.useForm()
  const modalRef = useRef<ICreateRoomModalRef>(null)

  const formFieldsConfig: ISearchFormProps['formFieldsConfig'] = useMemo(
    () => [
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
            label: '占用',
            value: MeetingRoom.Status.Reversed,
          },
        ],
      },
    ],
    []
  )

  const actions = useMemo(
    () => [
      {
        label: '新增',
        onClick: () => handleCreate(),
      },
    ],
    []
  )

  const columns: ColumnsType<MeetingRoom.ListItem> = useMemo(
    () => [
      {
        title: '会议室名称',
        dataIndex: 'name',
      },
      {
        title: '会议室容量',
        dataIndex: 'capacity',
        render: (value) => {
          return `可容纳${value}人`
        },
      },
      {
        title: '设备',
        dataIndex: 'equipment',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (value, record) => {
          return record.status === MeetingRoom.Status.Available ? (
            <Tag color="#87d068">空闲</Tag>
          ) : (
            <Tag color="#f50">占用</Tag>
          )
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 150,
        render: (_, record) => {
          return (
            <Space>
              <Button color="primary" variant="link" onClick={() => handleEdit(record)}>
                修改
              </Button>
              <Popconfirm
                title="删除会议室"
                description="确认删除吗?"
                onConfirm={() => handleDelete(record)}
              >
                <Button color="primary" variant="link">
                  删除
                </Button>
              </Popconfirm>
            </Space>
          )
        },
      },
    ],
    []
  )

  const fetchData = async (
    { current, pageSize }: { current: number; pageSize: number },
    formData: Omit<MeetingRoom.IListParams, 'limit' | 'offset'>
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

  const handleCreate = useCallback(() => {
    modalRef.current?.show()
  }, [])

  const handleEdit = useCallback((record: MeetingRoom.ListItem) => {
    modalRef.current?.show(record)
  }, [])

  const handleDelete = useCallback(
    async (record: MeetingRoom.ListItem) => {
      const [error] = await wrapRequest(deleteMeetingRoom(record.id))
      if (!error) {
        message.success('删除成功')
        search.submit()
      }
    },
    [search]
  )

  return (
    <>
      <PageTable
        title=" 会议室管理"
        form={form}
        formFieldsConfig={formFieldsConfig}
        operators={actions}
        onReset={search.reset}
        onSubmit={search.submit}
      >
        <Table {...tableProps} columns={columns} bordered rowKey="id"></Table>
      </PageTable>
      <CreateRoomModal ref={modalRef} refreshList={() => search.submit()} />
    </>
  )
}

export default memo(Component)
