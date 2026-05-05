using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrProfileTableStat
{
    public string? Owner { get; set; }

    public string? Name { get; set; }

    public decimal Objid { get; set; }

    public decimal? Opnum { get; set; }

    public decimal? Tlsbyunsuppopnum { get; set; }

    public decimal? Oggunsuppopnum { get; set; }

    public decimal? Oggfetchopnum { get; set; }

    public decimal? Oggplsqlopnum { get; set; }

    public decimal? Partnum { get; set; }

    public decimal? Insertnum { get; set; }

    public decimal? Updatenum { get; set; }

    public decimal? Deletenum { get; set; }

    public decimal? Ddlnum { get; set; }

    public decimal? Property1 { get; set; }

    public decimal? Property2 { get; set; }

    public decimal? Partitionattr { get; set; }

    public decimal? Redosize { get; set; }

    public decimal? Maxlobsize { get; set; }

    public decimal? Redorate { get; set; }

    public string? Spare1 { get; set; }

    public string? Spare2 { get; set; }

    public decimal? Spare3 { get; set; }

    public decimal? Spare4 { get; set; }

    public decimal? Spare5 { get; set; }

    public decimal? Spare6 { get; set; }
}
