import React from 'react';

export const SectionHeader = ({ title, count, actionText, onAction }) => {

  return (
    <div className="flex items-baseline justify-between mb-2">
      <div className="flex items-baseline gap-3">
        <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-300 dark:text-neutral-400">
          // {title}
        </h2>
        {count !== undefined && count !== null && (
          <span className="text-xs font-mono text-neutral-500">
            [{count}]
          </span>
        )}
      </div>
      
      {actionText && onAction && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onAction();
          }}
          className={`text-xs text-neutral-500 hover:text-white cursor-pointer underline transition-colors bg-transparent border-none p-0`}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
