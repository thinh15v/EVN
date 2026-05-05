using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class ReportFinalFile
{
    public decimal FileId { get; set; }

    public decimal ReportId { get; set; }

    public string? FileName { get; set; }

    public string? FilePath { get; set; }

    public DateTime? UploadedAt { get; set; }

    public virtual Report Report { get; set; } = null!;
}
