import React, { useEffect } from 'react';
import { Modal, Form, Checkbox, Row, Col, Button } from 'antd';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  currentAssignments: any[]; // Danh sách các Ban đã được phân công
}

export default function ManageAssignmentModal({ isOpen, onClose, onSave, currentAssignments }: Props) {
  const [manageForm] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      // KIỂM TRA KỸ: Lấy ID từ deptId (chữ thường) hoặc DeptId (chữ hoa) tùy theo API trả về
      const assignedDeptIds = currentAssignments.map(a => {
        // Trích xuất ID, hỗ trợ cả 2 kiểu đặt tên
        const id = a.deptId !== undefined ? a.deptId : a.DeptId;
        return Number(id); // Ép về kiểu số để so sánh chính xác với value của Checkbox
      });

      console.log("Các Ban đang được check:", assignedDeptIds); // Bạn có thể xem log ở F12 để kiểm tra

      // Gán giá trị vào Form
      manageForm.setFieldsValue({ 
        departmentIds: assignedDeptIds 
      });
    }
  }, [isOpen, currentAssignments, manageForm]);

  return (
    <Modal
      title={<span style={{ fontSize: 18, fontWeight: 'bold' }}>Quản lý phân công Ban</span>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnHidden // Thêm dòng này để reset Modal hoàn toàn khi đóng
      centered
    >
      <Form form={manageForm} layout="vertical" onFinish={onSave} style={{ marginTop: 24 }}>
        <Form.Item
          label={<span style={{ fontWeight: 600 }}>Cập nhật danh sách Ban thực hiện</span>}
          name="departmentIds"
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              {/* Lưu ý: Các value ở đây phải là KIỂU SỐ (Number) để khớp với dữ liệu từ API */}
              <Col span={12}><Checkbox value={1}>Ban Kế hoạch</Checkbox></Col>
              <Col span={12}><Checkbox value={2}>Ban Kỹ thuật</Checkbox></Col>
              <Col span={12}><Checkbox value={3}>Ban Tài chính</Checkbox></Col>
              <Col span={12}><Checkbox value={4}>Ban Quản lý dự án</Checkbox></Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32, borderTop: '1px solid #f0f0f0', paddingTop: 20 }}>
          <Button onClick={onClose}>Hủy bỏ</Button>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#2563eb' }}>
            Lưu thay đổi
          </Button>
        </div>
      </Form>
    </Modal>
  );
}