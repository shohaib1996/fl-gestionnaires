export default function DashboardPagination({
  page,
  onChange,
}: {
  page: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center items-center gap-2 text-sm mt-5 text-gray-500">
      <button onClick={() => onChange(Math.max(1, page - 1))}>◀</button>
      <span>{page}</span>
      <button onClick={() => onChange(page + 1)}>▶</button>
    </div>
  );
}
