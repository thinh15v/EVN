using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class RedoLog
{
    public decimal Dbid { get; set; }

    public string? GlobalDbname { get; set; }

    public string? Dbuname { get; set; }

    public string? Version { get; set; }

    public decimal Thread { get; set; }

    public decimal? ResetlogsScnBas { get; set; }

    public decimal? ResetlogsScnWrp { get; set; }

    public decimal ResetlogsTime { get; set; }

    public decimal? PresetlogsScnBas { get; set; }

    public decimal? PresetlogsScnWrp { get; set; }

    public decimal PresetlogsTime { get; set; }

    public decimal Sequence { get; set; }

    public decimal? Dupid { get; set; }

    public decimal? Status1 { get; set; }

    public decimal? Status2 { get; set; }

    public string? CreateTime { get; set; }

    public string? CloseTime { get; set; }

    public string? DoneTime { get; set; }

    public decimal? FirstScnBas { get; set; }

    public decimal? FirstScnWrp { get; set; }

    public decimal? FirstTime { get; set; }

    public decimal? NextScnBas { get; set; }

    public decimal? NextScnWrp { get; set; }

    public decimal? NextTime { get; set; }

    public decimal? FirstScn { get; set; }

    public decimal? NextScn { get; set; }

    public decimal ResetlogsScn { get; set; }

    public decimal? Blocks { get; set; }

    public decimal? BlockSize { get; set; }

    public decimal? OldBlocks { get; set; }

    public DateTime? CreateDate { get; set; }

    public decimal? Error1 { get; set; }

    public decimal? Error2 { get; set; }

    public string? Filename { get; set; }

    public decimal? Ts1 { get; set; }

    public decimal? Ts2 { get; set; }

    public decimal? Endian { get; set; }

    public decimal? Spare2 { get; set; }

    public decimal? Spare3 { get; set; }

    public decimal? Spare4 { get; set; }

    public DateTime? Spare5 { get; set; }

    public string? Spare6 { get; set; }

    public string? Spare7 { get; set; }

    public decimal? Ts3 { get; set; }

    public decimal PresetlogsScn { get; set; }

    public decimal? Spare8 { get; set; }

    public decimal? Spare9 { get; set; }

    public decimal? Spare10 { get; set; }

    public decimal? OldStatus1 { get; set; }

    public decimal? OldStatus2 { get; set; }

    public string? OldFilename { get; set; }

    public decimal TenantKey { get; set; }
}
