// File: MinioStorageService.cs (Trong DHSX.Web.Infrastructure)
using DHSX.Web.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Minio;
using Minio.DataModel.Args;   

namespace DHSX.Web.Infrastructure.Storage
{
    public class MinioStorageService : IStorageService
    {
        private readonly IMinioClient _minioClient;
        private readonly string _bucketName;

        public async Task<string> GetPresignedUrlAsync(string objectName, int expiryMinutes = 60)
        {
            try
            {
                // Kiểm tra file có tồn tại trên MinIO không
                var statArgs = new StatObjectArgs()
                    .WithBucket(_bucketName)
                    .WithObject(objectName);
                await _minioClient.StatObjectAsync(statArgs);

                // Tạo link tải có thời hạn
                var presignedArgs = new PresignedGetObjectArgs()
                    .WithBucket(_bucketName)
                    .WithObject(objectName)
                    .WithExpiry(expiryMinutes * 60); // Đổi ra giây

                return await _minioClient.PresignedGetObjectAsync(presignedArgs);
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi lấy link tải file: {ex.Message}");
            }
        }
        public MinioStorageService(IConfiguration configuration)
        {
            var endPoint = configuration["MinioSettings:Endpoint"];
            var accessKey = configuration["MinioSettings:AccessKey"];
            var secretKey = configuration["MinioSettings:SecretKey"];
            _bucketName = configuration["MinioSettings:BucketName"];
            bool useSSL = bool.Parse(configuration["MinioSettings:UseSSL"] ?? "false");

            _minioClient = new MinioClient()
                .WithEndpoint(endPoint)
                .WithCredentials(accessKey, secretKey)
                .WithSSL(useSSL)
                .Build();
        }

        public async Task<string> UploadFileAsync(IFormFile file, string folderPrefix)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File không hợp lệ.");

            // 1. Kiểm tra xem Bucket đã tồn tại chưa, chưa có thì tạo mới
            var bktExistArgs = new BucketExistsArgs().WithBucket(_bucketName);
            bool found = await _minioClient.BucketExistsAsync(bktExistArgs);
            if (!found)
            {
                var mkBktArgs = new MakeBucketArgs().WithBucket(_bucketName);
                await _minioClient.MakeBucketAsync(mkBktArgs);
            }

            // 2. Tạo tên file unique (để không bị trùng nếu up cùng tên)
            string fileExtension = Path.GetExtension(file.FileName);
            string uniqueFileName = $"{folderPrefix}/{DateTime.Now:yyyyMMddHHmmss}_{Guid.NewGuid().ToString().Substring(0, 8)}{fileExtension}";

            // 3. Đẩy file lên MinIO
            using var stream = file.OpenReadStream();
            var putObjectArgs = new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(uniqueFileName)
                .WithStreamData(stream)
                .WithObjectSize(file.Length)
                .WithContentType(file.ContentType);

            await _minioClient.PutObjectAsync(putObjectArgs);

            // Trả về đường dẫn (Object Name) để lưu vào Oracle
            return uniqueFileName;
        }
    }
}