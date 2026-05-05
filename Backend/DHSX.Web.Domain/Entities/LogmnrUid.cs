using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrUid
{
    public decimal LogmnrUid1 { get; set; }

    public decimal? LogmnrDid { get; set; }

    public decimal? LogmnrMdh { get; set; }

    public string? PdbName { get; set; }

    public decimal? PdbId { get; set; }

    public decimal? PdbUid { get; set; }

    public decimal? StartScn { get; set; }

    public decimal? EndScn { get; set; }

    public decimal? Flags { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? Spare3 { get; set; }

    public DateTime? Spare4 { get; set; }
}
