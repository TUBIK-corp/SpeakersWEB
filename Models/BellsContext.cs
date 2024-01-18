using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SpeakersWEB.Models;

public partial class BellsContext : DbContext
{
    public BellsContext()
    {
        Database.EnsureCreated();
    }

    public BellsContext(DbContextOptions<BellsContext> options)
        : base(options)
    {

    }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserToken> UserTokens { get; set; }

    public virtual DbSet<Bell> Bells { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=Bells;Trusted_Connection=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Users");
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.Login)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("login")
                .IsRequired();
            entity.Property(e => e.Password)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("password")
                .IsRequired();
        });

        modelBuilder.Entity<UserToken>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_UserToken");
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.ToTable("UserToken");
            entity.Property(e => e.Token)
                .HasMaxLength(1000)
                .IsFixedLength()
                .IsRequired();
        });

        modelBuilder.Entity<Bell>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Bells");
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Info).IsRequired();
            entity.Property(e => e.Time).IsRequired();
            entity.Property(e => e.AudioFilePath).IsRequired();
            entity.Property(e => e.Duration).IsRequired();
            entity.Property(e => e.UploaderName).IsRequired();
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
