using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogstdbyEdsTable
{
    public string Owner { get; set; } = null!;

    public string TableName { get; set; } = null!;

    public string? ShadowTableName { get; set; }

    public string? BaseTriggerName { get; set; }

    public string? ShadowTriggerName { get; set; }

    public string? Dblink { get; set; }

    public decimal? Flags { get; set; }

    public string? State { get; set; }

    public decimal? Objv { get; set; }

    public decimal? Obj { get; set; }

    public decimal? Sobj { get; set; }

    public DateTime? Ctime { get; set; }

    public decimal? Spare1 { get; set; }

    public string? Spare2 { get; set; }

    public decimal? Spare3 { get; set; }

    public string? MviewName { get; set; }

    public string? MviewLogName { get; set; }

    public string? MviewTriggerName { get; set; }
}
