export default function DashboardPagination({
  page,
  onChange,
}: {
  page: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center items-center gap-2 text-sm mt-5 text-gray-500">
      <button onClick={() => onChange(Math.max(1, page - 1))}>
        <svg
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.95898 0L19.9183 17.25H-0.000308037L9.95898 0Z"
            fill="#C7C7C7"
          />
        </svg>
      </button>
      <span>{page}</span>
      <button onClick={() => onChange(page + 1)}>
        <svg
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.95898 17.25L19.9183 0L-0.000308037 0L9.95898 17.25Z"
            fill="#C7C7C7"
          />
        </svg>
      </button>
    </div>
  );
}
