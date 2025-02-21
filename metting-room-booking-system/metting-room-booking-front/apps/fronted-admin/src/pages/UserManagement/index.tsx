import { freezeUser, getUserList } from '@/api/userManagement'
import { User } from '@/types/api'
import { ISearchFormProps, message, PageTable, wrapRequest } from '@meeting-room/shared'
import { useAntdTable } from 'ahooks'
import { Button, Form, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, memo } from 'react'

interface IProps {}
const Component: FC<IProps> = (props) => {
  // const {} = props
  const [searchForm] = Form.useForm()
  const formFieldsConfig: ISearchFormProps['formFieldsConfig'] = [
    {
      type: 'input',
      label: '用户名',
      name: 'username',
      placeholder: '请输入用户名',
    },
    {
      type: 'input',
      label: '昵称',
      name: 'nickName',
      placeholder: '请输入昵称',
    },
    {
      type: 'input',
      label: '邮箱',
      name: 'email',
      placeholder: '请输入邮箱',
    },
  ]

  const operators = [
    {
      label: '新增',
      onClick: () => {},
    },
  ]

  const columns: ColumnsType = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: '头像',
      dataIndex: 'headPic',
      render: (value) => {
        return value ? <img src={value} alt="" width="50" height="50" /> : ''
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '状态',
      dataIndex: 'isFrozen',
      render: (value) => {
        return value ? <Tag color="#f50">已冻结</Tag> : <Tag color="#87d068">未冻结</Tag>
      },
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (_, record) => {
        return (
          <Button
            color="primary"
            variant="link"
            disabled={record.isFrozen}
            onClick={() => handleFrozen(record)}
          >
            冻结
          </Button>
        )
      },
    },
  ]

  const handleFrozen = async (record: any) => {
    console.log(record)
    const [error] = await wrapRequest(freezeUser(record.id))
    if (!error) {
      message.success('冻结成功')
      search.submit()
    }
  }

  const fetchUserList = async (
    { current, pageSize }: { current: number; pageSize: number },
    formData: User.IUserListSearchParams
  ) => {
    const [, data] = await wrapRequest(
      getUserList({
        ...formData,
        offset: current,
        limit: pageSize,
      })
    )
    const result: { list: any[]; total: number } = {
      list: [],
      total: 0,
    }

    if (data) {
      result.list = data.users
      result.total = data.total
    }
    return result
  }

  const { tableProps, search } = useAntdTable(fetchUserList, {
    form: searchForm,
    defaultParams: [
      {
        current: 1,
        pageSize: 4,
      },
      {},
    ],
  })

  return (
    <PageTable
      title="用户管理"
      form={searchForm}
      formFieldsConfig={formFieldsConfig}
      operators={operators}
      onReset={search.reset}
      onSubmit={search.submit}
    >
      <Table {...tableProps} columns={columns} rowKey={'id'} bordered></Table>
    </PageTable>
  )
}

export default memo(Component)
