import { applyMeetingRoom } from '@/api/meetingRoom'
import { MeetingRoom } from '@/types/api'
import { message, wrapRequest } from '@meeting-room/shared'
import { DatePicker, Form, Input, Modal } from 'antd'
import dayjs from 'dayjs'
import { forwardRef, memo, useImperativeHandle, useState } from 'react'

export interface IApplyModalRef {
  show: ({ roomId, meetingRoomName }: { roomId: number; meetingRoomName: string }) => void
}

interface IProps {}
const Component = forwardRef<IApplyModalRef, IProps>((props, ref) => {
  // const {} = props
  const [form] = Form.useForm<MeetingRoom.IBookingApplyParams>()
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => {
    return {
      show({ roomId, meetingRoomName }) {
        form.setFieldsValue({
          roomId,
          meetingRoomName,
        })
        setOpen(true)
      },
    }
  })

  const handleCancel = () => {
    setOpen(false)
    form.resetFields()
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const [err] = await wrapRequest(
      applyMeetingRoom({
        ...values,
        startTime: dayjs(values.startTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: dayjs(values.endTime).format('YYYY-MM-DD HH:mm:ss'),
      })
    )
    if (!err) {
      message.success('预定成功')
      setOpen(false)
      form.resetFields()
    }
  }

  return (
    <Modal
      open={open}
      width={600}
      title="预定会议室"
      cancelText="取消"
      okText="确定"
      onCancel={handleCancel}
      onClose={handleCancel}
      onOk={handleSubmit}
    >
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item hidden name="roomId">
          <Input></Input>
        </Form.Item>
        <Form.Item label="会议室名称" name="meetingRoomName">
          <Input readOnly></Input>
        </Form.Item>
        <Form.Item label="开始时间" name="startTime" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} showTime></DatePicker>
        </Form.Item>
        <Form.Item label="结束时间" name="endTime" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} showTime></DatePicker>
        </Form.Item>
        <Form.Item label="参会人" name="meetingMember">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default memo(Component)
