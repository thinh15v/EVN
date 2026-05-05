using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrEnc
{
    public decimal? Obj { get; set; }

    public decimal? Owner { get; set; }

    public decimal? Encalg { get; set; }

    public decimal? Intalg { get; set; }

    public byte[]? Colklc { get; set; }

    public decimal? Klclen { get; set; }

    public decimal? Flag { get; set; }

    public string Mkeyid { get; set; } = null!;

    public decimal? LogmnrUid { get; set; }

    public decimal? LogmnrFlags { get; set; }
}
