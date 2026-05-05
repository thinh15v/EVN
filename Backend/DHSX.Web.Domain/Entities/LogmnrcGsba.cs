using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrcGsba
{
    public decimal LogmnrUid { get; set; }

    public decimal AsOfScn { get; set; }

    public decimal? FdoLength { get; set; }

    public byte[]? FdoValue { get; set; }

    public decimal? Charsetid { get; set; }

    public decimal? Ncharsetid { get; set; }

    public decimal? DbtimezoneLen { get; set; }

    public string? DbtimezoneValue { get; set; }

    public decimal? LogmnrSpare1 { get; set; }

    public decimal? LogmnrSpare2 { get; set; }

    public string? LogmnrSpare3 { get; set; }

    public DateTime? LogmnrSpare4 { get; set; }

    public string? DbGlobalName { get; set; }
}
