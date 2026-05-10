import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Checkbox, Row, Col, Button, message } from 'antd';
import { ReportService } from '@/services/ReportService';
import Cookies from "js-cookie";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}
            
export default function CreateReportModal({ open, onCancel, onSuccess }: Props) {
  const [form] = Form.useForm();
  
  const [messageApi, contextHolder] = message.useMessage();
  

  const handleFinish = async (values: any) => {
    try {
      const result = await ReportService.createReport({
        reportName: values.reportName,
        reportType: values.reportType,
        deadline: values.deadline.format('YYYY-MM-DDTHH:mm:ss'),
        departmentIds: values.departmentIds,
        CreatedByUserId: localStorage.getItem('currentUserId') 
      });

      if (result) {
        messageApi.success('Khởi tạo đợt báo cáo thành công!');
        form.resetFields();
        onSuccess();
        onCancel();
      }
    } catch (error: any) {
      // IN RA LỖI CHI TIẾT ĐỂ BẠN BIẾT C# ĐANG PHÀN NÀN CHỖ NÀO
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
      {/* KHAI BÁO contextHolder CHO ANTD */}
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
            {/* ĐÃ FIX WARNING KEY CỦA THẺ SELECT */}
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

        <Form.Item
          label={<span style={{ fontWeight: 600 }}>Phân công cho các Ban <span style={{color: 'red'}}>*</span></span>}
          name="departmentIds"
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 Ban.' }]}
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ border: '1px solid #d9d9d9', padding: '10px 16px', borderRadius: 8 }}>
                  <Checkbox value={1}>Ban Kế hoạch</Checkbox>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ border: '1px solid #d9d9d9', padding: '10px 16px', borderRadius: 8 }}>
                  <Checkbox value={2}>Ban Kỹ thuật</Checkbox>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ border: '1px solid #d9d9d9', padding: '10px 16px', borderRadius: 8 }}>
                  <Checkbox value={3}>Ban Tài chính</Checkbox>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ border: '1px solid #d9d9d9', padding: '10px 16px', borderRadius: 8 }}>
                  <Checkbox value={4}>Ban Quản lý dự án</Checkbox>
                </div>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>

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