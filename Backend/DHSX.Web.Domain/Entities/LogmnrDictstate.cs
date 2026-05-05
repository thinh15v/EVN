using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrDictstate
{
    public decimal? LogmnrUid { get; set; }

    public decimal? StartScnbas { get; set; }

    public decimal? StartScnwrp { get; set; }

    public decimal? EndScnbas { get; set; }

    public decimal? EndScnwrp { get; set; }

    public decimal? RedoThread { get; set; }

    public decimal? Rbasqn { get; set; }

    public decimal? Rbablk { get; set; }

    public decimal? Rbabyte { get; set; }

    public decimal? LogmnrFlags { get; set; }
}
