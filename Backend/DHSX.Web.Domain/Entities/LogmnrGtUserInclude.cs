using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrGtUserInclude
{
    public string? UserName { get; set; }

    public decimal? UserType { get; set; }

    public string? PdbName { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }
}
