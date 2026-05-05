using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrOpqtype
{
    public decimal Intcol { get; set; }

    public decimal? Type { get; set; }

    public decimal? Flags { get; set; }

    public decimal? Lobcol { get; set; }

    public decimal? Objcol { get; set; }

    public decimal? Extracol { get; set; }

    public Guid? Schemaoid { get; set; }

    public decimal? Elemnum { get; set; }

    public string? Schemaurl { get; set; }

    public decimal Obj { get; set; }

    public decimal? LogmnrUid { get; set; }

    public decimal? LogmnrFlags { get; set; }
}
