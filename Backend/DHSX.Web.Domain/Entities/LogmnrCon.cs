using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrCon
{
    public decimal Owner { get; set; }

    public string Name { get; set; } = null!;

    public decimal Con { get; set; }

    public decimal? LogmnrUid { get; set; }

    public decimal? LogmnrFlags { get; set; }

    public decimal? StartScnbas { get; set; }

    public decimal? StartScnwrp { get; set; }
}
