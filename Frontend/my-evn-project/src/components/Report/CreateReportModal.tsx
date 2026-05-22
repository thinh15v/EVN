import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Checkbox, Row, Col, Button, message, Spin } from 'antd';
import { ReportService } from '@/services/ReportService';
import { DepartmentService } from '@/services/DepartmentsService';
import Cookies from "js-cookie";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}
            
export default function CreateReportModal({ open, onCancel, onSuccess }: Props) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // State để lưu danh sách phòng ban và trạng thái loading
  const [departments, setDepartments] = useState<any[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  // Dùng useEffect để gọi API khi biến 'open' thay đổi thành true
  useEffect(() => {
    if (open) {
      fetchDepartments();
    } else {
      setDepartments([]); 
      form.resetFields();
    }
  }, [open]);

  // Hàm gọi API lấy phòng ban
  const fetchDepartments = async () => {
    setLoadingDepts(true);
    try {
      const res = await DepartmentService.getAllDepartments();
      
      if (res && res.data) {
        setDepartments(res.data);
      } else if (Array.isArray(res)) {
        setDepartments(res);
      }
    } catch (error: any) {
      messageApi.error('Lỗi khi tải danh sách phòng ban: ' + error.message);
    } finally {
      setLoadingDepts(false);
    }
  };

  const handleFinish = async (values: any) => {
    try {
      // Ép kiểu dữ liệu sang số nguyên để C# không báo lỗi 400
      const payload = {
        reportName: values.reportName,
        reportType: values.reportType,
        deadline: values.deadline.format('YYYY-MM-DDTHH:mm:ss'),
        departmentIds: Array.isArray(values.departmentIds) 
          ? values.departmentIds.map((id: any) => Number(id)) 
          : [],
        CreatedByUserId: Number(localStorage.getItem('currentUserId')) || 0 
      };

      const result = await ReportService.createReport(payload);

      if (result) {
        messageApi.success('Khởi tạo đợt báo cáo thành công!');
        form.resetFields();
        onSuccess();
        onCancel();
      }
    } catch (error: any) {
      messageApi.error(error.message || 'Có lỗi xảy ra khi tạo báo cáo.');
    }
  };

  return (
    <Modal
      title={<span style={{ fontSize: 18, fontWeight: 'bold' }}>Khởi tạo đợt báo cáo mới</span>}
      open={open}
      onCancel={onCancel}
      width={650}
      footer={null}
      centered
    >
      {contextHolder}

      <Form form={form} layout="vertical" onFinish={handleFinish} style={{ marginTop: 24 }}>
        <Form.Item
          label={<span style={{ fontWeight: 600 }}>Tên Báo cáo <span style={{color: 'red'}}>*</span></span>}
          name="reportName"
          rules={[{ required: true, message: 'Vui lòng nhập tên báo cáo!' }]}
        >
          <Input placeholder="Nhập tên báo cáo" size="large" style={{ borderRadius: 8 }} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={<span style={{ fontWeight: 600 }}>Phân loại</span>} name="reportType" initialValue="EVN">
              <Select
                size="large"
                style={{ borderRadius: 8 }}
                options={[
                  { value: 'EVN', label: 'Báo cáo EVN' },
                  { value: 'NPT', label: 'Báo cáo NPT' }
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Hạn chót nộp <span style={{color: 'red'}}>*</span></span>}
              name="deadline"
              rules={[{ required: true, message: 'Vui lòng chọn hạn chót!' }]}
            >
              <DatePicker showTime format="MM/DD/YYYY HH:mm" size="large" style={{ width: '100%', borderRadius: 8 }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Bọc Spin Ở NGOÀI Form.Item để Ant Design lấy được mảng Checkbox */}
        <Spin spinning={loadingDepts} description="Đang tải danh sách phòng ban...">
          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Phân công cho các Ban <span style={{color: 'red'}}>*</span></span>}
            name="departmentIds"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 Ban.' }]}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Row gutter={[16, 16]}>
                
                {/* LẶP QUA DANH SÁCH API TRẢ VỀ THEO ĐÚNG BIẾN deptId, deptName */}
                {departments.map((dept) => (
                  <Col span={12} key={dept.deptId}>
                    <div style={{ border: '1px solid #d9d9d9', padding: '10px 16px', borderRadius: 8 }}>
                      <Checkbox value={dept.deptId}>
                        {dept.deptName}
                      </Checkbox>
                    </div>
                  </Col>
                ))}

                {/* Hiển thị dòng thông báo nếu Backend trả về mảng rỗng */}
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
          <Button size="large" style={{ borderRadius: 8 }} onClick={onCancel}>Hủy bỏ</Button>
          <Button type="primary" htmlType="submit" size="large" style={{ backgroundColor: '#80b3ff', borderRadius: 8, fontWeight: 600, border: 'none' }}>
            Khởi tạo & Phân công
          </Button>
        </div>
      </Form>
    </Modal>
  );
}