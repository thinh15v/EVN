using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class OlHint
{
    public string? OlName { get; set; }

    public decimal? Hint { get; set; }

    public string? Category { get; set; }

    public decimal? HintType { get; set; }

    public string? HintText { get; set; }

    public decimal? Stage { get; set; }

    public decimal? Node { get; set; }

    public string? TableName { get; set; }

    public decimal? TableTin { get; set; }

    public decimal? TablePos { get; set; }

    public decimal? RefId { get; set; }

    public string? UserTableName { get; set; }

    public decimal? Cost { get; set; }

    public decimal? Cardinality { get; set; }

    public decimal? Bytes { get; set; }

    public decimal? HintTextoff { get; set; }

    public decimal? HintTextlen { get; set; }

    public string? JoinPred { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public string? HintString { get; set; }
}
