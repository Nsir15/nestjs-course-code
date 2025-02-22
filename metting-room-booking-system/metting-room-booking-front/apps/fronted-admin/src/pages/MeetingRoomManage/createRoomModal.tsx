import { createMeetingRoom, getMeetingRoomDetail, updateMeetingRoom } from '@/api/meetingRoomManage'
import { MeetingRoom } from '@/types/api'
import { message, wrapRequest } from '@meeting-room/shared'
import { Form, Input, InputNumber, Modal, Select } from 'antd'
import { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useState } from 'react'

export interface ICreateRoomModalRef {
  show: (value?: MeetingRoom.ListItem) => void
}

interface IProps {
  refreshList?: () => void
}

const Component = forwardRef<ICreateRoomModalRef, IProps>((props, refs) => {
  // const {} = props
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [editData, setEditData] = useState<MeetingRoom.ListItem | undefined>(undefined)
  const isEdit = useMemo(() => !!editData, [editData])

  const title = useMemo(() => (isEdit ? '编辑会议室' : '新增会议室'), [isEdit])

  useImperativeHandle(refs, () => ({
    show: (value?: MeetingRoom.ListItem) => {
      setEditData(value)
      setVisible(true)
    },
  }))

  const handleCancel = () => {
    setVisible(false)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const [error] = isEdit
      ? await wrapRequest(updateMeetingRoom({ ...editData, ...values }))
      : await wrapRequest(createMeetingRoom(values))
    if (!error) {
      message.success(isEdit ? '修改成功' : '添加成功')
      setVisible(false)
      form.resetFields()
      props.refreshList?.()
    }
  }

  const fetchData = async () => {
    if (!editData) return
    const [, data] = await wrapRequest(getMeetingRoomDetail(editData?.id))
    if (data) {
      form.setFieldsValue(data)
    }
  }

  useEffect(() => {
    if (isEdit && visible) {
      fetchData()
    }
  }, [isEdit, visible])

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      cancelText="取消"
      okText="确定"
    >
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="会议室名称" name="name">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item label="会议室容量" name="capacity">
          <InputNumber style={{ width: '100%' }} controls={false}></InputNumber>
        </Form.Item>
        <Form.Item label="设备" name="equipment">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item label="位置" name="location">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select
            style={{ width: '100%' }}
            options={[
              {
                label: '空闲',
                value: MeetingRoom.Status.Available,
              },
              {
                label: '占用',
                value: MeetingRoom.Status.Reversed,
              },
            ]}
          ></Select>
        </Form.Item>
        <Form.Item label="备注" name="description">
          <Input allowClear></Input>
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default memo(Component)
