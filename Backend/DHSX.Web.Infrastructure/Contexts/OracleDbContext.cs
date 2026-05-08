using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using DHSX.Web.Application.Interfaces;

namespace DHSX.Web.Domain.Entities;

public partial class OracleDbContext : DbContext, IOracleDbContext
{
    public OracleDbContext()
    {
    }

    public OracleDbContext(DbContextOptions<OracleDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Department> Departments { get; set; }
    public virtual DbSet<Report> Reports { get; set; }
    public virtual DbSet<ReportAssignment> ReportAssignments { get; set; }
    public virtual DbSet<ReportFinalFile> ReportFinalFiles { get; set; }
    public virtual DbSet<ReportTimeline> ReportTimelines { get; set; }
    public virtual DbSet<ReportVersion> ReportVersions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("USING_NLS_COMP");

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.DeptId).HasName("SYS_C008223");
            entity.ToTable("DEPARTMENTS", "BAOCAO");
            entity.HasIndex(e => e.DeptCode, "SYS_C008224").IsUnique();

            entity.Property(e => e.DeptId)
                .ValueGeneratedOnAdd()
                .HasColumnType("NUMBER")
                .HasColumnName("DEPT_ID");
            entity.Property(e => e.DeptCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("DEPT_CODE");
            entity.Property(e => e.DeptName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DEPT_NAME");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("DESCRIPTION");
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("SYS_C008231");
            entity.ToTable("REPORTS", "BAOCAO");
            entity.HasIndex(e => e.ReportCode, "SYS_C008232").IsUnique();

            entity.Property(e => e.ReportId)
                .ValueGeneratedOnAdd()
                .HasColumnType("NUMBER")
                .HasColumnName("REPORT_ID");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(6)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("CREATED_AT");
            entity.Property(e => e.CreatedBy)
                .HasColumnType("NUMBER")
                .HasColumnName("CREATED_BY");
            entity.Property(e => e.Deadline)
                .HasPrecision(6)
                .HasColumnName("DEADLINE");
            entity.Property(e => e.FinalFilePath)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("FINAL_FILE_PATH");
            entity.Property(e => e.GlobalStatus)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValueSql("'Vừa khởi tạo'")
                .HasColumnName("GLOBAL_STATUS");
            entity.Property(e => e.ReportCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("REPORT_CODE");
            entity.Property(e => e.ReportName)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("REPORT_NAME");
            entity.Property(e => e.ReportType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("REPORT_TYPE");
        });

        modelBuilder.Entity<ReportAssignment>(entity =>
        {
            entity.HasKey(e => e.AssignmentId).HasName("SYS_C008236");
            entity.ToTable("REPORT_ASSIGNMENTS", "BAOCAO");
            entity.HasIndex(e => new { e.ReportId, e.DeptId }, "UQ_REPORT_DEPT").IsUnique();

            entity.Property(e => e.AssignmentId)
                .ValueGeneratedOnAdd()
                .HasColumnType("NUMBER")
                .HasColumnName("ASSIGNMENT_ID");
            entity.Property(e => e.AssignStatus)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValueSql("'Chưa cập nhật'")
                .HasColumnName("ASSIGN_STATUS");
            entity.Property(e => e.ConfirmedAt)
                .HasPrecision(6)
                .HasColumnName("CONFIRMED_AT");
            entity.Property(e => e.ConfirmedBy)
                .HasColumnType("NUMBER")
                .HasColumnName("CONFIRMED_BY");
            entity.Property(e => e.DeptId)
                .HasColumnType("NUMBER")
                .HasColumnName("DEPT_ID");
                
            // ĐÃ SỬA: Ép kiểu cứng về số nguyên cho Oracle
            entity.Property(e => e.IsLocked)
                .HasDefaultValueSql("0")
                .HasColumnType("NUMBER(1)")
                .HasConversion<int?>() // Ép dứt điểm True=1, False=0
                .HasColumnName("IS_LOCKED");
                
            entity.Property(e => e.ReportId)
                .HasColumnType("NUMBER")
                .HasColumnName("REPORT_ID");

            entity.HasOne(d => d.Dept).WithMany(p => p.ReportAssignments)
                .HasForeignKey(d => d.DeptId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ASSIGN_DEPT");

            entity.HasOne(d => d.Report).WithMany(p => p.ReportAssignments)
                .HasForeignKey(d => d.ReportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ASSIGN_REPORT");
        });

        modelBuilder.Entity<ReportFinalFile>(entity =>
        {
            entity.HasKey(e => e.FileId).HasName("SYS_C008242");
            entity.ToTable("REPORT_FINAL_FILES", "BAOCAO");

            entity.Property(e => e.FileId)
                .ValueGeneratedOnAdd()
                .HasColumnType("NUMBER")
                .HasColumnName("FILE_ID");
            entity.Property(e => e.FileName)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("FILE_NAME");
            entity.Property(e => e.FilePath)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("FILE_PATH");
            entity.Property(e => e.ReportId)
                .HasColumnType("NUMBER")
                .HasColumnName("REPORT_ID");
            entity.Property(e => e.UploadedAt)
                .HasPrecision(6)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("UPLOADED_AT");

            entity.HasOne(d => d.Report).WithMany(p => p.ReportFinalFiles)
                .HasForeignKey(d => d.ReportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FINAL_REPORT");
        });

        modelBuilder.Entity<ReportTimeline>(entity =>
        {
            entity.HasKey(e => e.TimelineId).HasName("SYS_C008248");
            entity.ToTable("REPORT_TIMELINE", "BAOCAO");

            entity.Property(e => e.TimelineId)
                .ValueGeneratedOnAdd()
                .HasColumnType("NUMBER")
                .HasColumnName("TIMELINE_ID");
            entity.Property(e => e.ActionDetail)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("ACTION_DETAIL");
            entity.Property(e => e.ActionTime)
                .HasPrecision(6)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("ACTION_TIME");
            entity.Property(e => e.ActionType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ACTION_TYPE");
            entity.Property(e => e.DeptId)
                .HasColumnType("NUMBER")
                .HasColumnName("DEPT_ID");
            entity.Property(e => e.ReportId)
                .HasColumnType("NUMBER")
                .HasColumnName("REPORT_ID");
            entity.Property(e => e.UserDeptName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("USER_DEPT_NAME");
            entity.Property(e => e.UserFullname)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("USER_FULLNAME");
            entity.Property(e => e.UserId)
                .HasColumnType("NUMBER")
                .HasColumnName("USER_ID");
            entity.Property(e => e.UserPosition)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("USER_POSITION");

            entity.HasOne(d => d.Dept).WithMany(p => p.ReportTimelines)
                .HasForeignKey(d => d.DeptId)
                .HasConstraintName("FK_TIMELINE_DEPT");

            entity.HasOne(d => d.Report).WithMany(p => p.ReportTimelines)
                .HasForeignKey(d => d.ReportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TIMELINE_REPORT");
        });

        modelBuilder.Entity<ReportVersion>(entity =>
        {
            entity.HasKey(e => e.VersionId).HasName("SYS_C008257");
            entity.ToTable("REPORT_VERSIONS", "BAOCAO");

            entity.Property(e => e.VersionId)
                .ValueGeneratedOnAdd()
                .HasColumnType("NUMBER")
                .HasColumnName("VERSION_ID");
            entity.Property(e => e.AssignmentId)
                .HasColumnType("NUMBER")
                .HasColumnName("ASSIGNMENT_ID");
            entity.Property(e => e.FileName)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("FILE_NAME");
            entity.Property(e => e.FilePath)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("FILE_PATH");
                
            // ĐÃ SỬA: Đề phòng lỗi tương tự khi Ban chốt file
            entity.Property(e => e.IsSelected)
                .HasDefaultValueSql("0")
                .HasColumnType("NUMBER(1)")
                .HasConversion<int?>() // Thêm cái này để tránh lỗi khi duyệt file
                .HasColumnName("IS_SELECTED");
                
            entity.Property(e => e.Note)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("NOTE");
            entity.Property(e => e.UploadedAt)
                .HasPrecision(6)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("UPLOADED_AT");
            entity.Property(e => e.UploadedBy)
                .HasColumnType("NUMBER")
                .HasColumnName("UPLOADED_BY");
            entity.Property(e => e.VersionNumber)
                .HasColumnType("NUMBER")
                .HasColumnName("VERSION_NUMBER");

            entity.HasOne(d => d.Assignment).WithMany(p => p.ReportVersions)
                .HasForeignKey(d => d.AssignmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_VERSIONS_ASSIGN");
        });
        modelBuilder.HasSequence("ISEQ$$_75866", "BAOCAO");

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}