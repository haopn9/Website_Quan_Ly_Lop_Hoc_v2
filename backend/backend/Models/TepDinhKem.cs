using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class TepDinhKem
{
    public int MaTep { get; set; }

    public int? MaTinNhan { get; set; }

    public int? MaNhiemVu { get; set; }

    public int? MaDeTai { get; set; }

    public string TenTep { get; set; } = null!;

    public string DuongDanTep { get; set; } = null!;

    public int? DungLuong { get; set; }

    public int? MaNguoiUpload { get; set; }

    public DateTime? NgayUpload { get; set; }

    public virtual DeTai? MaDeTaiNavigation { get; set; }

    public virtual NguoiDung? MaNguoiUploadNavigation { get; set; }

    public virtual NhiemVu? MaNhiemVuNavigation { get; set; }

    public virtual TinNhan? MaTinNhanNavigation { get; set; }
}
