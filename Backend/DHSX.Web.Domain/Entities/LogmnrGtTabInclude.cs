using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrGtTabInclude
{
    public string? SchemaName { get; set; }

    public string? TableName { get; set; }

    public string? PdbName { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }
}
