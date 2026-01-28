export function formatCpf(value?: string | number | null): string {
  if (value === null || value === undefined) return "—";

  const raw = String(value);
  const digits = raw.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) return "—";
  if (digits.length !== 11) return digits;

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}