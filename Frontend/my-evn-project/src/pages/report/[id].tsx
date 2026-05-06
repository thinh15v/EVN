import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, Col, Row, Typography, Collapse, Tag, Space, Upload, message, Empty, Spin } from 'antd';
import { 
  LeftOutlined, TeamOutlined, LockOutlined, UnlockOutlined, 
  InboxOutlined, DownloadOutlined, FileExcelOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { ReportService } from '@/services/ReportService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Dragger } = Upload;

export default function ReportDetail() {
  const router = useRouter();
  const { id } = router.query; 

  const [reportInfo, setReportInfo] = useState<any>(null); 
  const [assignments, setAssignments] = useState<any[]>([]); 
  const [finalFiles, setFinalFiles] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDetailData(Number(id));
    }
  }, [id]);

  const fetchDetailData = async (reportId: number) => {
    setLoading(true);
    try {
      const [detailRes, finalFilesRes] = await Promise.all([
        ReportService.getReportDetailAdmin(reportId), 
        ReportService.getFinalFiles(reportId)
      ]);

      if (detailRes.success) {
        setReportInfo(detailRes.data.report || detailRes.data.Report); 
        setAssignments(detailRes.data.assignments || detailRes.data.Assignments || []); 
      }
      
      if (finalFilesRes.success) {
        setFinalFiles(finalFilesRes.data || []);
      }
    } catch (error) {
      message.error('Lỗi khi tải chi tiết báo cáo!');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188', 
    onChange(info: any) { /* Xử lý upload */ }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;

  // CHUẨN BỊ MẢNG ITEMS CHO COLLAPSE (CHUẨN ANT DESIGN V5)
  const collapseItems = assignments.map((assign: any, index: number) => {
    const isLocked = assign.isLocked || assign.IsLocked;
    const deptName = assign.deptName || assign.DeptName || 'Tên Ban';
    const assignStatus = assign.assignStatus || assign.AssignStatus || 'CHƯA CẬP NHẬT';
    const filesList = assign.files || assign.Files || [];

    return {
      key: index.toString(),
      label: <span style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{deptName}</span>,
      extra: (
        <Space size="middle" onClick={(e) => e.stopPropagation()}>
          {isLocked ? (
            <Tag color="success" style={{ fontWeight: 600, padding: '4px 12px', borderRadius: 6 }}>ĐÃ XÁC NHẬN</Tag>
          ) : (
            <Tag style={{ fontWeight: 600, padding: '4px 12px', borderRadius: 6 }}>{assignStatus.toUpperCase()}</Tag>
          )}
          {isLocked && (
            <Button size="small" icon={<UnlockOutlined />} style={{ color: '#dc2626', borderColor: '#fecaca', fontWeight: 600, borderRadius: 4 }}>Mở khóa</Button>
          )}
        </Space>
      ),
      style: { backgroundColor: isLocked ? '#ffffff' : '#f8fafc', border: isLocked ? '1px solid #e2e8f0' : '1px dashed #cbd5e1', borderRadius: 8, marginBottom: 16 },
      children: (
        <div style={{ padding: '0 24px' }}>
          {filesList.length > 0 ? filesList.map((file: any, fIndex: number) => {
            const isFinal = file.isFinal || file.IsFinal;
            const fileName = file.fileName || file.FileName;
            const version = file.version || file.Version || 1;
            const uploadedAt = file.uploadedAt || file.UploadedAt;
            const notes = file.notes || file.Notes;

            return (
              <div key={fIndex} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px', border: isFinal ? '1px solid #bbf7d0' : '1px solid #e2e8f0', borderRadius: 8, marginBottom: 12, backgroundColor: isFinal ? '#f0fdf4' : '#ffffff' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <FileExcelOutlined style={{ fontSize: 24, color: isFinal ? '#16a34a' : '#2563eb', marginTop: 4 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: isFinal ? '#166534' : '#334155' }}>{fileName}</span>
                      {isFinal && <Tag color="#16a34a" style={{ fontWeight: 'bold', borderRadius: 12 }}>BẢN CHỐT</Tag>}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <Tag style={{ margin: 0, borderRadius: 4 }}>v{version}</Tag>
                      <span>{uploadedAt ? dayjs(uploadedAt).format('HH:mm DD/MM/YYYY') : 'Đang cập nhật...'}</span>
                    </div>
                    {notes && (
                      <div style={{ fontSize: 13, color: '#475569', fontStyle: 'italic', backgroundColor: isFinal ? '#ffffff' : '#f8fafc', padding: '6px 12px', borderRadius: 6, border: '1px solid #f1f5f9' }}>
                        Ghi chú: "{notes}"
                      </div>
                    )}
                  </div>
                </div>
                <Button type="text" icon={<DownloadOutlined style={{ fontSize: 18, color: isFinal ? '#16a34a' : '#2563eb' }} />} />
              </div>
            );
          }) : (
            <Empty description="Ban này chưa nộp báo cáo" />
          )}
        </div>
      )
    };
  });

  return (
    <>
      <div style={{ paddingBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, backgroundColor: '#fff', padding: '16px 24px', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <Button type="link" icon={<LeftOutlined />} onClick={() => router.push('/report')} style={{ fontWeight: 600, fontSize: 16, paddingLeft: 0, marginRight: 16 }}>
            Quay lại
          </Button>
          <Title level={4} style={{ margin: 0, color: '#1e293b' }}>
            {reportInfo?.reportName || reportInfo?.ReportName || 'Tên báo cáo trống'} 
          </Title>
        </div>

        <Row gutter={24}>
          <Col span={16}>
            <Card 
              title={<span style={{ fontSize: 18, fontWeight: 'bold' }}>Tình hình nộp báo cáo của các Ban</span>}
              extra={
                <Space>
                  <Button icon={<TeamOutlined />} style={{ color: '#2563eb', borderColor: '#bfdbfe', backgroundColor: '#eff6ff', fontWeight: 600, borderRadius: 6 }}>Quản lý phân công</Button>
                  <Button icon={<LockOutlined />} style={{ color: '#dc2626', borderColor: '#fecaca', backgroundColor: '#fef2f2', fontWeight: 600, borderRadius: 6 }}>Khóa toàn bộ</Button>
                </Space>
              }
              style={{ borderRadius: 12 }}
            >
              {assignments.length > 0 ? (
                // SỬ DỤNG ITEMS MỚI CHO COLLAPSE V5
                <Collapse 
                  defaultActiveKey={['0']} 
                  ghost 
                  expandIconPlacement="start" 
                  items={collapseItems} 
                />
              ) : (
                <Empty description="Chưa có phân công nào cho báo cáo này" />
              )}
            </Card>
          </Col>

          <Col span={8}>
            {/* SỬA CARD STYLE Ở ĐÂY */}
            <Card 
              style={{ borderRadius: 12 }} 
              styles={{ header: { backgroundColor: '#eff6ff' } }} 
              title={<div><CheckCircleOutlined /> File Báo Cáo Tổng Hợp</div>}
            >
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon"><InboxOutlined style={{ color: '#60a5fa', fontSize: 48 }} /></p>
                <p className="ant-upload-text">Kéo thả file tổng hợp vào đây</p>
              </Dragger>

              <div style={{ marginTop: 32 }}>
                <Text style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 16, display: 'block' }}>DANH SÁCH FILE FINAL</Text>
                {finalFiles.length > 0 ? (
                  finalFiles.map((ff: any, i: number) => (
                    <div key={i}>{ff.fileName || ff.FileName}</div> 
                  ))
                ) : (
                  <div style={{ textAlign: 'center' }}><Text type="secondary" italic>Chưa có file tổng hợp nào.</Text></div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}