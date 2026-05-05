using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrUser
{
    public decimal? User { get; set; }

    public string Name { get; set; } = null!;

    public decimal? LogmnrUid { get; set; }

    public decimal? LogmnrFlags { get; set; }

    public decimal? Spare1 { get; set; }
}
