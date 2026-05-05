using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class RedoDb
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

    public decimal? SeqnoRcvCur { get; set; }

    public decimal? SeqnoRcvLo { get; set; }

    public decimal? SeqnoRcvHi { get; set; }

    public decimal? SeqnoDoneCur { get; set; }

    public decimal? SeqnoDoneLo { get; set; }

    public decimal? SeqnoDoneHi { get; set; }

    public decimal? GapSeqno { get; set; }

    public decimal? GapRet { get; set; }

    public decimal? GapDone { get; set; }

    public decimal? ApplySeqno { get; set; }

    public decimal? ApplyDone { get; set; }

    public decimal? PurgeDone { get; set; }

    public decimal? HasChild { get; set; }

    public decimal? Error1 { get; set; }

    public decimal? Status { get; set; }

    public DateTime? CreateDate { get; set; }

    public decimal? Ts1 { get; set; }

    public decimal? Ts2 { get; set; }

    public decimal? GapNextScn { get; set; }

    public decimal? GapNextTime { get; set; }

    public decimal? CurscnTime { get; set; }

    public decimal ResetlogsScn { get; set; }

    public decimal PresetlogsScn { get; set; }

    public decimal? GapRet2 { get; set; }

    public decimal? Curlog { get; set; }

    public decimal? Endian { get; set; }

    public decimal? Enqidx { get; set; }

    public decimal? Spare4 { get; set; }

    public DateTime? Spare5 { get; set; }

    public string? Spare6 { get; set; }

    public string? Spare7 { get; set; }

    public decimal? Ts3 { get; set; }

    public decimal? Curblkno { get; set; }

    public decimal? Spare8 { get; set; }

    public decimal? Spare9 { get; set; }

    public decimal? Spare10 { get; set; }

    public decimal? Spare11 { get; set; }

    public decimal? Spare12 { get; set; }

    public decimal TenantKey { get; set; }
}
