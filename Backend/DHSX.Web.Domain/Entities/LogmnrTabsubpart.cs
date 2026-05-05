using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrTabsubpart
{
    public decimal? Obj { get; set; }

    public decimal? Dataobj { get; set; }

    public decimal? Pobj { get; set; }

    public decimal? Subpart { get; set; }

    public decimal Ts { get; set; }

    public decimal? LogmnrUid { get; set; }

    public decimal? LogmnrFlags { get; set; }
}
