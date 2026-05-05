using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrError
{
    public decimal? Session { get; set; }

    public DateTime? TimeOfError { get; set; }

    public decimal? Code { get; set; }

    public string? Message { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public decimal? Spare3 { get; set; }

    public string? Spare4 { get; set; }

    public string? Spare5 { get; set; }
}
