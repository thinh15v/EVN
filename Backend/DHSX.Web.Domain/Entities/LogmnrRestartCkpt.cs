using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrRestartCkpt
{
    public decimal Session { get; set; }

    public decimal? Valid { get; set; }

    public decimal CkptScn { get; set; }

    public decimal Xidusn { get; set; }

    public decimal Xidslt { get; set; }

    public decimal Xidsqn { get; set; }

    public decimal SessionNum { get; set; }

    public decimal SerialNum { get; set; }

    public byte[]? CkptInfo { get; set; }

    public decimal? Flag { get; set; }

    public decimal? Offset { get; set; }

    public byte[]? ClientData { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public decimal Pdbid { get; set; }
}
