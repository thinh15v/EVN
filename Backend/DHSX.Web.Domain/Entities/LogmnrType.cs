using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrType
{
    public decimal? Version { get; set; }

    public string? Version1 { get; set; }

    public Guid? Tvoid { get; set; }

    public decimal? Typecode { get; set; }

    public decimal? Properties { get; set; }

    public decimal? Attributes { get; set; }

    public decimal? Methods { get; set; }

    public decimal? Hiddenmethods { get; set; }

    public decimal? Supertypes { get; set; }

    public decimal? Subtypes { get; set; }

    public decimal? Externtype { get; set; }

    public string? Externname { get; set; }

    public string? Helperclassname { get; set; }

    public decimal? LocalAttrs { get; set; }

    public decimal? LocalMethods { get; set; }

    public Guid? Typeid { get; set; }

    public Guid? Roottoid { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public decimal? Spare3 { get; set; }

    public Guid? Supertoid { get; set; }

    public byte[]? Hashcode { get; set; }

    public Guid Toid { get; set; }

    public decimal? LogmnrUid { get; set; }

    public decimal? LogmnrFlags { get; set; }
}
