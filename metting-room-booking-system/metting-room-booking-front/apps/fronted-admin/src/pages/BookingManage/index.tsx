import { FC, memo } from 'react'

interface IProps {}
const Component: FC<IProps> = (props) => {
  // const {} = props
  return <div>index</div>
}

export default memo(Component)
