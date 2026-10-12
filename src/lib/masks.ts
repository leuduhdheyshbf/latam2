/**
 * Utilitários de máscara e formatação para o formulário da LATAM 友
 */

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";

  if (digits.length <= 2) {
    return `(${digits}`;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function maskPlayerId(value: string): string {
  return value.replace(/\D/g, "").slice(0, 12);
}

export function formatWhatsAppUrl(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, "");
  // Se não tiver código do país, assume Brasil (55)
  const fullPhone = digits.length <= 11 ? `55${digits}` : digits;
  return `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(text)}`;
}
