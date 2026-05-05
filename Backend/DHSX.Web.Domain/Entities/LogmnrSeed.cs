using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrSeed
{
    public decimal? SeedVersion { get; set; }

    public decimal? GatherVersion { get; set; }

    public string? Schemaname { get; set; }

    public decimal? Obj { get; set; }

    public decimal? Objv { get; set; }

    public string? TableName { get; set; }

    public string? ColName { get; set; }

    public decimal? Col { get; set; }

    public decimal? Intcol { get; set; }

    public decimal? Segcol { get; set; }

    public decimal? Type { get; set; }

    public decimal? Length { get; set; }

    public decimal? Precision { get; set; }

    public decimal? Scale { get; set; }

    public decimal Null { get; set; }

    public decimal? LogmnrUid { get; set; }

    public decimal? LogmnrFlags { get; set; }
}
