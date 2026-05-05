using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class AqQueue
{
    public Guid Oid { get; set; }

    public decimal Eventid { get; set; }

    public string Name { get; set; } = null!;

    public decimal TableObjno { get; set; }

    public decimal Usage { get; set; }

    public decimal EnableFlag { get; set; }

    public decimal? MaxRetries { get; set; }

    public decimal? RetryDelay { get; set; }

    public decimal? Properties { get; set; }

    public decimal? RetTime { get; set; }

    public string? QueueComment { get; set; }

    public decimal? MemoryThreshold { get; set; }

    public string? ServiceName { get; set; }

    public string? NetworkName { get; set; }

    public Guid? SubOid { get; set; }

    public decimal? Sharded { get; set; }

    public decimal? BaseQueue { get; set; }
}
