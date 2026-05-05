using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class OlNode
{
    public string? OlName { get; set; }

    public string? Category { get; set; }

    public decimal? NodeId { get; set; }

    public decimal? ParentId { get; set; }

    public decimal? NodeType { get; set; }

    public decimal? NodeTextlen { get; set; }

    public decimal? NodeTextoff { get; set; }

    public string? NodeName { get; set; }
}
