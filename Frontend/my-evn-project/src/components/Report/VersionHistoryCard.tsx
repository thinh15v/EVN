import React from 'react';
import { Card, Timeline, Space, Row, Col, Typography, Empty, Spin } from 'antd';
import { HistoryOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

// Định nghĩa kiểu dữ liệu truyền vào (Props)
interface VersionHistoryCardProps {
  versions: any[];
  deptName?: string;
  loading?: boolean; // Thêm prop loading để hiện hiệu ứng xoay xoay khi đang tải
}

export default function VersionHistoryCard({ versions, deptName, loading = false }: VersionHistoryCardProps) {
  return (
    <Card 
      title={
        <Space style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>
          <HistoryOutlined style={{ color: '#2563eb' }} /> 
          Các phiên bản đã nộp của {deptName || 'Ban Kỹ Thuật'}
        </Space>
      }
      style={{ borderRadius: 12, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
    >
      <div style={{ padding: '10px 0 0 10px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin description="Đang tải lịch sử phiên bản..." />
          </div>
        ) : versions && versions.length > 0 ? (
          <Timeline
            items={versions.map((v, idx) => {
              const isLatest = idx === 0;
              // Bắt đủ các trường hợp viết hoa/thường
              const versionNum = v.version || v.Version || v.versionNumber || v.VersionNumber;
              const fName = v.fileName || v.FileName;
              const uName = v.uploadedByFullName || v.UploadedByFullName || 'NV. Trần Thị C';
              const uTime = v.uploadedAt || v.UploadedAt;
              const nText = v.notes || v.Notes || v.note || v.Note;

              return {
                // ĐÃ SỬA: Thay 'dot' bằng 'icon' để khắc phục cảnh báo Ant Design
                icon: (
                  <div style={{ 
                    width: 32, height: 32, borderRadius: '50%', 
                    backgroundColor: isLatest ? '#2563eb' : '#f8fafc', 
                    color: isLatest ? '#fff' : '#64748b', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: 13, fontWeight: 'bold', 
                    border: isLatest ? 'none' : '1px solid #e2e8f0',
                    boxShadow: isLatest ? '0 2px 6px rgba(37,99,235,0.3)' : 'none'
                  }}>
                    v{versionNum}
                  </div>
                ),
                // ĐÃ SỬA: Thay 'children' bằng 'content' để khắc phục cảnh báo Ant Design
                content: (
                  <div style={{ 
                    marginLeft: 12, padding: '16px', backgroundColor: '#fff', 
                    borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 24,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                  }}>
                    <Row justify="space-between" align="top">
                      <Col>
                        <Space orientation="vertical" size={2}>
                          <Space>
                            <FileTextOutlined style={{ color: '#2563eb', fontSize: 16 }} />
                            <Text strong style={{ color: '#2563eb', fontSize: 14 }}>
                              {fName}
                            </Text>
                          </Space>
                          <Text type="secondary" style={{ fontSize: 13, marginLeft: 24 }}>
                            Người nộp: {uName}
                          </Text>
                        </Space>
                      </Col>
                      <Col>
                        <div style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: 6, color: '#475569' }}>
                          <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                            {dayjs(uTime).format('HH:mm DD/MM/YYYY')}
                          </Text>
                        </div>
                      </Col>
                    </Row>
                    {nText && (
                      <div style={{ marginTop: 16, padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                        <Text italic style={{ fontSize: 13, color: '#475569' }}>"{nText}"</Text>
                      </div>
                    )}
                  </div>
                )
              };
            })}
          />
        ) : (
          <Empty 
            description={<Text type="secondary">Ban chưa nộp phiên bản nào</Text>} 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            style={{ padding: '40px 0' }}
          />
        )}
      </div>
    </Card>
  );
}