// File: MinioStorageService.cs (Trong DHSX.Web.Infrastructure)
using DHSX.Web.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Minio;
using Minio.DataModel.Args;   
using System.Reactive.Linq;
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
                Console.WriteLine($"[INFO] Getting presigned URL:");
                Console.WriteLine($"  - BucketName: {_bucketName}");
                Console.WriteLine($"  - ObjectName: {objectName}");
                Console.WriteLine($"  - ExpiryMinutes: {expiryMinutes}");

                // Kiểm tra file có tồn tại trên MinIO không
                var statArgs = new StatObjectArgs()
                    .WithBucket(_bucketName)
                    .WithObject(objectName);
                
                Console.WriteLine($"[INFO] Checking if object exists on MinIO...");
                try
                {
                    var objectStat = await _minioClient.StatObjectAsync(statArgs);
                    Console.WriteLine($"[INFO] Object exists on MinIO. Size: {objectStat.Size} bytes, LastModified: {objectStat.LastModified}");
                }
                catch (Minio.Exceptions.ObjectNotFoundException)
                {
                    Console.WriteLine($"[ERROR] Object NOT FOUND on MinIO!");
                    Console.WriteLine($"[ERROR] Tried to access: bucket='{_bucketName}', object='{objectName}'");
                    
                    // Try to list objects in bucket to debug
                    try
                    {
                        var listArgs = new ListObjectsArgs().WithBucket(_bucketName).WithPrefix("");
                        var objects = await _minioClient.ListObjectsAsync(listArgs).ToList();
                        Console.WriteLine($"[DEBUG] Objects in bucket '{_bucketName}':");
                        if (objects.Count == 0)
                        {
                            Console.WriteLine($"[DEBUG] Bucket is EMPTY!");
                        }
                        else
                        {
                            foreach (var obj in objects.Take(20))
                            {
                                Console.WriteLine($"[DEBUG]   - {obj.Key}");
                            }
                        }
                    }
                    catch (Exception listEx)
                    {
                        Console.WriteLine($"[DEBUG] Failed to list objects: {listEx.Message}");
                    }
                    
                    throw;
                }

                // Tạo link tải có thời hạn
                var presignedArgs = new PresignedGetObjectArgs()
                    .WithBucket(_bucketName)
                    .WithObject(objectName)
                    .WithExpiry(expiryMinutes * 60); // Đổi ra giây

                Console.WriteLine($"[INFO] Creating presigned URL...");
                var presignedUrl = await _minioClient.PresignedGetObjectAsync(presignedArgs);
                Console.WriteLine($"[INFO] Presigned URL created successfully: {presignedUrl}");
                
                return presignedUrl;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Failed to get presigned URL: {ex.GetType().Name} - {ex.Message}");
                if (ex.InnerException != null)
                    Console.WriteLine($"[ERROR] Inner exception: {ex.InnerException.Message}");
                Console.WriteLine($"[ERROR] Stack trace: {ex.StackTrace}");
                throw new Exception($"Lỗi khi lấy link tải file: {ex.Message}", ex);
            }
        }
        public MinioStorageService(IConfiguration configuration)
        {
            var endPoint = configuration["MinioSettings:Endpoint"];
            var accessKey = configuration["MinioSettings:AccessKey"];
            var secretKey = configuration["MinioSettings:SecretKey"];
            _bucketName = configuration["MinioSettings:BucketName"];
            bool useSSL = bool.Parse(configuration["MinioSettings:UseSSL"] ?? "false");

            Console.WriteLine($"[INFO] Initializing MinIO client:");
            Console.WriteLine($"  - Endpoint: {endPoint}");
            Console.WriteLine($"  - AccessKey: {accessKey}");
            Console.WriteLine($"  - BucketName: {_bucketName}");
            Console.WriteLine($"  - UseSSL: {useSSL}");

            try
            {
                _minioClient = new MinioClient()
                    .WithEndpoint(endPoint)
                    .WithCredentials(accessKey, secretKey)
                    .WithSSL(useSSL)
                    .Build();
                Console.WriteLine("[INFO] MinIO client initialized successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Failed to initialize MinIO client: {ex.Message}");
                throw;
            }
        }

        public async Task<string> UploadFileAsync(IFormFile file, string folderPrefix)
        {
            try
            {
                if (file == null || file.Length == 0)
                    throw new ArgumentException("File không hợp lệ.");

                Console.WriteLine($"[INFO] Starting MinIO upload: BucketName={_bucketName}, FolderPrefix={folderPrefix}, FileName={file.FileName}, FileSize={file.Length}");

                // 1. Kiểm tra xem Bucket đã tồn tại chưa, chưa có thì tạo mới
                var bktExistArgs = new BucketExistsArgs().WithBucket(_bucketName);
                bool found = await _minioClient.BucketExistsAsync(bktExistArgs);
                if (!found)
                {
                    Console.WriteLine($"[INFO] Bucket '{_bucketName}' does not exist. Creating...");
                    var mkBktArgs = new MakeBucketArgs().WithBucket(_bucketName);
                    await _minioClient.MakeBucketAsync(mkBktArgs);
                    Console.WriteLine($"[INFO] Bucket '{_bucketName}' created successfully.");
                }
                else
                {
                    Console.WriteLine($"[INFO] Bucket '{_bucketName}' already exists.");
                }

                // 2. Tạo tên file unique (để không bị trùng nếu up cùng tên)
                string fileExtension = Path.GetExtension(file.FileName);
                string uniqueFileName = $"{folderPrefix}/{DateTime.Now:yyyyMMddHHmmss}_{Guid.NewGuid().ToString().Substring(0, 8)}{fileExtension}";
                Console.WriteLine($"[INFO] Generated unique file name: {uniqueFileName}");

                // 3. Đẩy file lên MinIO
                using var stream = file.OpenReadStream();
                var putObjectArgs = new PutObjectArgs()
                    .WithBucket(_bucketName)
                    .WithObject(uniqueFileName)
                    .WithStreamData(stream)
                    .WithObjectSize(file.Length)
                    .WithContentType(file.ContentType);

                Console.WriteLine($"[INFO] Uploading file to MinIO...");
                await _minioClient.PutObjectAsync(putObjectArgs);
                Console.WriteLine($"[INFO] File uploaded to MinIO successfully: {uniqueFileName}");

                // Trả về đường dẫn (Object Name) để lưu vào Oracle
                return uniqueFileName;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] MinIO upload failed: {ex.GetType().Name} - {ex.Message}");
                if (ex.InnerException != null)
                    Console.WriteLine($"[ERROR] Inner exception: {ex.InnerException.Message}");
                Console.WriteLine($"[ERROR] Stack trace: {ex.StackTrace}");
                throw new Exception($"Lỗi khi tải lên MinIO: {ex.Message}", ex);
            }
        }
    }
}