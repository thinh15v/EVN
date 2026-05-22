import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { DepartmentService } from '@/services/DepartmentsService';
import { DepartmentItem, DepartmentPayload } from '@/types/department';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: DepartmentItem | null;
  isAdmin?: boolean;
}

const DepartmentFormModal: React.FC<Props> = ({ open, onCancel, onSuccess, initialData, isAdmin = false }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        deptCode: initialData.deptCode,
        deptName: initialData.deptName,
        description: initialData.description,
      });
    }
    if (!open) {
      form.resetFields();
    }
  }, [open, initialData, form]);

  const handleFinish = async (values: any) => {
    if (!isAdmin) {
      message.error('Bạn không có quyền thực hiện thao tác này.');
      return;
    }

    try {
      if (initialData?.deptId) {
        const payload: DepartmentPayload = {
          deptCode: values.deptCode,
          deptName: values.deptName,
          description: values.description,
        };

        const res = await DepartmentService.updateDepartment(initialData.deptId, payload);

        if (res && res.success) {
          message.success('Cập nhật Ban thành công.');
          onSuccess();
          onCancel();
        } else {
          message.error(res?.message || 'Cập nhật thất bại.');
        }
        return;
      }

      const payload: DepartmentPayload = {
        deptCode: values.deptCode,
        deptName: values.deptName,
        description: values.description,
      };

      const res = await DepartmentService.createDepartment(payload);

      if (res && res.success) {
        message.success('Tạo mới Ban thành công.');
        onSuccess();
        onCancel();
      } else {
        message.error(res?.message || 'Tạo mới thất bại.');
      }
    } catch (error: any) {
      console.error('DepartmentFormModal error:', error);
      message.error(error?.message || 'Lỗi máy chủ, vui lòng thử lại.');
    }
  };

  return (
    <Modal
      title={initialData?.deptId ? 'Cập nhật thông tin Ban' : 'Tạo mới Ban'}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ deptCode: '', deptName: '', description: '' }}
      >
        <Form.Item
          label="Mã Ban"
          name="deptCode"
          rules={[{ required: true, message: 'Vui lòng nhập mã Ban.' }]}
        >
          <Input placeholder="Nhập mã Ban" />
        </Form.Item>

        <Form.Item
          label="Tên Ban"
          name="deptName"
          rules={[{ required: true, message: 'Vui lòng nhập tên Ban.' }]}
        >
          <Input placeholder="Nhập tên Ban" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} placeholder="Mô tả ngắn gọn về Ban" />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit" style={{ borderRadius: 6 }}>
            {initialData?.deptId ? 'Lưu thay đổi' : 'Lưu Ban'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default DepartmentFormModal;
