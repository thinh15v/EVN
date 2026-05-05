using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrAttribute
{
    public decimal? Version { get; set; }

    public string? Name { get; set; }

    public decimal? Attribute { get; set; }

    public Guid? AttrToid { get; set; }

    public decimal? AttrVersion { get; set; }

    public decimal? Synobj { get; set; }

    public decimal? Properties { get; set; }

    public decimal? Charsetid { get; set; }

    public decimal? Charsetform { get; set; }

    public decimal? Length { get; set; }

    public decimal? Precision { get; set; }

    public decimal? Scale { get; set; }

    public string? Externname { get; set; }

    public decimal? Xflags { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public decimal? Spare3 { get; set; }

    public decimal? Spare4 { get; set; }

    public decimal? Spare5 { get; set; }

    public decimal? Setter { get; set; }

    public decimal? Getter { get; set; }

    public Guid Toid { get; set; }

    public decimal? LogmnrUid { get; set; }

    public decimal? LogmnrFlags { get; set; }
}
