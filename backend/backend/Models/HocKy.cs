using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class HocKy
{
    public int MaHocKy { get; set; }

    public string TenHocKy { get; set; } = null!;

    public DateOnly? NgayBatDau { get; set; }

    public DateOnly? NgayKetThuc { get; set; }

    public bool? LaHienTai { get; set; }

    public virtual ICollection<LopHoc> LopHocs { get; set; } = new List<LopHoc>();
}
