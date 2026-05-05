using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class RollingDatabase
{
    public decimal? Rdbid { get; set; }

    public decimal? Attributes { get; set; }

    public decimal? Attributes2 { get; set; }

    public string? Dbun { get; set; }

    public decimal? Dbid { get; set; }

    public decimal? ProdRscn { get; set; }

    public decimal? ProdRid { get; set; }

    public decimal? ProdScn { get; set; }

    public decimal? ConsRscn { get; set; }

    public decimal? ConsRid { get; set; }

    public decimal? ConsScn { get; set; }

    public decimal? EngineStatus { get; set; }

    public string? Version { get; set; }

    public decimal? RedoSource { get; set; }

    public DateTime? UpdateTime { get; set; }

    public decimal? Revision { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }
}
