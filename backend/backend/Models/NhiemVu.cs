using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class NhiemVu
{
    public int MaNhiemVu { get; set; }

    public int MaNhom { get; set; }

    public int? MaDeTai { get; set; }

    public string TenNhiemVu { get; set; } = null!;

    public string? MoTa { get; set; }

    public DateTime? NgayBatDau { get; set; }

    public DateTime? HanHoanThanh { get; set; }

    public string? MucDoUuTien { get; set; }

    public string? TrangThai { get; set; }

    public int? PhanTramHoanThanh { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual ICollection<LichSuNhiemVu> LichSuNhiemVus { get; set; } = new List<LichSuNhiemVu>();

    public virtual DeTai? MaDeTaiNavigation { get; set; }

    public virtual Nhom MaNhomNavigation { get; set; } = null!;

    public virtual ICollection<TepDinhKem> TepDinhKems { get; set; } = new List<TepDinhKem>();

    public virtual ICollection<NguoiDung> MaNguoiDungs { get; set; } = new List<NguoiDung>();
}
