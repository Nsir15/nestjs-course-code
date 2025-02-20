import { App } from 'antd'
import { MessageInstance } from 'antd/es/message/interface'
import { NotificationInstance } from 'antd/es/notification/interface'
import { ModalStaticFunctions } from 'antd/es/modal/confirm'

let message: MessageInstance
let notification: NotificationInstance
let modal: Omit<ModalStaticFunctions, 'warn'>

const Component = () => {
  // const {} = props
  const staticFunction = App.useApp()
  message = staticFunction.message
  modal = staticFunction.modal
  notification = staticFunction.notification
  // 空组件，主要是为了全局绑定这几个属性值，方便全局调用

  return null
}

export { message, notification, modal }

export default Component
