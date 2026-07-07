import { RAGStatus } from "@/data/doData";
import { cn } from "@/lib/utils";

const ragConfig: Record<RAGStatus, { label: string; classes: string; dot: string }> = {
  GREEN: {
    label: "GREEN",
    classes: "bg-green-50 text-green-800 border border-green-200",
    dot: "bg-green-500",
  },
  AMBER: {
    label: "AMBER",
    classes: "bg-amber-50 text-amber-800 border border-amber-200",
    dot: "bg-amber-500",
  },
  RED: {
    label: "RED",
    classes: "bg-red-50 text-red-800 border border-red-200",
    dot: "bg-red-500",
  },
  COMPLETE: {
    label: "COMPLETE",
    classes: "bg-blue-50 text-blue-800 border border-blue-200",
    dot: "bg-blue-500",
  },
  NOT_STARTED: {
    label: "NOT STARTED",
    classes: "bg-gray-50 text-gray-600 border border-gray-200",
    dot: "bg-gray-400",
  },
};

interface RAGBadgeProps {
  status: RAGStatus;
  size?: "sm" | "md";
}

export function RAGBadge({ status, size = "md" }: RAGBadgeProps) {
  const config = ragConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs",
        config.classes
      )}
    >
      <span className={cn("rounded-full flex-shrink-0", size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2", config.dot)} />
      {config.label}
    </span>
  );
}
