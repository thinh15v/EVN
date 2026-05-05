using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrTab
{
    public decimal? Ts { get; set; }

    public decimal? Cols { get; set; }

    public decimal? Property { get; set; }

    public decimal? Intcols { get; set; }

    public decimal? Kernelcols { get; set; }

    public decimal? Bobj { get; set; }

    public decimal? Trigflag { get; set; }

    public decimal? Flags { get; set; }

    public decimal Obj { get; set; }

    public decimal? LogmnrUid { get; set; }

    public decimal? LogmnrFlags { get; set; }

    public decimal? Acdrflags { get; set; }

    public decimal? Acdrtsobj { get; set; }

    public decimal? Acdrrowtsintcol { get; set; }
}
