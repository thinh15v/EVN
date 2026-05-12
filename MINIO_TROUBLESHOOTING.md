# Khắc phục lỗi MinIO Upload/Download

## Lỗi hiện tại
```
<Error>
<Code>InvalidAccessKeyId</Code>
<Message>The Access Key Id you provided does not exist in our records.</Message>
</Error>
```

**Nguyên nhân**: Access Key ID trong config không khớp với MinIO server

---

## Bước 1: Kiểm tra MinIO Server đang chạy

### Kiểm tra MinIO container
```powershell
# Nếu dùng Docker
docker ps | findstr minio

# Hoặc kiểm tra port 9000
netstat -ano | findstr 9000
```

### Kiểm tra MinIO Web UI
- Truy cập: http://localhost:9000
- Username: `minioadmin`
- Password: `minioadmin`

Nếu không login được, MinIO server không chạy hoặc credentials sai.

---

## Bước 2: Kiểm tra MinIO Credentials

### Cách 1: Qua MinIO Web UI (http://localhost:9000)
1. Login với `minioadmin:minioadmin`
2. Tìm menu "Access Keys"
3. Xem danh sách access keys hiện có
4. Ghi nhớ Access Key ID và Secret Key chính xác

### Cách 2: Qua MinIO CLI (nếu cài đặt)
```bash
# Liệt kê tất cả access keys
mc admin user list local

# Hoặc xem thông tin user minioadmin
mc admin user info local minioadmin
```

---

## Bước 3: Cập nhật Config

Sửa file `appsettings.json`:
```json
"MinioSettings": {
  "Endpoint": "localhost:9000",
  "AccessKey": "YOUR_ACTUAL_ACCESS_KEY",
  "SecretKey": "YOUR_ACTUAL_SECRET_KEY",
  "BucketName": "bcdhbucket",
  "UseSSL": false
}
```

**Lưu ý**: Nếu dùng Docker, có thể `Endpoint` là tên container hoặc IP:
```json
"Endpoint": "minio:9000"  // nếu cùng Docker network
// hoặc
"Endpoint": "192.168.x.x:9000"  // nếu MinIO ở máy khác
```

---

## Bước 4: Test Upload/Download

1. **Rebuild backend**:
```powershell
cd d:\Task\Backend\DHSX.Web.API
dotnet build
```

2. **Chạy backend**:
```powershell
dotnet run
```

3. **Xem logs**:
   - Khi upload: Tìm dòng `[INFO] File uploaded to MinIO successfully:`
   - Khi download: Tìm dòng `[INFO] Presigned URL created successfully:`

4. **Test upload file tại Admin**:
   - Chọn file và bấm upload
   - Kiểm tra logs xem file được upload hay không

5. **Test download**:
   - Bấm nút download file
   - Nếu lỗi vẫn xuất hiện, copy lỗi chi tiết từ logs

---

## Bước 5: Kiểm tra Bucket tồn tại

Vào MinIO Web UI và xem:
- Bucket `bcdhbucket` có tồn tại không?
- Có file `report_221/final_summaries/20260512110718_f5be1f8f.docx` không?

Nếu file không tồn tại, tức là upload thực sự thất bại.

---

## Ghi chú quan trọng

1. **Presigned URL**: Được tạo bởi backend với credentials, gửi về frontend để browser download
2. **Lỗi InvalidAccessKeyId**: MinIO server không nhận ra access key trong presigned URL
3. **Giải pháp**: Đảm bảo credentials trong config khớp với MinIO server

---

## Câu lệnh hữu ích

### Xem log MinIO (nếu dùng Docker)
```powershell
docker logs <minio-container-name> --tail 100
```

### Xem log Backend
- Khi chạy `dotnet run`, logs sẽ in trực tiếp trên console
- Tìm dòng có `[INFO]` hoặc `[ERROR]`

### Reset MinIO (xóa tất cả dữ liệu - cẩn thận!)
```bash
docker rm -f <minio-container>
docker volume rm <minio-volume>
```

---

## Nếu vẫn không được

Hãy cung cấp:
1. **MinIO setup**: Docker? Local? Thông tin server?
2. **Logs chi tiết** từ backend khi upload/download
3. **Error message** chi tiết khi bấm download
4. **Kiểm tra**: Có file thực sự được lưu lên MinIO không?
