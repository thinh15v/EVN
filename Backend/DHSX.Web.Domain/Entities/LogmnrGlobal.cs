using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrGlobal
{
    public decimal? HighRecidForeign { get; set; }

    public decimal? HighRecidDeleted { get; set; }

    public decimal? LocalResetScn { get; set; }

    public decimal? LocalResetTimestamp { get; set; }

    public decimal? VersionTimestamp { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public decimal? Spare3 { get; set; }

    public string? Spare4 { get; set; }

    public DateTime? Spare5 { get; set; }

    public decimal? Session { get; set; }
}
