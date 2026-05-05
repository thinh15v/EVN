using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogstdbyPlsql
{
    public decimal? SessionId { get; set; }

    public decimal? StartFinish { get; set; }

    public string? CallText { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }
}
