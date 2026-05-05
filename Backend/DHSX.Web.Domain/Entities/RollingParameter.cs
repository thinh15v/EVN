using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class RollingParameter
{
    public decimal? Scope { get; set; }

    public string? Name { get; set; }

    public decimal? Id { get; set; }

    public string? Descrip { get; set; }

    public decimal? Type { get; set; }

    public decimal? Datatype { get; set; }

    public decimal? Attributes { get; set; }

    public string? Curval { get; set; }

    public string? Lstval { get; set; }

    public string? Defval { get; set; }

    public decimal? Minval { get; set; }

    public decimal? Maxval { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }
}
