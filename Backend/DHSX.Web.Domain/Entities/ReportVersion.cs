using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class ReportVersion
{
    public decimal VersionId { get; set; }

    public decimal AssignmentId { get; set; }

    public decimal VersionNumber { get; set; }

    public string FileName { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public string? Note { get; set; }

    public bool? IsSelected { get; set; }

    public decimal UploadedBy { get; set; }

    public DateTime? UploadedAt { get; set; }

    public virtual ReportAssignment Assignment { get; set; } = null!;
}
