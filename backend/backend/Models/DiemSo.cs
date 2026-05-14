using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class DiemSo
{
    public int MaDiem { get; set; }

    public int MaSinhVien { get; set; }

    public int MaNhom { get; set; }

    public int MaLop { get; set; }

    public decimal? DiemNhom { get; set; }

    public decimal? DiemCaNhan { get; set; }

    public string? NhanXet { get; set; }

    public int MaGiangVien { get; set; }

    public DateTime? NgayCham { get; set; }

    public virtual NguoiDung MaGiangVienNavigation { get; set; } = null!;

    public virtual LopHoc MaLopNavigation { get; set; } = null!;

    public virtual Nhom MaNhomNavigation { get; set; } = null!;

    public virtual NguoiDung MaSinhVienNavigation { get; set; } = null!;
}
