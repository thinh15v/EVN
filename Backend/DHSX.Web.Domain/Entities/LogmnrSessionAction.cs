using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrSessionAction
{
    public decimal? Flagsruntime { get; set; }

    public decimal? Dropscn { get; set; }

    public DateTime? Modifytime { get; set; }

    public DateTime? Dispatchtime { get; set; }

    public DateTime? Droptime { get; set; }

    public decimal? Lcrcount { get; set; }

    public string Actionname { get; set; } = null!;

    public decimal Logmnrsession { get; set; }

    public decimal Processrole { get; set; }

    public decimal Actiontype { get; set; }

    public decimal? Flagsdefinetime { get; set; }

    public DateTime? Createtime { get; set; }

    public decimal? Xidusn { get; set; }

    public decimal? Xidslt { get; set; }

    public decimal? Xidsqn { get; set; }

    public decimal? Thread { get; set; }

    public decimal? Startscn { get; set; }

    public decimal? Startsubscn { get; set; }

    public decimal? Endscn { get; set; }

    public decimal? Endsubscn { get; set; }

    public decimal? Rbasqn { get; set; }

    public decimal? Rbablk { get; set; }

    public decimal? Rbabyte { get; set; }

    public decimal? Session { get; set; }

    public decimal? Obj { get; set; }

    public decimal? Attr1 { get; set; }

    public decimal? Attr2 { get; set; }

    public decimal? Attr3 { get; set; }

    public decimal? Spare1 { get; set; }

    public decimal? Spare2 { get; set; }

    public DateTime? Spare3 { get; set; }

    public string? Spare4 { get; set; }

    public decimal? Pdbid { get; set; }

    public string? PdbName { get; set; }
}
