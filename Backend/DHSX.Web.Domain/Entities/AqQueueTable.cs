using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class AqQueueTable
{
    public string Schema { get; set; } = null!;

    public string Name { get; set; } = null!;

    public decimal UdataType { get; set; }

    public decimal Objno { get; set; }

    public decimal Flags { get; set; }

    public decimal SortCols { get; set; }

    public string? Timezone { get; set; }

    public string? TableComment { get; set; }
}
