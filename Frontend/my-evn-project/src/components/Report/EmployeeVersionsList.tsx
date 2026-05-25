import React from 'react';
import { Card, Space, Typography, Row, Col, Tag, Button } from 'antd';
import { 
  FileExcelOutlined, FileWordOutlined, FilePdfOutlined, FileTextOutlined,
  DownloadOutlined, ClockCircleOutlined, UserOutlined, 
  CheckSquareFilled, BorderOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { ReportService } from '@/services/ReportService';
import { message } from 'antd';

const { Text } = Typography;

interface EmployeeVersionsListProps {
  versions: any[];
  selectedVersionId: number | null;
  onSelectVersion: (versionId: number) => void;
}

export default function EmployeeVersionsList({ versions, selectedVersionId, onSelectVersion }: EmployeeVersionsListProps) {

    const [messageApi] = message.useMessage();

    const handleDownloadFile = async (file: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn chặn việc click nhầm vào vùng Collapse
    
    // Lấy filePath từ data backend trả về (nhớ kiểm tra xem backend trả là filePath hay FilePath nhé)
    const filePath = file.filePath || file.FilePath; 
  
    if (!filePath) {
      messageApi.error('Không tìm thấy đường dẫn file để tải!');
      return;
    }
  
    try {
      messageApi.loading({ content: 'Đang lấy liên kết tải...', key: 'download_file' });
      
      // Gọi API lấy link
      const res = await ReportService.getDownloadLink(filePath);
  
      if (res && res.success && res.downloadUrl) {
        messageApi.success({ content: 'Đang tải xuống!', key: 'download_file', duration: 2 });
        
        // Mở link trong tab ẩn để trình duyệt tự động tải file về máy
        const link = document.createElement('a');
        link.href = res.downloadUrl;
        link.target = '_blank';
        link.setAttribute('download', file.fileName || file.FileName || 'Bao_Cao');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
      } else {
        messageApi.error({ content: res.message || 'Lỗi khi lấy liên kết!', key: 'download_file' });
      }
    } catch (error) {
      messageApi.error({ content: 'Lỗi kết nối máy chủ!', key: 'download_file' });
    }
  };
  
  // Hàm chọn icon động dựa theo đuôi file
  const getFileIcon = (fileName: string = '') => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.endsWith('.xls') || lowerName.endsWith('.xlsx')) return <FileExcelOutlined style={{ color: '#10b981', fontSize: 18 }} />;
    if (lowerName.endsWith('.doc') || lowerName.endsWith('.docx')) return <FileWordOutlined style={{ color: '#3b82f6', fontSize: 18 }} />;
    if (lowerName.endsWith('.pdf')) return <FilePdfOutlined style={{ color: '#ef4444', fontSize: 18 }} />;
    return <FileTextOutlined style={{ color: '#64748b', fontSize: 18 }} />;
  };

  if (!versions || versions.length === 0) {
    return <Text type="secondary">Chưa có bản cập nhật nào từ nhân viên.</Text>;
  }

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      {versions.map((v) => {
        const vId = v.versionId || v.VersionId;
        const isSelected = selectedVersionId === vId;
        const vNum = v.versionNumber || v.VersionNumber || v.version || v.Version;

        return (
          
          <div 
            key={vId}
            onClick={() => onSelectVersion(vId)}
            style={{ 
              backgroundColor: '#fff',
              border: isSelected ? '2px solid #10b981' : '1px solid #e2e8f0', // Viền xanh lá khi được chọn
              borderRadius: 12,
              padding: '16px 20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: isSelected ? '0 4px 12px rgba(16, 185, 129, 0.15)' : '0 1px 2px rgba(0,0,0,0.02)'
            }}
          >
            <Row wrap={false} align="top" gutter={16}>
              {/* Cột Checkbox */}
              <Col>
                {isSelected ? (
                  <CheckSquareFilled style={{ color: '#10b981', fontSize: 24, marginTop: 2 }} />
                ) : (
                  <BorderOutlined style={{ color: '#cbd5e1', fontSize: 24, marginTop: 2 }} />
                )}
              </Col>

              {/* Cột Nội dung File */}
              <Col flex="auto">
                <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                  <Col>
                    <Space size={12}>
                      {getFileIcon(v.fileName || v.FileName)}
                      <Text strong style={{ fontSize: 15, color: '#1e293b' }}>
                        {v.fileName || v.FileName}
                      </Text>
                      <Tag color="default" style={{ borderRadius: 12, border: 'none', backgroundColor: '#f1f5f9', color: '#475569' }}>
                        Phiên bản {vNum}
                      </Tag>
                    </Space>
                  </Col>
                  <Col>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<DownloadOutlined />} 
                      style={{ color: '#3b82f6', fontWeight: 500 }}
                      onClick={(e) => handleDownloadFile(v, e)}
                    >
                      Tải file
                    </Button>
                  </Col>
                </Row>

                <Space size={24} style={{ marginBottom: 12 }}>
                  <Space size={6} style={{ color: '#64748b', fontSize: 13 }}>
                    <ClockCircleOutlined />
                    <span>{dayjs(v.uploadedAt || v.UploadedAt).format('HH:mm DD/MM/YYYY')}</span>
                  </Space>
                  <Space size={6} style={{ color: '#64748b', fontSize: 13 }}>
                    <UserOutlined />
                    <span>{v.uploadedByFullName || v.UploadedByFullName || 'NV. Trần Thị C'}</span>
                  </Space>
                </Space>

                {/* Box ghi chú nếu có */}
                {(v.note || v.Note) && (
                  <div style={{ backgroundColor: '#f8fafc', padding: '10px 16px', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                    <Text italic style={{ color: '#475569', fontSize: 13 }}>"{v.note || v.Note}"</Text>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        );
      })}
    </Space>
  );
}