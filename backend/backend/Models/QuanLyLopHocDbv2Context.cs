using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public partial class QuanLyLopHocDbv2Context : DbContext
{
    public QuanLyLopHocDbv2Context()
    {
    }

    public QuanLyLopHocDbv2Context(DbContextOptions<QuanLyLopHocDbv2Context> options)
        : base(options)
    {
    }

    public virtual DbSet<CauHinhHeThong> CauHinhHeThongs { get; set; }

    public virtual DbSet<DeTai> DeTais { get; set; }

    public virtual DbSet<DiemSo> DiemSos { get; set; }

    public virtual DbSet<HocKy> HocKies { get; set; }

    public virtual DbSet<Khoa> Khoas { get; set; }

    public virtual DbSet<LichSuNhiemVu> LichSuNhiemVus { get; set; }

    public virtual DbSet<LopHoc> LopHocs { get; set; }

    public virtual DbSet<LopSinhVien> LopSinhViens { get; set; }

    public virtual DbSet<NguoiDung> NguoiDungs { get; set; }

    public virtual DbSet<NhiemVu> NhiemVus { get; set; }

    public virtual DbSet<Nhom> Nhoms { get; set; }

    public virtual DbSet<TepDinhKem> TepDinhKems { get; set; }

    public virtual DbSet<TinNhan> TinNhans { get; set; }

    public virtual DbSet<VaiTro> VaiTros { get; set; }

    public virtual DbSet<YeuCauChuyenNhom> YeuCauChuyenNhoms { get; set; }

    public virtual DbSet<YeuCauVaoNhom> YeuCauVaoNhoms { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=localhost;Database=QuanLyLopHocDBv2;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CauHinhHeThong>(entity =>
        {
            entity.HasKey(e => e.KhoaCauHinh).HasName("PK__CauHinhH__1D2125207328CF65");

            entity.ToTable("CauHinhHeThong");

            entity.Property(e => e.KhoaCauHinh)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MoTa).HasMaxLength(255);
        });

        modelBuilder.Entity<DeTai>(entity =>
        {
            entity.HasKey(e => e.MaDeTai).HasName("PK__DeTai__9F967D5BCC28F8CD");

            entity.ToTable("DeTai");

            entity.Property(e => e.NgayBatDau).HasColumnType("datetime");
            entity.Property(e => e.NgayKetThuc).HasColumnType("datetime");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PhuongThucGiao)
                .HasMaxLength(50)
                .HasDefaultValue("Đăng ký tự do");
            entity.Property(e => e.TenDeTai).HasMaxLength(255);

            entity.HasOne(d => d.MaLopNavigation).WithMany(p => p.DeTais)
                .HasForeignKey(d => d.MaLop)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DeTai__MaLop__5AEE82B9");
        });

        modelBuilder.Entity<DiemSo>(entity =>
        {
            entity.HasKey(e => e.MaDiem).HasName("PK__DiemSo__333260250E593075");

            entity.ToTable("DiemSo");

            entity.HasIndex(e => new { e.MaSinhVien, e.MaLop }, "UQ__DiemSo__B0236A53B5102F6E").IsUnique();

            entity.Property(e => e.DiemCaNhan).HasColumnType("decimal(4, 2)");
            entity.Property(e => e.DiemNhom).HasColumnType("decimal(4, 2)");
            entity.Property(e => e.NgayCham)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.MaGiangVienNavigation).WithMany(p => p.DiemSoMaGiangVienNavigations)
                .HasForeignKey(d => d.MaGiangVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DiemSo__MaGiangV__151B244E");

            entity.HasOne(d => d.MaLopNavigation).WithMany(p => p.DiemSos)
                .HasForeignKey(d => d.MaLop)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DiemSo__MaLop__14270015");

            entity.HasOne(d => d.MaNhomNavigation).WithMany(p => p.DiemSos)
                .HasForeignKey(d => d.MaNhom)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DiemSo__MaNhom__1332DBDC");

            entity.HasOne(d => d.MaSinhVienNavigation).WithMany(p => p.DiemSoMaSinhVienNavigations)
                .HasForeignKey(d => d.MaSinhVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DiemSo__MaSinhVi__123EB7A3");
        });

        modelBuilder.Entity<HocKy>(entity =>
        {
            entity.HasKey(e => e.MaHocKy).HasName("PK__HocKy__1EB551101D2BF1D0");

            entity.ToTable("HocKy");

            entity.Property(e => e.LaHienTai).HasDefaultValue(false);
            entity.Property(e => e.TenHocKy).HasMaxLength(50);
        });

        modelBuilder.Entity<Khoa>(entity =>
        {
            entity.HasKey(e => e.MaKhoa).HasName("PK__Khoa__65390405D39F7D61");

            entity.ToTable("Khoa");

            entity.HasIndex(e => e.KyHieuKhoa, "UQ__Khoa__936E2DCFC06A4D5B").IsUnique();

            entity.Property(e => e.KyHieuKhoa)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.TenKhoa).HasMaxLength(100);
        });

        modelBuilder.Entity<LichSuNhiemVu>(entity =>
        {
            entity.HasKey(e => e.MaLichSu).HasName("PK__LichSuNh__C443222A65F77FD9");

            entity.ToTable("LichSuNhiemVu");

            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TrangThaiMoi).HasMaxLength(50);

            entity.HasOne(d => d.MaNguoiCapNhatNavigation).WithMany(p => p.LichSuNhiemVus)
                .HasForeignKey(d => d.MaNguoiCapNhat)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LichSuNhi__MaNgu__01142BA1");

            entity.HasOne(d => d.MaNhiemVuNavigation).WithMany(p => p.LichSuNhiemVus)
                .HasForeignKey(d => d.MaNhiemVu)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LichSuNhi__MaNhi__00200768");
        });

        modelBuilder.Entity<LopHoc>(entity =>
        {
            entity.HasKey(e => e.MaLop).HasName("PK__LopHoc__3B98D273B0202EC5");

            entity.ToTable("LopHoc");

            entity.HasIndex(e => e.MaLopHoc, "UQ__LopHoc__FEE05785A530B4A9").IsUnique();

            entity.Property(e => e.ChoPhepDangKyNhom).HasDefaultValue(true);
            entity.Property(e => e.HanDangKyNhom).HasColumnType("datetime");
            entity.Property(e => e.MaLopHoc)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.TenLop).HasMaxLength(100);
            entity.Property(e => e.ThoiGianHoc).HasMaxLength(255);

            entity.HasOne(d => d.MaGiangVienNavigation).WithMany(p => p.LopHocs)
                .HasForeignKey(d => d.MaGiangVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LopHoc__MaGiangV__5165187F");

            entity.HasOne(d => d.MaHocKyNavigation).WithMany(p => p.LopHocs)
                .HasForeignKey(d => d.MaHocKy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LopHoc__MaHocKy__52593CB8");

            entity.HasMany(d => d.MaSinhViens).WithMany(p => p.MaLops)
                .UsingEntity<Dictionary<string, object>>(
                    "SinhVienLop",
                    r => r.HasOne<NguoiDung>().WithMany()
                        .HasForeignKey("MaSinhVien")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__SinhVienL__MaSin__5629CD9C"),
                    l => l.HasOne<LopHoc>().WithMany()
                        .HasForeignKey("MaLop")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__SinhVienL__MaLop__5535A963"),
                    j =>
                    {
                        j.HasKey("MaLop", "MaSinhVien").HasName("PK__SinhVien__72A17C040E2B77FC");
                        j.ToTable("SinhVienLop");
                    });
        });

        modelBuilder.Entity<LopSinhVien>(entity =>
        {
            entity.HasKey(e => e.MaLopSinhVien).HasName("PK__LopSinhV__6D3D5C7214DD61E5");

            entity.ToTable("LopSinhVien");

            entity.HasIndex(e => e.TenLopSinhVien, "UQ__LopSinhV__7878B886E20B37F5").IsUnique();

            entity.Property(e => e.MaLopSinhVien)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.DangHoatDong).HasDefaultValue(true);
            entity.Property(e => e.TenLopSinhVien)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.MaKhoaNavigation).WithMany(p => p.LopSinhViens)
                .HasForeignKey(d => d.MaKhoa)
                .HasConstraintName("FK__LopSinhVi__MaKho__3E52440B");
        });

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.MaNguoiDung).HasName("PK__NguoiDun__C539D76276019A84");

            entity.ToTable("NguoiDung");

            entity.HasIndex(e => e.MaSo, "UQ__NguoiDun__2725087C54C9CBE7").IsUnique();

            entity.HasIndex(e => e.TenDangNhap, "UQ__NguoiDun__55F68FC0F0E3DF0A").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__NguoiDun__A9D10534DB2C6F05").IsUnique();

            entity.Property(e => e.DangHoatDong).HasDefaultValue(true);
            entity.Property(e => e.DiaChi).HasMaxLength(255);
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.HoTen).HasMaxLength(100);
            entity.Property(e => e.LopSinhVien)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MaSo)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.MatKhauHash)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.TenDangNhap)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.MaKhoaNavigation).WithMany(p => p.NguoiDungs)
                .HasForeignKey(d => d.MaKhoa)
                .HasConstraintName("FK__NguoiDung__MaKho__4BAC3F29");

            entity.HasOne(d => d.MaVaiTroNavigation).WithMany(p => p.NguoiDungs)
                .HasForeignKey(d => d.MaVaiTro)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NguoiDung__MaVai__4AB81AF0");
        });

        modelBuilder.Entity<NhiemVu>(entity =>
        {
            entity.HasKey(e => e.MaNhiemVu).HasName("PK__NhiemVu__69582B2F5A244B8B");

            entity.ToTable("NhiemVu");

            entity.Property(e => e.HanHoanThanh).HasColumnType("datetime");
            entity.Property(e => e.MucDoUuTien).HasMaxLength(50);
            entity.Property(e => e.NgayBatDau).HasColumnType("datetime");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PhanTramHoanThanh).HasDefaultValue(0);
            entity.Property(e => e.TenNhiemVu).HasMaxLength(255);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(50)
                .HasDefaultValue("Chưa bắt đầu");

            entity.HasOne(d => d.MaDeTaiNavigation).WithMany(p => p.NhiemVus)
                .HasForeignKey(d => d.MaDeTai)
                .HasConstraintName("FK__NhiemVu__MaDeTai__787EE5A0");

            entity.HasOne(d => d.MaNhomNavigation).WithMany(p => p.NhiemVus)
                .HasForeignKey(d => d.MaNhom)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NhiemVu__MaNhom__778AC167");

            entity.HasMany(d => d.MaNguoiDungs).WithMany(p => p.MaNhiemVus)
                .UsingEntity<Dictionary<string, object>>(
                    "PhanCongNhiemVu",
                    r => r.HasOne<NguoiDung>().WithMany()
                        .HasForeignKey("MaNguoiDung")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__PhanCongN__MaNgu__7C4F7684"),
                    l => l.HasOne<NhiemVu>().WithMany()
                        .HasForeignKey("MaNhiemVu")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__PhanCongN__MaNhi__7B5B524B"),
                    j =>
                    {
                        j.HasKey("MaNhiemVu", "MaNguoiDung").HasName("PK__PhanCong__550BB659904F81C4");
                        j.ToTable("PhanCongNhiemVu");
                    });
        });

        modelBuilder.Entity<Nhom>(entity =>
        {
            entity.HasKey(e => e.MaNhom).HasName("PK__Nhom__234F91CD0887DEA5");

            entity.ToTable("Nhom");

            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SoThanhVienToiDa).HasDefaultValue(5);
            entity.Property(e => e.TenNhom).HasMaxLength(100);

            entity.HasOne(d => d.MaDeTaiNavigation).WithMany(p => p.Nhoms)
                .HasForeignKey(d => d.MaDeTai)
                .HasConstraintName("FK__Nhom__MaDeTai__619B8048");

            entity.HasOne(d => d.MaLopNavigation).WithMany(p => p.Nhoms)
                .HasForeignKey(d => d.MaLop)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Nhom__MaLop__5FB337D6");

            entity.HasOne(d => d.MaNhomTruongNavigation).WithMany(p => p.Nhoms)
                .HasForeignKey(d => d.MaNhomTruong)
                .HasConstraintName("FK__Nhom__MaNhomTruo__60A75C0F");

            entity.HasMany(d => d.MaSinhViens).WithMany(p => p.MaNhoms)
                .UsingEntity<Dictionary<string, object>>(
                    "ThanhVienNhom",
                    r => r.HasOne<NguoiDung>().WithMany()
                        .HasForeignKey("MaSinhVien")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__ThanhVien__MaSin__656C112C"),
                    l => l.HasOne<Nhom>().WithMany()
                        .HasForeignKey("MaNhom")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__ThanhVien__MaNho__6477ECF3"),
                    j =>
                    {
                        j.HasKey("MaNhom", "MaSinhVien").HasName("PK__ThanhVie__6A763FBA854DD13E");
                        j.ToTable("ThanhVienNhom");
                    });
        });

        modelBuilder.Entity<TepDinhKem>(entity =>
        {
            entity.HasKey(e => e.MaTep).HasName("PK__TepDinhK__314EA1A824DF65FE");

            entity.ToTable("TepDinhKem");

            entity.Property(e => e.NgayUpload)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TenTep).HasMaxLength(255);

            entity.HasOne(d => d.MaDeTaiNavigation).WithMany(p => p.TepDinhKems)
                .HasForeignKey(d => d.MaDeTai)
                .HasConstraintName("FK__TepDinhKe__MaDeT__0C85DE4D");

            entity.HasOne(d => d.MaNguoiUploadNavigation).WithMany(p => p.TepDinhKems)
                .HasForeignKey(d => d.MaNguoiUpload)
                .HasConstraintName("FK__TepDinhKe__MaNgu__0D7A0286");

            entity.HasOne(d => d.MaNhiemVuNavigation).WithMany(p => p.TepDinhKems)
                .HasForeignKey(d => d.MaNhiemVu)
                .HasConstraintName("FK__TepDinhKe__MaNhi__0B91BA14");

            entity.HasOne(d => d.MaTinNhanNavigation).WithMany(p => p.TepDinhKems)
                .HasForeignKey(d => d.MaTinNhan)
                .HasConstraintName("FK__TepDinhKe__MaTin__0A9D95DB");
        });

        modelBuilder.Entity<TinNhan>(entity =>
        {
            entity.HasKey(e => e.MaTinNhan).HasName("PK__TinNhan__E5B3062A062A044A");

            entity.ToTable("TinNhan");

            entity.Property(e => e.ThoiGianGui)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.MaNguoiGuiNavigation).WithMany(p => p.TinNhans)
                .HasForeignKey(d => d.MaNguoiGui)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TinNhan__MaNguoi__05D8E0BE");

            entity.HasOne(d => d.MaNhomNavigation).WithMany(p => p.TinNhans)
                .HasForeignKey(d => d.MaNhom)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TinNhan__MaNhom__04E4BC85");

            entity.HasOne(d => d.MaTinNhanChaNavigation).WithMany(p => p.InverseMaTinNhanChaNavigation)
                .HasForeignKey(d => d.MaTinNhanCha)
                .HasConstraintName("FK__TinNhan__MaTinNh__06CD04F7");
        });

        modelBuilder.Entity<VaiTro>(entity =>
        {
            entity.HasKey(e => e.MaVaiTro).HasName("PK__VaiTro__C24C41CFC44398C1");

            entity.ToTable("VaiTro");

            entity.Property(e => e.TenVaiTro).HasMaxLength(50);
        });

        modelBuilder.Entity<YeuCauChuyenNhom>(entity =>
        {
            entity.HasKey(e => e.MaYeuCau).HasName("PK__YeuCauCh__CFA5DF4E695F5E90");

            entity.ToTable("YeuCauChuyenNhom");

            entity.Property(e => e.NgayGui)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayXuLy).HasColumnType("datetime");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(50)
                .HasDefaultValue("Chờ duyệt");

            entity.HasOne(d => d.MaNhomHienTaiNavigation).WithMany(p => p.YeuCauChuyenNhomMaNhomHienTaiNavigations)
                .HasForeignKey(d => d.MaNhomHienTai)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__YeuCauChu__MaNho__6B24EA82");

            entity.HasOne(d => d.MaNhomMuonNavigation).WithMany(p => p.YeuCauChuyenNhomMaNhomMuonNavigations)
                .HasForeignKey(d => d.MaNhomMuon)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__YeuCauChu__MaNho__6C190EBB");

            entity.HasOne(d => d.MaSinhVienNavigation).WithMany(p => p.YeuCauChuyenNhoms)
                .HasForeignKey(d => d.MaSinhVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__YeuCauChu__MaSin__6A30C649");
        });

        modelBuilder.Entity<YeuCauVaoNhom>(entity =>
        {
            entity.HasKey(e => e.MaYeuCau).HasName("PK__YeuCauVa__CFA5DF4E649D5F7E");

            entity.ToTable("YeuCauVaoNhom");

            entity.Property(e => e.NgayGui)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayXuLy).HasColumnType("datetime");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(50)
                .HasDefaultValue("Chờ duyệt");

            entity.HasOne(d => d.MaNhomNavigation).WithMany(p => p.YeuCauVaoNhoms)
                .HasForeignKey(d => d.MaNhom)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__YeuCauVao__MaNho__71D1E811");

            entity.HasOne(d => d.MaSinhVienNavigation).WithMany(p => p.YeuCauVaoNhoms)
                .HasForeignKey(d => d.MaSinhVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__YeuCauVao__MaSin__70DDC3D8");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
