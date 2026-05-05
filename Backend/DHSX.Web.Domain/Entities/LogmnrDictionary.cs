using System;
using System.Collections.Generic;

namespace DHSX.Web.Domain.Entities;

public partial class LogmnrDictionary
{
    public string? DbName { get; set; }

    public decimal? DbId { get; set; }

    public string? DbCreated { get; set; }

    public string? DbDictCreated { get; set; }

    public decimal? DbDictScn { get; set; }

    public byte[]? DbThreadMap { get; set; }

    public decimal? DbTxnScnbas { get; set; }

    public decimal? DbTxnScnwrp { get; set; }

    public decimal? DbResetlogsChange { get; set; }

    public string? DbResetlogsTime { get; set; }

    public string? DbVersionTime { get; set; }

    public string? DbRedoTypeId { get; set; }

    public string? DbRedoRelease { get; set; }

    public string? DbCharacterSet { get; set; }

    public string? DbVersion { get; set; }

    public string? DbStatus { get; set; }

    public string? DbGlobalName { get; set; }

    public decimal? DbDictMaxobjects { get; set; }

    public decimal DbDictObjectcount { get; set; }

    public decimal? LogmnrUid { get; set; }

    public decimal? LogmnrFlags { get; set; }

    public string? PdbName { get; set; }

    public decimal? PdbId { get; set; }

    public decimal? PdbUid { get; set; }

    public decimal? PdbDbid { get; set; }

    public Guid? PdbGuid { get; set; }

    public decimal? PdbCreateScn { get; set; }

    public decimal? PdbCount { get; set; }

    public string? PdbGlobalName { get; set; }

    public decimal? FedRootConId { get; set; }
}
