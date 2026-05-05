using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrAgeSpill
{
    public decimal Session { get; set; }

    public decimal Xidusn { get; set; }

    public decimal Xidslt { get; set; }

    public decimal Xidsqn { get; set; }

    public decimal Chunk { get; set; }

    public decimal Sequence { get; set; }

    public decimal? Offset { get; set; }

    public byte[]? SpillData { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public decimal Pdbid { get; set; }
}
