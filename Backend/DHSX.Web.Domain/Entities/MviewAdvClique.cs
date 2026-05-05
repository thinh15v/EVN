using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

/// <summary>
/// Table for storing canonical form of Clique queries
/// </summary>
public partial class MviewAdvClique
{
    public decimal Cliqueid { get; set; }

    public decimal Runid { get; set; }

    public decimal Cliquedeslen { get; set; }

    public byte[] Cliquedes { get; set; } = null!;

    public decimal Hashvalue { get; set; }

    public decimal Frequency { get; set; }

    public decimal Bytecost { get; set; }

    public decimal Rowsize { get; set; }

    public decimal Numrows { get; set; }

    public virtual MviewAdvLog Run { get; set; } = null!;
}
