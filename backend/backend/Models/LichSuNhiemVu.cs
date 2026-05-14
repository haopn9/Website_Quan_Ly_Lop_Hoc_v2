using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class LichSuNhiemVu
{
    public int MaLichSu { get; set; }

    public int MaNhiemVu { get; set; }

    public int MaNguoiCapNhat { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public string? TrangThaiMoi { get; set; }

    public int? PhanTramMoi { get; set; }

    public string? GhiChu { get; set; }

    public virtual NguoiDung MaNguoiCapNhatNavigation { get; set; } = null!;

    public virtual NhiemVu MaNhiemVuNavigation { get; set; } = null!;
}
