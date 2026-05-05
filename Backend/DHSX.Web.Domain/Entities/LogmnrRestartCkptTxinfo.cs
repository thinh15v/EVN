using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrRestartCkptTxinfo
{
    public decimal Session { get; set; }

    public decimal Xidusn { get; set; }

    public decimal Xidslt { get; set; }

    public decimal Xidsqn { get; set; }

    public decimal SessionNum { get; set; }

    public decimal SerialNum { get; set; }

    public decimal? Flag { get; set; }

    public decimal? StartScn { get; set; }

    public decimal EffectiveScn { get; set; }

    public decimal? Offset { get; set; }

    public byte[]? TxData { get; set; }
}
