using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class AqInternetAgentPriv
{
    public string AgentName { get; set; } = null!;

    public string DbUsername { get; set; } = null!;

    public virtual AqInternetAgent AgentNameNavigation { get; set; } = null!;
}
