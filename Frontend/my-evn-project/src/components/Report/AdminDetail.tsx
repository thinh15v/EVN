import React from 'react';
import { Card, Button, Collapse, List, Tag, Upload, Space, Row, Col, Typography } from 'antd';
import { 
  TeamOutlined, 
  LockOutlined, 
  UnlockOutlined, 
  FileTextOutlined, 
  CloudUploadOutlined, 
  DownloadOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';

const { Text } = Typography;
const { Panel } = Collapse;
const { Dragger } = Upload;

export const AdminDetailView = ({ report, onUnlock, onUploadFinal, onToggleGlobalLock, onOpenManageModal }: any) => {

  // Hàm tạo màu sắc cho trạng thái (Badge)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã xác nhận': return 'green';
      case 'Đã cập nhật': return 'blue';
      case 'Đang thực hiện': return 'orange';
      case 'Chưa cập nhật': return 'red';
      default: return 'default';
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      {/* Nút quay lại */}
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary" style={{ cursor: 'pointer' }}>← Quay lại danh sách</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* ================= CỘT TRÁI: TIẾN ĐỘ CÁC BAN ================= */}
        <Col span={16}>
          <Card
            title={<span style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' }}>Tiến độ các Ban</span>}
            extra={
              <Space>
                <Button type="primary" icon={<TeamOutlined />} onClick={onOpenManageModal} style={{ backgroundColor: '#3366ff' }}>
                  Phân công
                </Button>
                <Button
                  danger={!report?.globalLocked}
                  type={report?.globalLocked ? "default" : "primary"}
                  icon={report?.globalLocked ? <UnlockOutlined /> : <LockOutlined />}
                  onClick={onToggleGlobalLock}
                >
                  {report?.globalLocked ? 'Mở khóa tổng' : 'Khóa tổng'}
                </Button>
              </Space>
            }
            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: 'none' }}
            styles={{ body: { padding: '16px', backgroundColor: '#f8fafc' } }}
          >
            <Collapse 
              defaultActiveKey={report?.departments?.map((d: any) => d.id)} 
              expandIconPosition="end" 
              style={{ backgroundColor: 'white', borderRadius: 8 }}
            >
              {report?.departments?.map((dept: any) => (
                <Panel
                  header={<span style={{ fontWeight: 'bold', fontSize: 15 }}>{dept.name}</span>}
                  key={dept.id}
                  extra={
                    <Space>
                      <Tag color={getStatusColor(dept.status)} style={{ fontWeight: 'bold' }}>{dept.status.toUpperCase()}</Tag>
                      {dept.locked && (
                        <Button size="small" danger onClick={(e) => { e.stopPropagation(); onUnlock(dept.id); }} style={{ fontWeight: 'bold', fontSize: 11 }}>
                          MỞ KHÓA
                        </Button>
                      )}
                    </Space>
                  }
                >
                  {dept.versions?.length === 0 ? (
                    <Text type="secondary" italic>Chưa có bản nộp nào...</Text>
                  ) : (
                    <List
                      dataSource={dept.versions}
                      renderItem={(v: any) => (
                        <List.Item
                          actions={[<DownloadOutlined key="download" style={{ color: '#1890ff', cursor: 'pointer', fontSize: 18 }} />]}
                          style={{ 
                            backgroundColor: v.selected ? '#f6ffed' : 'white', 
                            border: v.selected ? '1px solid #b7eb8f' : '1px solid #f0f0f0', 
                            borderRadius: 8, 
                            marginBottom: 8, 
                            padding: '12px 16px' 
                          }}
                        >
                          <List.Item.Meta
                            avatar={<FileTextOutlined style={{ fontSize: 24, color: v.selected ? '#52c41a' : '#1890ff' }} />}
                            title={
                              <Space>
                                <Text strong style={{ fontSize: 14 }}>{v.file}</Text>
                                {v.selected && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                              </Space>
                            }
                            description={`Phiên bản ${v.v} • Nộp lúc: ${v.time}`}
                          />
                        </List.Item>
                      )}
                    />
                  )}
                </Panel>
              ))}
            </Collapse>
          </Card>
        </Col>

        {/* ================= CỘT PHẢI: FILE TỔNG HỢP ================= */}
        <Col span={8}>
          <Card
            title={<span style={{ color: 'white', display: 'flex', alignItems: 'center' }}><CheckCircleOutlined style={{ marginRight: 8 }} /> FILE TỔNG HỢP (BẢN CHỐT)</span>}
            styles={{ header: { backgroundColor: '#00529C', borderRadius: '8px 8px 0 0' }, body: { padding: '20px' } }}
            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: 'none', overflow: 'hidden' }}
          >
            <Dragger
              showUploadList={false}
              customRequest={() => onUploadFinal(prompt("Nhập tên file tổng hợp giả lập:"))}
              style={{ padding: '24px 0', backgroundColor: '#f0f5ff', borderColor: '#adc6ff', borderRadius: 8 }}
            >
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined style={{ color: '#1890ff', fontSize: 54 }} />
              </p>
              <p className="ant-upload-text" style={{ fontWeight: 'bold', color: '#00529C', marginTop: 10 }}>Tải lên báo cáo tổng hợp</p>
              <p className="ant-upload-hint" style={{ fontSize: 12, color: '#8c8c8c' }}>Định dạng hỗ trợ: PDF, DOCX, XLSX</p>
            </Dragger>

            <div style={{ marginTop: 24 }}>
              <Text type="secondary" strong style={{ fontSize: 11, letterSpacing: 1 }}>DANH SÁCH FILE ĐÃ CHỐT</Text>
              <List
                style={{ marginTop: 12 }}
                dataSource={report?.finalFiles || []}
                locale={{ emptyText: 'Chưa có file tổng hợp nào' }}
                renderItem={(f: any) => (
                  <List.Item
                    actions={[<DownloadOutlined key="download" style={{ color: '#bfbfbf', cursor: 'pointer', fontSize: 16 }} />]}
                    style={{ backgroundColor: '#f8fafc', border: '1px solid #f0f0f0', borderRadius: 8, marginBottom: 8, padding: '12px 16px' }}
                  >
                    <List.Item.Meta
                      avatar={<FileTextOutlined style={{ fontSize: 22, color: '#00529C' }} />}
                      title={<Text strong style={{ fontSize: 13 }}>{f.name}</Text>}
                      description={<Text style={{ fontSize: 11, color: '#bfbfbf' }}>{f.time}</Text>}
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};