using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrT
{
    public decimal? Ts { get; set; }

    public string? Name { get; set; }

    public decimal? Owner { get; set; }

    public decimal Blocksize { get; set; }

    public decimal? LogmnrUid { get; set; }

    public decimal? LogmnrFlags { get; set; }

    public decimal? StartScnbas { get; set; }

    public decimal? StartScnwrp { get; set; }
}
