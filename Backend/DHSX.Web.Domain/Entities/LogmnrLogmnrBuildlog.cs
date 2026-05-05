using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrLogmnrBuildlog
{
    public string? BuildDate { get; set; }

    public decimal? DbTxnScnbas { get; set; }

    public decimal? DbTxnScnwrp { get; set; }

    public decimal? CurrentBuildState { get; set; }

    public decimal? CompletionStatus { get; set; }

    public decimal? MarkedLogFileLowScn { get; set; }

    public string InitialXid { get; set; } = null!;

    public decimal? LogmnrUid { get; set; }

    public decimal? LogmnrFlags { get; set; }

    public string? CdbXid { get; set; }

    public decimal? Spare1 { get; set; }

    public string? Spare2 { get; set; }
}
