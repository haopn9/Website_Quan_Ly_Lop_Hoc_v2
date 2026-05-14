using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class CauHinhHeThong
{
    public string KhoaCauHinh { get; set; } = null!;

    public string GiaTriCauHinh { get; set; } = null!;

    public string? MoTa { get; set; }
}
