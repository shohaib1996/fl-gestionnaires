export default function RightSidebar() {
  return (
    <aside className="hidden xl:flex w-[250px] bg-white dark:bg-neutral-800 p-4 shadow-sm flex-col overflow-auto mt-17 rounded-lg">
      <h3 className="text-sm font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Aperçu des projets
      </h3>
      <ul className="space-y-4 text-sm">
        {[
          { label: "projets reçus", value: 105 },
          { label: "Projets retenus", value: 11 },
          { label: "Projets en cours", value: 6 },
          { label: "Projets lancés", value: 5 },
        ].map(({ label, value }, i) => (
          <li key={i} className="flex flex-col">
            <span>
              <span className="font-semibold">{value}</span> {label}
            </span>
            <a href="#" className="text-blue-600 hover:underline text-sm">
              Cette semaine
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
