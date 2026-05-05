using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class AqInternetAgent
{
    public string AgentName { get; set; } = null!;

    public decimal Protocol { get; set; }

    public string? Spare1 { get; set; }
}
