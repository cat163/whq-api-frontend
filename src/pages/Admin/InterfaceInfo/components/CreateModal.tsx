import { FormValueType } from '@/pages/Admin/InterfaceInfo/components/UpdateForm';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import Modal from 'antd/es/modal/Modal';
import React from 'react';

export type Props = {
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: API.InterfaceInfo) => Promise<void>;
  visible: boolean;
};

// 可以解析到对象成员
const CreateModal: React.FC<Props> = (props) => {
  const { visible, columns, onCancel, onSubmit } = props;
  return (
    <Modal visible={visible} footer={null} onCancel={() => onCancel?.()}>
      <ProTable
        type="form"
        columns={columns}
        // 把proTable的参数提交
        onSubmit={async (values) => {
          onSubmit?.(values);
        }}
      />
    </Modal>
  );
};

export default CreateModal;
