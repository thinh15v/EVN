
1. Cài docker desktop + git: https://docs.docker.com/desktop/setup/install/windows-install/
https://git-scm.com/install/windows

2. Cài oracle 
Mở git bash:
> git clone https://github.com/oracle/docker-images.git

3. Tải image oracle 21c XE
- URL: https://www.oracle.com/database/technologies/xe-downloads.html
-> Tải file oracle-database-xe-21c-1.0-1.ol8.x86_64.rpm (for linux)
-> Copy file vừa tải vào thư mục 21.3.0 (VD C:\Users\thang\docker-images\OracleDatabase\SingleInstance\dockerfiles\21.3.0)

4. Build image oracle

Mở git bash:
> cd docker-images/OracleDatabase/SingleInstance/dockerfiles
> ./buildContainerImage.sh -x -v 21.3.0
* Chờ nó build hơi lâu đấy

5. Chạy container Oracle
Mở git bash:
> docker run -d \
  --name oracle-xe \
  -p 1521:1521 \
  -p 5500:5500 \
  -e ORACLE_PWD=123456 \
  oracle/database:21.3.0-xe
  
- Kiểm tra: > docker logs -f oracle-xe
	Nếu: DATABASE IS READY TO USE! -> OK
  
Dùng: Toad, DBeaver, Oracle SQL Developer kết nối theo:
Host	localhost
Port	1521
SID / Service	XEPDB1
Username	system
Password	123456

Tạo user/schema BAOCAO
Chạy script tạo bảng

------------------------
Cài minio:
Mở git bash:
> docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e MINIO_ROOT_USER=admin \
  -e MINIO_ROOT_PASSWORD=12345678 \
  -v minio_data:/data \
  minio/minio server /data --console-address ":9001"

Test -> Truy cập bằng url
http://localhost:9001
user: admin
password: 12345678
- Tạo 1 Bucket mới tên: bcdhbucket


Lệnh tạo entity từ DB:
> dotnet ef dbcontext scaffold "Data Source=localhost:1521/XEPDB1;User Id=system;Password=123456;" Oracle.EntityFrameworkCore --schema BAOCAO --project DHSX.Web.Infrastructure --startup-project DHSX.Web.API --context-dir Contexts --context OracleDbContext --output-dir ..\DHSX.Web.Domain\Entities --namespace DHSX.Web.Domain.Entities --force
