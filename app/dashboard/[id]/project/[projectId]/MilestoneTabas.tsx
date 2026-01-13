import { getTasksByMilestone } from "@/app/actions/tasks/getTasksByMilestone";
import { taskKeys } from "@/hooks/useTasksByMilestone";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface Milestone {
  id: string;
  title: string;
  status: string;
}

interface Props {
  milestones: Milestone[];
  activeMilestoneId: string | null;
  onChange: (milestone: Milestone) => void;
  onTitleClick?: (milestone: Milestone) => void;
}

export function MilestoneTabs({
  milestones,
  activeMilestoneId,
  onChange,
  onTitleClick,
}: Props) {
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showArrows, setShowArrows] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const hasOverflow = scrollWidth > clientWidth;

      // Only show arrows if there's actual overflow
      if (hasOverflow) {
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      } else {
        setShowLeftArrow(false);
        setShowRightArrow(false);
      }
    }
  };

  const resetHideTimer = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setShowArrows(true);

    if (!isHovered) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowArrows(false);
      }, 3000);
    }
  };

  useEffect(() => {
    checkScroll();
    resetHideTimer();

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      };
    }
  }, [milestones]);

  useEffect(() => {
    if (isHovered) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      setShowArrows(true);
    } else {
      resetHideTimer();
    }
  }, [isHovered]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="relative flex items-center w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left Arrow */}
      {showLeftArrow && showArrows && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 bg-white dark:bg-neutral-800 shadow-md rounded-full p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all duration-300 opacity-0 animate-in fade-in"
          style={{ opacity: showArrows ? 1 : 0 }}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {milestones.map((m, ind) => {
          const active = m.id === activeMilestoneId;

          return (
            <div
              key={m.id}
              className={`rounded-sm text-sm font-medium cursor-pointer flex transition-colors shrink-0 ${
                active
                  ? "bg-[#63A053] hover:bg-[#528a45] text-white"
                  : "bg-[#A2CF96] text-gray-800 dark:text-gray-200"
              }`}
              onMouseEnter={() => {
                queryClient.prefetchQuery({
                  queryKey: taskKeys.byMilestone(m.id),
                  queryFn: async () => {
                    const res = await getTasksByMilestone(m.id);
                    if (!res.success) throw new Error(res.message);
                    return res.data;
                  },
                });
              }}
            >
              <span
                onClick={() => onChange(m)}
                className="bg-[#A2CF96] px-3 rounded-l-sm py-1.75 text-white cursor-pointer"
              >
                {ind + 1}.
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTitleClick) {
                    onTitleClick(m);
                  } else {
                    onChange(m);
                  }
                }}
                className="px-2.5 py-1.75 text-white capitalize cursor-pointer text-[0.875rem] whitespace-nowrap"
              >
                {m.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Right Arrow */}
      {showRightArrow && showArrows && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 bg-white dark:bg-neutral-800 shadow-md rounded-full p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all duration-300 opacity-0 animate-in fade-in"
          style={{ opacity: showArrows ? 1 : 0 }}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      )}
    </div>
  );
}
