import { listInterfaceInfoByPageUsingGET } from '@/services/whq-api-backend/interfaceInfoController';
import { PageContainer } from '@ant-design/pro-components';
import { List, message } from 'antd';
import React, { useEffect, useState } from 'react';

/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  const DEFAULT_PAGE_SIZE: number = 10
  const DEFAULT_current_PAGE: number = 1
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);

  const loadData = async (current = DEFAULT_current_PAGE, pageSize = DEFAULT_PAGE_SIZE) => {
    setLoading(true);
    try {
      const res = await listInterfaceInfoByPageUsingGET({
        current,
        pageSize,
      });
      setList(res?.data?.records ?? []);
      setTotal(res?.data?.total ?? 0);
      return true;
    } catch (error: any) {
      message.error('请求失败：' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageContainer title={'在线接口开放平台'}>
      <List
        className="my-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => {
          const apiLink = `/interface_info/${item.id}`
          return (
            <List.Item actions={[<a key={item.id} href={apiLink}>查看</a>]}>
              <List.Item.Meta
                title={<a href={apiLink}>{item.name}</a>}
                description={item.description}
              />
            </List.Item>
          )
        }}
        pagination={{
          showTotal(){
            return "总数：" + total;
          },
          align: 'center',
          pageSize: DEFAULT_PAGE_SIZE,
          total,
          onChange(page, pageSize) {
            loadData(page, pageSize);
          },
        }}
      />
    </PageContainer>
  );
};

export default Index;
