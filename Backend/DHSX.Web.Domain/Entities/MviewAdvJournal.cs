using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

/// <summary>
/// Summary advisor journal table for debugging and information
/// </summary>
public partial class MviewAdvJournal
{
    public decimal Runid { get; set; }

    public decimal Seq { get; set; }

    public DateTime Timestamp { get; set; }

    public decimal Flags { get; set; }

    public decimal? Num { get; set; }

    public string? Text { get; set; }

    public decimal? Textlen { get; set; }

    public virtual MviewAdvLog Run { get; set; } = null!;
}
