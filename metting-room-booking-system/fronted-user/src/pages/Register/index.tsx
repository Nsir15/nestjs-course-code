import React, { FC, memo } from 'react'

interface IProps {}
const Component: FC<IProps> = props => {
  // const {} = props
  return <div>register</div>
}

export default memo(Component)
