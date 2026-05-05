using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

/// <summary>
/// Group-by columns of a query
/// </summary>
public partial class MviewAdvGc
{
    public decimal Gcid { get; set; }

    public decimal Fjgid { get; set; }

    public decimal Gcdeslen { get; set; }

    public byte[] Gcdes { get; set; } = null!;

    public decimal Hashvalue { get; set; }

    public decimal? Frequency { get; set; }

    public virtual MviewAdvFjg Fjg { get; set; } = null!;
}
