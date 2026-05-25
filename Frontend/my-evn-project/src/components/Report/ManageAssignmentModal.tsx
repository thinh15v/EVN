import React, { useState, useEffect } from 'react';
import { Modal, Form, Checkbox, Row, Col, Button, Spin, message } from 'antd';
// Đảm bảo import đúng đường dẫn service của bạn
import { DepartmentService } from '@/services/DepartmentsService'; 

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  currentAssignments: any[]; // Danh sách các Ban đã được phân công
}

export default function ManageAssignmentModal({ isOpen, onClose, onSave, currentAssignments }: Props) {
  const [manageForm] = Form.useForm();
  
  // STATE MỚI: Chứa danh sách phòng ban và trạng thái tải
  const [departments, setDepartments] = useState<any[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 1. Gọi API lấy danh sách
      fetchDepartments();

      // 2. Dùng setTimeout để CHỜ Form của Ant Design mount xong
      setTimeout(() => {
        const assignedDeptIds = currentAssignments
          .map(a => Number(a.deptId || a.DeptId))
          .filter(id => !isNaN(id) && id !== 0); // Lọc bỏ các ID lỗi (nếu có)

        // 3. Gán giá trị vào Form sau khi đã chờ
        manageForm.setFieldsValue({ 
          departmentIds: assignedDeptIds 
        });
      }, 50); // Trễ 50ms là thời gian vàng để Form render

    } else {
      // Dọn dẹp khi đóng Modal
      setDepartments([]);
    }
  }, [isOpen, currentAssignments, manageForm]);

  // HÀM GỌI API LẤY PHÒNG BAN
  const fetchDepartments = async () => {
    setLoadingDepts(true);
    try {
      // Gọi service
      const res = await DepartmentService.getAllDepartments();
      if (res && res.data) {
        setDepartments(res.data);
      } else if (Array.isArray(res)) {
        setDepartments(res);
      }
    } catch (error: any) {
      message.error('Lỗi khi tải danh sách phòng ban: ' + error.message);
    } finally {
      setLoadingDepts(false);
    }
  };

  return (
    <Modal
      title={<span style={{ fontSize: 18, fontWeight: 'bold' }}>Quản lý phân công Ban</span>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
    >
      <Form form={manageForm} layout="vertical" onFinish={onSave} style={{ marginTop: 24 }}>
        
        {/* ĐƯA SPIN RA NGOÀI CÙNG ĐỂ BỌC FORM.ITEM */}
        <Spin spinning={loadingDepts} description="Đang tải danh sách Ban...">
          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Cập nhật danh sách Ban thực hiện</span>}
            name="departmentIds"
          >
            {/* BÂY GIỜ CHECKBOX.GROUP ĐÃ LÀ CON TRỰC TIẾP */}
            <Checkbox.Group style={{ width: '100%' }}>
              <Row gutter={[16, 16]}>
                
                {/* LẶP DỮ LIỆU ĐỘNG TỪ API THAY VÌ GÕ CỨNG */}
                {departments.map((dept) => (
                  <Col span={12} key={dept.deptId}>
                    <Checkbox value={dept.deptId}>
                      {dept.deptName}
                    </Checkbox>
                  </Col>
                ))}

                {!loadingDepts && departments.length === 0 && (
                  <Col span={24}>
                    <span style={{ color: '#999' }}>Không có dữ liệu phòng ban.</span>
                  </Col>
                )}

              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Spin>

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