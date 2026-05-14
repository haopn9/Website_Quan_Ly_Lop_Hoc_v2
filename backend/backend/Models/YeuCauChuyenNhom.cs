using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class YeuCauChuyenNhom
{
    public int MaYeuCau { get; set; }

    public int MaSinhVien { get; set; }

    public int MaNhomHienTai { get; set; }

    public int MaNhomMuon { get; set; }

    public string? LyDo { get; set; }

    public string? TrangThai { get; set; }

    public string? GhiChuGiangVien { get; set; }

    public DateTime? NgayGui { get; set; }

    public DateTime? NgayXuLy { get; set; }

    public virtual Nhom MaNhomHienTaiNavigation { get; set; } = null!;

    public virtual Nhom MaNhomMuonNavigation { get; set; } = null!;

    public virtual NguoiDung MaSinhVienNavigation { get; set; } = null!;
}
