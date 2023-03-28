import {
  getInterfaceInfoByIdUsingGET,
  invokeInterfaceInfoUsingPOST
} from '@/services/whq-api-backend/interfaceInfoController';
import { PageContainer } from '@ant-design/pro-components';
import {Button, Card, Descriptions, Form, Input, message, Spin} from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState<boolean>();
  const params = useParams();

  const onFinish = async (values: any) => {
    if (!params.id) {
      message.error('接口不存在');
      return;
    }
    setInvokeLoading(false);
    const hide = message.loading('请求中');
    try {
       const res = await invokeInterfaceInfoUsingPOST({
        id: params.id,
        ...values
      })
      setInvokeRes(res.data);
      hide();
      message.success('请求成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('请求失败：' + error.message);
      return false;
    }
    setInvokeLoading(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const loadData = async () => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoByIdUsingGET({
        id: Number(params.id),
      });
      setData(res.data);
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

  // 返回渲染出去
  return (
    <PageContainer title={'查看接口文档'}>
      <Card>
        {data ? (
          <Descriptions title={data.name} column={1}>
            <Descriptions.Item label="接口状态">
              {data.status === 1 ? '正常' : '关闭'}
            </Descriptions.Item>
            <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
            <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
          </Descriptions>
        ) : (
          <></>
        )}
      </Card>

      <Card title="在线测试">
        <Form
          name="invoke"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="请求参数"
            name="useRequestParams"
          >
            <Input.TextArea/>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="返回结果" loading={invokeLoading}>
        {invokeRes}
      </Card>
    </PageContainer>
  );
};

export default Index;
