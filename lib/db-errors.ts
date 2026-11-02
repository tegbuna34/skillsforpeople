/** PostgREST / Postgres signals that a migration has not been applied yet. */

export function isMissingColumn(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const message = (error.message || "").toLowerCase();
  return (
    error.code === "42703" ||
    error.code === "PGRST204" ||
    (message.includes("column") && message.includes("does not exist")) ||
    message.includes("schema cache")
  );
}

export function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const message = (error.message || "").toLowerCase();
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    message.includes("does not exist") ||
    message.includes("could not find the table")
  );
}

export function isUniqueViolation(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === "23505" || (error.message || "").toLowerCase().includes("duplicate");
}
