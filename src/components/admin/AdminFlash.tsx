export function AdminFlash({
  type,
  children,
}: {
  type: "error" | "success";
  children: React.ReactNode;
}) {
  const styles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-emerald-200 bg-emerald-50 text-emerald-800";
  return (
    <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${styles}`} role="status">
      {children}
    </div>
  );
}
