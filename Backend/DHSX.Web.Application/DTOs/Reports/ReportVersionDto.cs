public class ReportVersionDto
{
    public decimal AssignmentId { get; set; } // Thêm dòng này để Frontend có ID mà gửi ngược lại
    public int VersionId { get; set; }
    public int VersionNumber { get; set; }
    public string FileName { get; set; }
    public string FilePath { get; set; }
    public string Note { get; set; }
    public DateTime UploadedAt { get; set; }
    public bool IsSelected { get; set; }
    public int UploadedBy { get; set; }
    public string UploadedByName { get; set; }
}