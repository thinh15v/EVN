using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class MviewLog
{
    public decimal Id { get; set; }

    public decimal? Filterid { get; set; }

    public DateTime? RunBegin { get; set; }

    public DateTime? RunEnd { get; set; }

    public string? Type { get; set; }

    public string? Status { get; set; }

    public string? Message { get; set; }

    public decimal? Completed { get; set; }

    public decimal? Total { get; set; }

    public string? ErrorCode { get; set; }
}
