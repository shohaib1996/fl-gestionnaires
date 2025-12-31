export default function DashboardPagination({
  page,
  onChange,
  total,
}: {
  page: number;
  onChange: (page: number) => void;
  total: number;
}) {
  return (
    <div className="flex justify-center items-center gap-2.5 text-sm mt-5 text-gray-500">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        <svg
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.95898 0L19.9183 17.25H-0.000308037L9.95898 0Z"
            className={page === 1 ? "fill-[#C7C7C7]" : "fill-gray-700"}
          />
        </svg>
      </button>
      <span className="font-sans text-xs font-medium text-[#5D5959]">
        {page}-{total}
      </span>
      <button onClick={() => onChange(page + 1)} disabled={page === total}>
        <svg
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.95898 17.25L19.9183 0L-0.000308037 0L9.95898 17.25Z"
            className={page === total ? "fill-[#C7C7C7]" : "fill-gray-700"}
          />
        </svg>
      </button>
    </div>
  );
}
