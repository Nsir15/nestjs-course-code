import { getUserList } from '@/api/userManagement'
import { ISearchFormProps, PageTable, wrapRequest } from '@meeting-room/shared'
import { Form } from 'antd'
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

  const handleSearch = () => {}
  const handleReset = () => {}

  const fetchUserList = async () => {
    const [, data] = await wrapRequest(getUserList({}))
    if (data) {
    }
  }

  return (
    <PageTable
      title="用户管理"
      form={searchForm}
      formFieldsConfig={formFieldsConfig}
      operators={operators}
      onReset={handleReset}
      onSubmit={handleSearch}
    ></PageTable>
  )
}

export default memo(Component)
