using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrCcol
{
    public decimal? Con { get; set; }

    public decimal? Obj { get; set; }

    public decimal? Col { get; set; }

    public decimal? Pos { get; set; }

    public decimal Intcol { get; set; }

    public decimal? LogmnrUid { get; set; }

    public decimal? LogmnrFlags { get; set; }
}
