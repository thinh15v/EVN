using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

/// <summary>
/// Log all calls to summary advisory functions
/// </summary>
public partial class MviewAdvLog
{
    public decimal Runid { get; set; }

    public decimal? Filterid { get; set; }

    public DateTime? RunBegin { get; set; }

    public DateTime? RunEnd { get; set; }

    public decimal? RunType { get; set; }

    public string? Uname { get; set; }

    public decimal Status { get; set; }

    public string? Message { get; set; }

    public decimal? Completed { get; set; }

    public decimal? Total { get; set; }

    public string? ErrorCode { get; set; }

    public virtual ICollection<MviewAdvAjg> MviewAdvAjgs { get; set; } = new List<MviewAdvAjg>();

    public virtual ICollection<MviewAdvClique> MviewAdvCliques { get; set; } = new List<MviewAdvClique>();

    public virtual ICollection<MviewAdvEligible> MviewAdvEligibles { get; set; } = new List<MviewAdvEligible>();

    public virtual ICollection<MviewAdvInfo> MviewAdvInfos { get; set; } = new List<MviewAdvInfo>();

    public virtual ICollection<MviewAdvJournal> MviewAdvJournals { get; set; } = new List<MviewAdvJournal>();

    public virtual ICollection<MviewAdvLevel> MviewAdvLevels { get; set; } = new List<MviewAdvLevel>();

    public virtual ICollection<MviewAdvOutput> MviewAdvOutputs { get; set; } = new List<MviewAdvOutput>();

    public virtual ICollection<MviewAdvRollup> MviewAdvRollups { get; set; } = new List<MviewAdvRollup>();
}
