using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrLog
{
    public decimal Session { get; set; }

    public decimal Thread { get; set; }

    public decimal Sequence { get; set; }

    public decimal FirstChange { get; set; }

    public decimal? NextChange { get; set; }

    public DateTime? FirstTime { get; set; }

    public DateTime? NextTime { get; set; }

    public string? FileName { get; set; }

    public decimal? Status { get; set; }

    public string? Info { get; set; }

    public DateTime? Timestamp { get; set; }

    public string? DictBegin { get; set; }

    public string? DictEnd { get; set; }

    public string? StatusInfo { get; set; }

    public decimal DbId { get; set; }

    public decimal ResetlogsChange { get; set; }

    public decimal ResetTimestamp { get; set; }

    public decimal? PrevResetlogsChange { get; set; }

    public decimal? PrevResetTimestamp { get; set; }

    public decimal? Blocks { get; set; }

    public decimal? BlockSize { get; set; }

    public decimal? Flags { get; set; }

    public decimal? Contents { get; set; }

    public decimal? Recid { get; set; }

    public decimal? Recstamp { get; set; }

    public decimal? MarkDeleteTimestamp { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public decimal? Spare3 { get; set; }

    public decimal? Spare4 { get; set; }

    public decimal? Spare5 { get; set; }
}
