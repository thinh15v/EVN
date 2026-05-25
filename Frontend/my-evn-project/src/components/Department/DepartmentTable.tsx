import React from 'react';
import { Table, Button, Popconfirm, Space, Typography, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DepartmentItem } from '@/types/department';

const { Text } = Typography;

interface Props {
  data: DepartmentItem[];
  loading: boolean;
  onEdit: (item: DepartmentItem) => void;
  onDelete: (id: number) => void;
  isAdmin: boolean;
}

const DepartmentTable: React.FC<Props> = ({ data, loading, onEdit, onDelete, isAdmin }) => {
  const columns = [
    {
      title: <Text style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>MÃ BAN</Text>,
      dataIndex: 'deptCode',
      key: 'deptCode',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: <Text style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>TÊN BAN</Text>,
      dataIndex: 'deptName',
      key: 'deptName',
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: <Text style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>MÔ TẢ</Text>,
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <Text type="secondary">{text || '-'}</Text>,
    },
    {
      title: <Text style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>THAO TÁC</Text>,
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: DepartmentItem) => (
        <Space size="middle">
          {isAdmin ? (
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              Sửa
            </Button>
          ) : null}
          {isAdmin ? (
            <Popconfirm
              title="Xác nhận xóa Ban này?"
              onConfirm={() => onDelete(record.deptId)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button danger icon={<DeleteOutlined />}>Xóa</Button>
            </Popconfirm>
          ) : (
            <Tag color="default">Chỉ Admin</Tag>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data.map((item) => ({ ...item, key: item.deptId }))}
      loading={loading}
      pagination={{ pageSize: 8 }}
      rowKey="deptId"
    />
  );
};

export default DepartmentTable;
