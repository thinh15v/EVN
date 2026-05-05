using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class SchedulerProgramArgsTbl
{
    public string Owner { get; set; } = null!;

    public string ProgramName { get; set; } = null!;

    public string? ArgumentName { get; set; }

    public decimal ArgumentPosition { get; set; }

    public string? ArgumentType { get; set; }

    public string? MetadataAttribute { get; set; }

    public string? DefaultValue { get; set; }

    public string? OutArgument { get; set; }
}
