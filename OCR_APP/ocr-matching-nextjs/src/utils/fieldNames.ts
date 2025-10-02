// Field name mapping for Vietnamese display
export const fieldNameMap: Record<string, string> = {
  ho_ten: 'Họ tên',
  cccd: 'Số CCCD',
  dia_chi_mua: 'Địa chỉ người mua',
  dia_chi_ban: 'Địa chỉ người bán',
  so_thua: 'Số thửa (Thửa đất số)',
  to_ban_do: 'Tờ bản đồ',
  dien_tich: 'Diện tích',
  loai_dat: 'Loại đất',
  tai_san_gan_voi_dat: 'Tài sản gắn liền với đất'
};

export const getFieldDisplayName = (fieldName: string): string => {
  return fieldNameMap[fieldName] || fieldName.replace('_', ' ');
};