import { FC, memo, PropsWithChildren } from 'react'
import styles from './index.module.scss'
import SearchForm, { ISearchFormProps } from '../SearchForm'
import { Button, Space } from 'antd'

interface IProps extends ISearchFormProps {
  title: string
  operators?: Array<{
    label: string
    onClick: () => void
  }>
}

const Component: FC<PropsWithChildren<IProps>> = (props) => {
  const { title, operators, ...searchFormProps } = props
  return (
    <div className={styles.pageTableContainer}>
      <SearchForm {...searchFormProps}></SearchForm>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderTitle}>{title}</div>
          <div className={styles.tableActions}>
            <Space>
              {operators?.map((item, index) => {
                return (
                  <Button type="primary" key={`table-action-key-${index}`} onClick={item.onClick}>
                    {item.label}
                  </Button>
                )
              })}
            </Space>
          </div>
        </div>
        {props.children}
      </div>
    </div>
  )
}

export default memo(Component)
