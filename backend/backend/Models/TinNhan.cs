using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class TinNhan
{
    public int MaTinNhan { get; set; }

    public int MaNhom { get; set; }

    public int MaNguoiGui { get; set; }

    public string NoiDung { get; set; } = null!;

    public DateTime? ThoiGianGui { get; set; }

    public int? MaTinNhanCha { get; set; }

    public virtual ICollection<TinNhan> InverseMaTinNhanChaNavigation { get; set; } = new List<TinNhan>();

    public virtual NguoiDung MaNguoiGuiNavigation { get; set; } = null!;

    public virtual Nhom MaNhomNavigation { get; set; } = null!;

    public virtual TinNhan? MaTinNhanChaNavigation { get; set; }

    public virtual ICollection<TepDinhKem> TepDinhKems { get; set; } = new List<TepDinhKem>();
}
