using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrcGtlo
{
    public decimal LogmnrUid { get; set; }

    public decimal Keyobj { get; set; }

    public decimal Lvlcnt { get; set; }

    public decimal Baseobj { get; set; }

    public decimal Baseobjv { get; set; }

    public decimal? Lvl1obj { get; set; }

    public decimal? Lvl2obj { get; set; }

    public decimal Lvl0type { get; set; }

    public decimal? Lvl1type { get; set; }

    public decimal? Lvl2type { get; set; }

    public decimal? Owner { get; set; }

    public string Ownername { get; set; } = null!;

    public string Lvl0name { get; set; } = null!;

    public string? Lvl1name { get; set; }

    public string? Lvl2name { get; set; }

    public decimal Intcols { get; set; }

    public decimal? Cols { get; set; }

    public decimal? Kernelcols { get; set; }

    public decimal? TabFlags { get; set; }

    public decimal? Trigflag { get; set; }

    public decimal? Assoc { get; set; }

    public decimal? ObjFlags { get; set; }

    public decimal? Ts { get; set; }

    public string? Tsname { get; set; }

    public decimal? Property { get; set; }

    public decimal StartScn { get; set; }

    public decimal? DropScn { get; set; }

    public decimal? Xidusn { get; set; }

    public decimal? Xidslt { get; set; }

    public decimal? Xidsqn { get; set; }

    public decimal? Flags { get; set; }

    public decimal? LogmnrSpare1 { get; set; }

    public decimal? LogmnrSpare2 { get; set; }

    public string? LogmnrSpare3 { get; set; }

    public DateTime? LogmnrSpare4 { get; set; }

    public decimal? LogmnrSpare5 { get; set; }

    public decimal? LogmnrSpare6 { get; set; }

    public decimal? LogmnrSpare7 { get; set; }

    public decimal? LogmnrSpare8 { get; set; }

    public decimal? LogmnrSpare9 { get; set; }

    public decimal? Parttype { get; set; }

    public decimal? Subparttype { get; set; }

    public decimal? Unsupportedcols { get; set; }

    public decimal? Complextypecols { get; set; }

    public decimal? Ntparentobjnum { get; set; }

    public decimal? Ntparentobjversion { get; set; }

    public decimal? Ntparentintcolnum { get; set; }

    public decimal? Logmnrtloflags { get; set; }

    public string? Logmnrmcv { get; set; }

    public decimal? Acdrflags { get; set; }

    public decimal? Acdrtsobj { get; set; }

    public decimal? Acdrrowtsintcol { get; set; }
}
