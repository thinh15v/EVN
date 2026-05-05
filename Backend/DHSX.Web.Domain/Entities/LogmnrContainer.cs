using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrContainer
{
    public decimal Obj { get; set; }

    public decimal ConId { get; set; }

    public decimal Dbid { get; set; }

    public decimal ConUid { get; set; }

    public decimal CreateScnwrp { get; set; }

    public decimal CreateScnbas { get; set; }

    public decimal? Flags { get; set; }

    public decimal Status { get; set; }

    public decimal? LogmnrUid { get; set; }

    public decimal? LogmnrFlags { get; set; }

    public decimal? Vsn { get; set; }

    public decimal? FedRootConId { get; set; }
}
