'use strict';

var obsidian = require('obsidian');

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "\n/* ========== CSS Variables ========== */\n:root {\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", sans-serif;\n  --pill-bg: #f1f3f5;\n  --pill-text: #4b5563;\n  --selected-bg: #f6f9ff;\n  --selected-border: #b4cef5;\n  --deadline-bg: #d8d5ff;\n  --deadline-text: #6b21a8;\n  --meta-text: #6b7280;\n  \n  /* Enhanced animation variables for native feel */\n  --transition-fast: 100ms cubic-bezier(0.3, 0.7, 0.4, 1);\n  --transition-medium: 280ms cubic-bezier(0.33, 1, 0.68, 1);\n  --transition-smooth: 420ms cubic-bezier(0.25, 0.8, 0.25, 1);\n  --transition-spring: 300ms cubic-bezier(0.3, 1, 0.5, 1);\n  \n  --shadow-light: 0 1px 3px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);\n  --shadow-medium: 0 2px 8px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05);\n  --shadow-heavy: 0 4px 16px rgba(0, 0, 0, 0.15);\n  --shadow-interactive: 0 1px 2px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.08);\n}\n\n.html {\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n/* ========== MODULE: Layout & Container ========== */\n.todoist-board {\n  position: relative;\n  inset: 0;\n  margin: 0 0.125rem;\n  max-width: unset;\n  overflow-y: scroll;\n  touch-action: pan-y;\n  -webkit-overflow-scrolling: touch;\n  background: transparent;\n  padding: 0;\n  border: none;\n  box-shadow: none;\n  overflow: visible;\n  isolation: unset;\n  z-index: 1000;\n  /* Hardware acceleration */\n  will-change: scroll-position;\n  transform: translate3d(0, 0, 0);\n}\n\n.list-view {\n  display: block;\n  max-width: 768px;\n  min-height: auto;\n  margin: 0 auto;\n  padding: 0.5rem 1rem;\n  font-size: 0.9rem; \n  line-height: 1.5; \n  position: relative; \n  opacity: 1;\n  touch-action: pan-y;\n}\n\n.list-wrapper {\n  display: block;\n  touch-action: pan-y;\n}\n\n/* ========== Enhanced Toolbar Styles ========== */\n/* ========== MODULE: Toolbar & Chin ========== */\n.list-toolbar {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-between;\n  position: sticky;\n  z-index: 1000;\n  padding: 0px 8px 0px 8px;\n  margin: 0 auto;\n  border-radius: 16px;\n  /* Inset effect for toolbar */\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05),\n              inset 0 -1px 2px rgba(0, 0, 0, 0.04);\n  /* background-color: #f9fafb; */\n  transition: background-color 0.2s ease;\n  /* Remove background and shadow by default */\n  /* backdrop-filter: blur(20px) saturate(1.2); */\n  border: 1px solid rgba(255, 255, 255, 0.3);\n  font-size: 0.85rem;\n  overflow-x: auto;\n  overflow-y: hidden;\n  min-width: min-content;\n  flex-wrap: nowrap;\n  touch-action: pan-y;\n  transform: translate3d(0, 0, 0);\n  animation: fade-in-up var(--transition-medium) ease-out both;\n  /* Added for dropdown/menu support */\n  overflow: visible;\n  position: relative;\n  z-index: 1010;\n}\n\n.list-toolbar.sticky {\n  background-color: #1e1e1e;\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05),\n              inset 0 -1px 2px rgba(0, 0, 0, 0.04),\n              0 1px 4px rgba(0, 0, 0, 0.15);\n}\n\n/* ========== MODULE: Filter Bar ========== */\n.filter-button-wrapper {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 48px;\n}\n\n/* Enhanced filter-btn style for native feel */\n.filter-btn {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  font-size: 11px;\n  color: var(--text-muted);\n  gap: 4px;\n  cursor: pointer;\n  position: relative;\n  padding: 6px;\n  border-radius: 12px;\n  transition: all var(--transition-fast);\n  transform: translate3d(0, 0, 0);\n}\n\n.filter-btn .icon {\n  font-size: 20px;\n  line-height: 1;\n  transition: transform var(--transition-fast);\n}\n\n.filter-btn .label {\n  pointer-events: none;\n  font-weight: 500;\n  opacity: 0.8;\n}\n\n.filter-btn:hover {\n  background: rgba(0, 0, 0, 0.04);\n  transform: scale(1.02) translate3d(0, 0, 0);\n}\n\n.filter-btn:hover .icon {\n  transform: scale(1.1);\n}\n\n.filter-btn:active {\n  transform: scale(0.98) translate3d(0, 0, 0);\n  transition: transform 80ms ease-out;\n}\n\n/* Enhanced active filter button */\n.filter-btn.active {\n  background: rgba(99, 102, 241, 0.1);\n  color: #6366f1;\n  border-radius: 12px;\n  position: relative;\n  transform: scale(1.02) translate3d(0, 0, 0);\n  transition: all var(--transition-medium);\n}\n\n.filter-row.selected::after {\n  content: \"\";\n  position: absolute;\n  top: calc(100% + 6px);\n  left: 50%;\n  transform: translateX(-50%) translateY(-50%);\n  width: 20px;\n  height: 5px;\n  background: #6366f1;\n  border-radius: 9999px;\n  pointer-events: none;\n  transition: all var(--transition-smooth);\n  animation: indicator-slide var(--transition-spring) ease-out;\n}\n\n.filter-btn-clicked {\n  transition: transform var(--transition-fast);\n  transform: scale(0.95) translate3d(0, 0, 0);\n}\n\n.filter-row {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: auto;\n  min-width: 2rem;\n  flex-shrink: 0;\n  gap: 0;\n  position: relative;\n}\n\n.filter-row-wrapper {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  flex: 1 1 auto;\n  min-width: 0;\n  width: 80%;\n  max-width: 275px;\n}\n\n.filter-label {\n  font-size: 1rem;\n  font-weight: bold;\n  text-transform: uppercase;\n  opacity: 0.6;\n  margin-top: 0;\n  text-align: center;\n  word-break: break-word;\n  white-space: normal;\n  line-height: 1.1;\n  display: none;\n}\n\n.filter-title {\n  font-size: 0.5rem;\n}\n\n.filter-icon {\n  position: relative;\n  height: 1.5rem;\n  width: 1.5rem;\n  cursor: pointer;\n}\n\n/* Ensure badge background appears behind the icon for selected filters */\n.filter-row.selected .filter-icon {\n  z-index: 2;\n  position: relative; \n}\n\n.filter-row.selected .filter-icon > svg {\n  stroke-width: 1.5;\n  scale: 1.2;\n  stroke: currentColor;\n}\n\nbody.theme-light .filter-row.selected .filter-icon > svg {\n  color: black;\n}\n\nbody.theme-dark .filter-row.selected .filter-icon > svg {\n  color: white;\n}\n\n.filter-row.selected .filter-badge {\n  z-index: 0;\n}\n\n  .filter-badge {\n  position: absolute;\n  top: -0.5em;\n  right: -0.9em;\n  width: 1.5em;\n  height: 1.25em;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  pointer-events: none;\n}\n.filter-row.selected .filter-icon::before {\n  content: \"\";\n  position: absolute;\n  top: -0.5em;\n  right: -0.9em;\n  width: 1.5em;\n  height: 1.25em;\n  background-color: var(--badge-bg, #6366f1);\n  border-radius: 9999px;\n  z-index: -10;\n}\n\n.filter-icon {\n  position: relative;\n}\n.filter-icon > svg {\n  scale: 1.15;\n  transform-origin: top left;\n  transition: transform var(--transition-fast);\n}\n\n\n.filter-badge-count {\n  position: relative;\n  z-index: 1;\n  font-size: 10px;\n  font-weight: bold;\n  color: white;\n}\n\n/* Make inactive filter badges smaller and faded */\n.filter-row:not(.selected) .filter-badge {\n  transform: scale(0.85);\n  opacity: 0.75;\n}\n\n/* Enhance the size of the selected filter's badge */\n.filter-row.selected .filter-badge {\n  transform: scale(1.1);\n  font-weight: 700;\n}\n\n.queue-wrapper {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  margin-left: 0.5em;\n  padding-left: 0.5em;\n  width: 48px;\n  position: relative;\n  border-left: 1px solid rgba(0, 0, 0, 0.08);\n}\n\nbody.theme-dark .queue-wrapper {\n  border-left: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n.queue-btn {\n  border: none;\n  background: transparent;\n  box-shadow: none;\n  outline: none;\n  padding: 8px;\n  font-size: 1.2rem;\n  cursor: pointer;\n  opacity: 1;\n  border-radius: 8px;\n  transition: all var(--transition-fast);\n  transform: translate3d(0, 0, 0);\n}\n\n.queue-btn:hover {\n  background: rgba(99, 102, 241, 0.08);\n  transform: scale(1.05) translate3d(0, 0, 0);\n}\n\n.queue-btn:active {\n  transform: scale(0.95) translate3d(0, 0, 0);\n  transition: transform 80ms ease-out;\n}\n\n.settings-refresh-wrapper {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  gap: 6px;\n  user-select: none;\n  -webkit-user-select: none;\n  flex-shrink: 0;\n}\n\n.icon-button {\n  border: none;\n  background: transparent;\n  box-shadow: none;\n  outline: none;\n  padding: 6px;\n  font-size: 1.2rem;\n  cursor: pointer;\n  user-select: none;\n  -webkit-user-select: none;\n  opacity: 0.7;\n  border-radius: 8px;\n  transition: all var(--transition-fast);\n  transform: translate3d(0, 0, 0);\n}\n\n.icon-button:hover {\n  background: rgba(0, 0, 0, 0.04);\n  opacity: 1;\n  transform: scale(1.05) translate3d(0, 0, 0);\n}\n\n.icon-button:active {\n  transform: scale(0.95) translate3d(0, 0, 0);\n  transition: transform 80ms ease-out;\n}\n\n \n/* ========== MODULE: Task ========== */\n/* ========== Enhanced Task Styles ========== */\n/* ================================\n   Modern Nesting: Task Styles\n   ================================ */\n .todoist-board .task {\n  background: white;\n  border-radius: 0;\n  border: 1px solid transparent;\n  padding-block: 0.75rem;\n  padding-inline: 1rem;\n  display: flex;\n  flex-direction: row;\n  justify-content: stretch;\n  gap: 0.375rem;\n  min-height: 2rem;\n  -webkit-user-select: none;\n  user-select: none;\n  position: relative;\n  outline: none;\n  transition: all var(--transition-spring);\n  will-change: transform, box-shadow;\n  transform: translate3d(0, 0, 0);\n\n  /* --- Modern Nesting for ::before, :focus, :hover, .selected-task --- */\n  &:not(:first-child)::before {\n    content: \"\";\n    position: absolute;\n    left: 42px;\n    right: 0;\n    top: 0;\n    height: 1px;\n    background: linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.02) 100%);\n    pointer-events: none;\n    transform: translate3d(0, 0, 0);\n  }\n  &:focus {\n    outline: none !important;\n    box-shadow: none !important;\n  }\n  @media (hover: hover) and (pointer: fine) {\n    &:hover:not(.selected-task) {\n      background: #f9fafb;\n      transform: translateY(-1px) translate3d(0, 0, 0);\n      box-shadow: var(--shadow-light);\n      transition: all var(--transition-fast);\n    }\n  }\n  &.no-transition::before {\n    transition: none !important;\n  }\n  &.freeze-transition {\n    transition: none !important;\n    transform: none !important;\n  }\n  /* --- Completed task row styling --- */\n  &.completed .task-content {\n    text-decoration: line-through;\n    opacity: 0.5;\n    transition: all 0.3s ease;\n  }\n}\n\n .todoist-board .task-inner {\n  display: flex;\n  flex-direction: row;\n  align-items: stretch;\n  gap: 0.75rem;\n  width: 100%;\n  user-select: none;\n  -webkit-user-select: none;\n  -webkit-touch-callout: none;\n  -webkit-tap-highlight-color: transparent;\n  font-size: 0.9rem;\n  touch-action: pan-y;\n  min-height: 2.75rem;\n  position: relative;\n  z-index: 1;\n  /* transition: none !important;\n  animation: none !important; */\n}\n\n .todoist-board .task-content {\n  display: flex;\n  flex: 1;\n}\n\n .todoist-board .task-content-wrapper {\n  position: relative;\n  touch-action: pan-y;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: flex-start;\n  width: 100%;\n  flex: 1;\n  overflow: visible;\n}\n\n .todoist-board .task-title {\n  position: relative;\n  padding-bottom: 0.85rem;\n  cursor: text;\n  font-size: 0.92rem;\n  will-change: auto;\n  line-height: 1.4;\n  display: block;\n  font-weight: 500;\n  word-break: break-word;\n  white-space: pre-line;\n  color: #111827;\n}\n\nbody.theme-dark .todoist-board .task-title {\n  color: #f9fafb;\n}\n\n .todoist-board .selected-task .task-title {\n  max-height: 1000px;\n  opacity: 1;\n  transition:\n    max-height 500ms cubic-bezier(0.33, 1, 0.68, 1),\n    opacity 280ms ease-in-out;\n}\n\n\n .todoist-board .task-deadline {\n  position: absolute;\n  top: 0.75rem;\n  right: 10px;\n  z-index: 5;\n  opacity: 0.7;\n}\n .todoist-board .selected-task .task-deadline  {\n  opacity: 1;\n  transition: fade-in 1300ms ease-in-out;\n}\n\n .todoist-board .deadline-label {\n  align-self: center;\n}\n/* ========== Enhanced Task Selection ========== */\n/* --- Modern Nesting: Selected Task --- */\n .todoist-board .selected-task {\n  display: flex;\n  flex-direction: row;\n  justify-content: stretch;\n  height: auto;\n  position: relative;\n  z-index: 0;\n  min-height: 4rem;\n  box-shadow:\n   rgba(6, 24, 44, 0.4) 0px 0px 0px 0.1px, \n   rgba(6, 24, 44, 0.65) 0px 4px 4px -3px,\n    rgba(255, 255, 255, 0.08) -3px 1px 0px 0px;\n  transform: scale(1.005) translateY(-2px);\n  border-radius: 12px;\n  border: 1px solid #e5e7eb;\n  margin-block-start: 1rem;\n  margin-block-end: 0.75rem;\n  margin-inline: auto;\n  transition:\n    box-shadow 420ms cubic-bezier(0.25, 0.8, 0.25, 1),\n    transform 400ms cubic-bezier(0.25, 1, 0.5, 1),\n    border 360ms ease,\n    border-radius 360ms ease;\n  /* Improve animation smoothness on mobile and hardware acceleration */\n  will-change: transform, box-shadow, opacity;\n  backface-visibility: hidden;\n  transform: translate3d(0, 0, 0) scale(1.005) translateY(-2px);\n  &::before {\n    display: none;\n  }\n  /* Modern Nesting: Hide ::before on next .task */\n  + .task::before {\n    display: none;\n  }\n}\n\n/* Dim other tasks when a task is selected */\nbody:has(.todoist-board .selected-task) .todoist-board .task:not(.selected-task):not(.subtask-row),\n.queue-focused .todoist-board .task:not(.selected-task):not(.subtask-row) {\n  opacity: 0.5;\n  transition: opacity var(--transition-medium);\n}\n\n\n .todoist-board .task-scroll-wrapper {\n  display: flex;\n  width: 100%;\n}\n/* --- Task Scroll Wrapper for selected-task --- */\n .todoist-board .selected-task .task-scroll-wrapper {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  overflow-y: auto;\n  max-height: 100%;\n  padding-bottom: 0.5rem;\n  position: relative;\n}\n\n .todoist-board .selected-task .task-inner {\n  flex: 0 0 auto;\n}\n\n\n .todoist-board .selected-task .task-content {\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n}\n\n .todoist-board .selected-task .task-content-wrapper {\n  flex: 1 1 auto;\n  display: flex;\n  justify-content: flex-start;\n  flex-direction: column;\n  align-items: stretch;\n  height: 100%;\n  min-height: unset;\n  overflow: visible;\n  padding-bottom: 0.5rem;\n}\n\n .todoist-board .selected-task .task-description,\n .todoist-board .selected-task .task-metadata {\n  flex-grow: 0;\n  flex-shrink: 0;\n  flex-basis: auto;\n}\n\n .todoist-board .selected-task .task-title {\n  flex-shrink: 0;\n}\n\n/* Enhanced selection background */\n\n/* Improved deselection */\n\n .todoist-board .task.no-transition::before {\n  transition: none !important;\n}\n\n/* ========== Enhanced Checkbox Styles ========== */\ninput.todoist-checkbox {\n  /* Hard reset to strip all default or theme-injected visuals */\n  appearance: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  background: none;\n  box-shadow: none;\n  width: 22px;\n  height: 22px;\n  border: 2.5px solid #d1d5db;\n  border-radius: 50%;\n  cursor: pointer;\n  margin-right: 4px;\n  align-self: flex-start;\n  position: relative;\n  display: inline-block;\n  vertical-align: middle;\n  backface-visibility: hidden;\n  z-index: 10;\n  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);\n}\n\n/* Hide browser default checkmark for all major engines */\ninput.todoist-checkbox::-webkit-checkmark,\ninput.todoist-checkbox::checkmark,\ninput.todoist-checkbox::-ms-check {\n  display: none !important;\n  background: none !important;\n  color: transparent !important;\n}\ninput.todoist-checkbox:checked {\n  background-color: #6366f1;\n  overflow: hidden;\n}\n/* Priority-based checkbox styling */\ninput.todoist-checkbox.priority-4 {\n  background-color: #fee2e2; /* Light red */\n  border-color: #dc2626;     /* Red border */\n}\ninput.todoist-checkbox.priority-3 {\n  background-color: #fef3c7; /* Light amber */\n  border-color: #d97706;     /* Amber border */\n}\ninput.todoist-checkbox.priority-2 {\n  background-color: #dbeafe; /* Light blue */\n  border-color: #2563eb;     /* Blue border */\n}\n\n .todoist-board .selected-task input.todoist-checkbox {\n  max-height: 1000px;\n  opacity: 1;\n  transition:\n    max-height 500ms cubic-bezier(0.33, 1, 0.68, 1),\n    opacity 280ms ease-in-out;\n}\n\n\ninput.todoist-checkbox:hover {\n  border-color: #6366f1;\n  animation: checkbox-check var(--transition-spring) ease-out;\n  transform: scale(1.05);\n  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);\n  z-index: 1000;\n}\n\ninput.todoist-checkbox:active {\n  transform: scale(0.95);\n  transition: transform 80ms ease-out;\n}\n\n\n\ninput.todoist-checkbox:checked::before {\n  content: \"\";\n  position: absolute;\n  transform-origin: center;\n  top: 0;\n  left: 0.5em;\n  width: 5px;\n  height: 10px;\n  border: solid currentColor;\n  border-width: 0 2px 2px 0;\n  transform: rotate(45deg);\n  z-index: 1000;\n}\n\nbody.theme-light input.todoist-checkbox:checked::before {\n  border-color: #1f2937;\n}\n\nbody.theme-dark input.todoist-checkbox:checked::before {\n  border-color: #f9fafb;\n}\n\n/* Always show the checkmark container, but only display the tick visually on hover or checked */\ninput.todoist-checkbox::after {\n  content: none;\n}\n\n/* ========== MODULE: Pills ========== */\n/* ========== Enhanced Pills ========== */\n/* ================================\n   Modern Nesting: Pill Styles\n   ================================ */\n.pill {\n  background: var(--pill-bg);\n  color: var(--pill-text);\n  border-radius: 12px;\n  padding-block: 0.25rem;\n  padding-inline: 0.625rem;\n  font-size: 0.625rem;\n  font-weight: 500;\n  display: inline-block;\n  white-space: nowrap;\n  user-select: none;\n  transition: all var(--transition-fast);\n  box-shadow: 0 1px 2px rgba(0,0,0,0.04);\n  /* Modern Nesting for variants */\n  &.deadline {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding-block: 3px;\n    padding-inline: 8px;\n    font-size: 0.7rem;\n    line-height: 1;\n    min-height: 20px;\n    height: auto;\n    vertical-align: middle;\n  }\n  &.deadline-date {\n    font-weight: 700;\n    font-size: 0.55rem;\n    background: linear-gradient(135deg, #a78bfa, #8b5cf6);\n    color: #fff;\n    opacity: 0.9;\n    box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);\n    animation: fade-in-slide var(--transition-medium) ease-out;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    line-height: 1;\n    height: auto;\n    min-height: 16px;\n    vertical-align: middle;\n  }\n}\n\n/* --- Grouped Pill Variants with :is() for shared logic --- */\n.pill:is(.today, .overdue, .soon, .future) {\n  color: white;\n  padding-block: 0.2rem;\n  padding-inline: 0.5rem;\n  font-size: 0.6rem;\n  border-radius: 6px;\n  font-weight: 600;\n  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);\n}\n.pill.today {\n  background: linear-gradient(135deg, #3b82f6, #2563eb);\n  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);\n}\n.pill.overdue {\n  background: linear-gradient(135deg, #ef4444, #dc2626);\n  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);\n  animation: pulse-urgent 2s ease-in-out infinite;\n}\n.pill.soon {\n  background: linear-gradient(135deg, #f59e0b, #d97706);\n  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);\n}\n.pill.future {\n  background: linear-gradient(135deg, #10b981, #059669);\n  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);\n}\n\n/* ========== Enhanced Task Metadata ========== */\n .todoist-board .task-description,\n .todoist-board .task-metadata {\n  overflow: hidden;\n  max-height: 0;\n  opacity: 0;\n  transition: \n    max-height var(--transition-medium) cubic-bezier(0.4, 0, 0.2, 1),\n    opacity var(--transition-medium);\n}\n\n .todoist-board .selected-task .task-description,\n .todoist-board .selected-task .task-metadata {\n  max-height: 1000px;\n  opacity: 1;\n  transition: \n    max-height var(--transition-smooth) cubic-bezier(0.4, 0, 0.2, 1),\n    opacity var(--transition-medium);\n}\n\n/* Restrict height and allow scrolling for long descriptions in selected task */\n .todoist-board .selected-task .task-description {\n  max-height: 80px;\n  padding-bottom: 0.5rem;\n  overflow-y: auto;\n  position: relative;\n  background: rgba(255, 239, 213, 0.07);\n}\n\n\n .todoist-board .task-metadata > .pill:not(:first-child):not(.deadline-date) {\n  position: relative;\n  margin-left: 12px;\n  font-weight: inherit;\n}\n\n .todoist-board .task-metadata > .pill:not(:first-child):not(.deadline-date)::before {\n  content: \"\";\n  background: var(--meta-text);\n  display: inline-block;\n  width: 1px;\n  height: 10px;\n  position: absolute;\n  left: -8px;\n  top: 50%;\n  transform: translateY(-50%);\n  margin: 0;\n  vertical-align: middle;\n  opacity: 0.3;\n}\n\n .todoist-board .label-separator {\n  opacity: 0.4;\n  margin: 0 4px;\n}\n\n/* ================================\n   Modern Nesting: Task Metadata\n   ================================ */\n .todoist-board .task-metadata {\n  display: flex;\n  flex-wrap: nowrap;\n  gap: 2px 2px;\n  line-height: 0.9;\n  row-gap: 1px;\n  font-size: 0.6rem;\n  align-items: center;\n  color: var(--meta-text);\n  opacity: 0.8;\n  font-weight: 400;\n  padding: 0.25rem 0 0.5rem 0;\n  position: relative;\n  z-index: 1;\n  white-space: nowrap;\n  overflow: visible;\n  pointer-events: none;\n  transform-origin: top left;\n  animation: fade-in-up var(--transition-spring) ease-out both;\n}\n\n .todoist-board .selected-task .task-metadata {\n  white-space: normal;\n  display: flex;\n  flex-wrap: nowrap;\n  /* Don't override padding-bottom here; let base .task-metadata rule apply */\n}\n\n .todoist-board .selected-task .pill.label-pill {\n  display: flex;\n  flex-wrap: wrap;\n  line-height: 1;\n  padding-right: 2px\n}\n .todoist-board .task-description {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: flex-start;\n  width: 100%;\n  color: #6b7280;\n  font-size: 0.74rem;\n  font-style: italic;\n  opacity: 0.8;\n  max-width: 100%;\n  line-height: 1.4;\n  white-space: pre-line;\n}\n\n \n\n\n\n/* ========== Enhanced Deadline Styles ========== */\n .todoist-board .deadline-wrapper {\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  font-size: 0.6rem;\n  line-height: 1.1;\n  position: relative;\n}\n\n .todoist-board .deadline-label {\n  font-size: 0.5rem;\n  opacity: 0.6;\n  margin-bottom: 4px;\n  transition: opacity var(--transition-fast);\n}\n\n\n/* ========== MODULE: Toolbar & Chin ========== */\n/* ========== Enhanced Mini Toolbar ========== */\n.mini-toolbar {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.375rem 3rem 0.375rem 0.75rem;\n  height: 1.65rem;\n  border-radius: 18px;\n  background: rgba(31, 41, 55, 0.8);\n  color: white;\n  border: none;\n  box-shadow: \n    0 4px 12px rgba(0,0,0,0.15),\n    0 2px 4px rgba(0,0,0,0.1),\n    inset 0 1px 0 rgba(255,255,255,0.1);\n  font-size: 0.75rem;\n  transition: all var(--transition-fast);\n  animation: toolbar-slide-up var(--transition-spring) ease-out;\n  position: relative;\n  width: 60%;\n  max-width: 220px;\n}\n\n.selected-task .mini-toolbar {\n  position: absolute;\n  bottom: 0;\n  left: 50%;\n  transform: translateX(-50%);\n  z-index: 100;\n  pointer-events: auto;\n}\n\n.mini-toolbar-btn {\n  background: transparent;\n  border: none;\n  color: inherit;\n  opacity: 0.85;\n  font-size: 1rem;\n  padding: 4px 8px;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: all var(--transition-fast);\n}\n\n.mini-toolbar-btn svg {\n  width: 16px;\n  height: 16px;\n}\n\n.mini-toolbar .mini-toolbar-btn-wrapper {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  margin: 0;\n}\n\n.mini-toolbar-label {\n  position: absolute;\n  top: 4px;\n  font-size: 0.6rem;\n  opacity: 0.7;\n  text-align: center;\n  line-height: 1.1;\n  pointer-events: none;\n  transition: opacity var(--transition-fast);\n}\n\n.mini-toolbar-btn:hover {\n  opacity: 1;\n  background: rgba(99, 102, 241, 0.08);\n  transform: scale(1.05);\n}\n\n.mini-toolbar-btn:active {\n  transform: scale(0.95);\n  transition: transform 80ms ease-out;\n}\n\n.mini-toolbar-btn:hover + .mini-toolbar-label {\n  opacity: 0.9;\n}\n\n/* ========== Enhanced Dragging States ========== */\n.dragging-row {\n  z-index: 1000;\n  opacity: 0 !important;\n  touch-action: pan-y;\n  box-shadow: none !important;\n  transform: none !important;\n  visibility: hidden !important;\n  position: absolute !important;\n  top: -9999px !important;\n  left: -9999px !important;\n  animation: none !important;\n}\n\n.task-placeholder {\n  display: flex;\n  flex-direction: row;\n  gap: 0.375rem;\n  opacity: 0.4;\n  border: 2px solid rgba(99, 102, 241, 0.3);\n  background: rgba(99, 102, 241, 0.05);\n  border-radius: 8px;\n  pointer-events: none;\n  padding: 4px 12px 8px 22px;\n  transform: scale(0.97) translate3d(0, 0, 0);\n  transition: all var(--transition-medium);\n}\n\n.drag-scroll-block {\n  touch-action: none !important;\n  overflow: hidden !important;\n  -webkit-overflow-scrolling: auto !important;\n}\n\n/* ========== Enhanced Queue Mode ========== */\n.queue-dimmed {\n  opacity: 0.2;\n  will-change: opacity;\n  pointer-events: none;\n  filter: blur(0.5px);\n  transition: all var(--transition-smooth);\n}\n\n.queue-focused {\n  opacity: 1;\n  filter: none;\n  transition: all var(--transition-smooth);\n  will-change: opacity, filter;\n}\n\n.queue-focused-title {\n  font-weight: 550;\n  transform-origin: top left;\n  transform: scale(1.02);\n  color: #374151;\n  transition: all var(--transition-fast);\n  will-change: transform, font-weight, color;\n}\n\n/* ========== Enhanced Loading Overlay ========== */\n.loading-overlay {\n  position: absolute;\n  inset: 0;\n  background: rgba(255, 255, 255, 0.85);\n  backdrop-filter: blur(4px);\n  z-index: 10000;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  pointer-events: none;\n  font-size: 0.9rem;\n  font-weight: 500;\n  animation: fade-in var(--transition-medium) ease-out;\n}\n\n/* ========== Enhanced Settings Modal ========== */\n.filter-icon-row {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  align-items: center;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n\n.settings-label {\n  display: flex;\n  align-items: center;\n  margin-right: 12px;\n  font-weight: 600;\n  font-size: 0.85rem;\n}\n\n.settings-icon-wrapper {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.settings-icon-btn {\n  font-size: 2em;\n  background: transparent;\n  border: 2px solid #e5e7eb;\n  border-radius: 12px;\n  cursor: pointer;\n  width: 48px;\n  height: 48px;\n  transition: all var(--transition-fast);\n}\n\n.settings-icon-btn:hover {\n  transform: scale(1.05);\n  border-color: #d1d5db;\n  box-shadow: var(--shadow-light);\n}\n\n.settings-icon-btn:active {\n  transform: scale(0.98);\n  transition: transform 80ms ease-out;\n}\n\n.settings-icon-btn.active {\n  background: linear-gradient(135deg, #f3f4f6, #ffffff);\n  border: 2px solid #6366f1;\n  color: #6366f1;\n  transform: scale(1.02) translate3d(0, 0, 0);\n  box-shadow: \n    0 0 0 3px rgba(99, 102, 241, 0.1),\n    var(--shadow-medium);\n  animation: settings-select var(--transition-spring) ease-out;\n}\n\n.settings-input-row {\n  margin: 12px 0 8px 0;\n}\n\n.settings-input {\n  margin-left: 8px;\n  width: 60%;\n  padding: 8px 12px;\n  border: 2px solid #e5e7eb;\n  border-radius: 8px;\n  font-size: 0.9rem;\n  transition: all var(--transition-fast);\n  background: white;\n}\n\n.settings-input:focus {\n  outline: none;\n  border-color: #6366f1;\n  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);\n}\n\n.settings-action-row {\n  margin-top: 12px;\n}\n\n.settings-action-btn {\n  margin-right: 12px;\n  padding: 8px 16px;\n  border: 2px solid #e5e7eb;\n  border-radius: 8px;\n  background: white;\n  cursor: pointer;\n  font-weight: 500;\n  transition: all var(--transition-fast);\n  transform: translate3d(0, 0, 0);\n}\n\n.settings-action-btn:hover {\n  border-color: #6366f1;\n  color: #6366f1;\n  transform: translateY(-1px) translate3d(0, 0, 0);\n  box-shadow: var(--shadow-light);\n}\n\n.settings-action-btn:active {\n  transform: translateY(0) translate3d(0, 0, 0);\n  transition: transform 80ms ease-out;\n}\n\n.settings-save-row {\n  margin-top: 24px;\n}\n\n/* ========== MODULE: Filter Bar ========== */\n/* ========== Enhanced Filter Bar ========== */\n.filter-bar {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1em;\n  padding: 1rem 0.875rem 0.875rem 0.875rem;\n  flex-wrap: nowrap;\n  overflow-x: auto;\n  overflow-y: hidden;\n  width: 100%;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n}\n\n.filter-bar::-webkit-scrollbar {\n  display: none;\n}\n\n/* ========== Enhanced Utilities ========== */\n.hidden-datetime-picker {\n  position: fixed;\n  left: -9999px;\n  opacity: 0;\n  pointer-events: none;\n}\n\n.project-hash {\n  font-weight: 500;\n  font-size: 0.625rem;\n  display: inline-block;\n  white-space: nowrap;\n  user-select: none;\n  transition: all var(--transition-fast);\n}\n\n.icon-picker-wrapper {\n  display: none;\n}\n\n.icon-picker-wrapper.visible {\n  display: grid;\n  grid-template-columns: repeat(5, 36px);\n  justify-items: center;\n  align-items: center;\n  gap: 8px;\n  position: absolute;\n  z-index: 1000;\n  background: white;\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  padding: 12px;\n  box-shadow: var(--shadow-heavy);\n  top: 48px;\n  left: 50%;\n  transform: translateX(-50%);\n  min-width: 220px;\n  min-height: 360px;\n  overflow-y: auto;\n  animation: fade-in-scale var(--transition-spring) ease-out;\n}\n\n.task.freeze-transition {\n  transition: none !important;\n  transform: none !important;\n}\n\n/* ========== MODULE: Animations ========== */\n/* ========== Enhanced Sync Animation ========== */\n\n@keyframes toolbar-slide-up {\n  0% {\n    opacity: 0;\n    transform: translateX(-50%) translateY(12px) scale(0.95) translate3d(0, 0, 0);\n  }\n  100% {\n    opacity: 1;\n    transform: translateX(-50%) translateY(0) scale(1) translate3d(0, 0, 0);\n  }\n}\n\n@keyframes settings-select {\n  0% {\n    transform: scale(1) translate3d(0, 0, 0);\n  }\n  50% {\n    transform: scale(1.08) translate3d(0, 0, 0);\n  }\n  100% {\n    transform: scale(1.02) translate3d(0, 0, 0);\n  }\n}\n\n@keyframes fade-in {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n\n\n\n@keyframes fade-in-scale {\n  from {\n    opacity: 0;\n    transform: translateX(-50%) scale(0.95) translate3d(0, 0, 0);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(-50%) scale(1) translate3d(0, 0, 0);\n  }\n}\n\n\n\n@keyframes indicator-slide {\n  from {\n    opacity: 0;\n    transform: translateX(-50%) translateY(-50%) scale(0.8) translate3d(0, 0, 0);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(-50%) translateY(-50%) scale(1) translate3d(0, 0, 0);\n  }\n}\n\n@keyframes pulse-urgent {\n  0%, 100% {\n    opacity: 0.9;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 1;\n    transform: scale(1.02);\n  }\n}\n\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n.fade-in {\n  animation: fade-in-up var(--transition-fast) ease-out both;\n}\n\n/* ========== Mobile Responsiveness ========== */\n/* ========== MODULE: Mobile Responsiveness ========== */\n@media only screen and (max-width: 600px) {\n  .markdown-preview-section[data-language=\"todoist-board\"] {\n    padding: 0 !important;\n    margin: 0 !important;\n  }\n  \n  .todoist-board .task {\n    font-size: 0.85rem;\n    -webkit-user-select: none !important;\n    user-select: none !important;\n    -webkit-touch-callout: none !important;\n    padding: 0.875rem 0.125rem 0.5rem 1rem;\n  }\n  \n  .task-placeholder, .dragging-row {\n    -webkit-user-select: none;\n    user-select: none;\n    -webkit-touch-callout: none;\n  }\n  \n  .pill {\n    font-size: 0.6rem;\n    padding: 0.2rem 0.5rem;\n  }\n\n  .todoist-board .task-inner {\n    touch-action: pan-y !important;\n  }\n  \n  .list-toolbar {\n    border-radius: 12px;\n  }\n  \n  .filter-btn {\n    padding: 4px;\n  }\n  \n  .mini-toolbar {\n    border-radius: 16px;\n    padding: 0.25rem 0.625rem;\n    height: 2rem;\n  }\n\n  .list-view {\n    padding-left: 0;\n    padding-right: 0;\n  }\n  \n  /* Disable hover effects on mobile */\n  .todoist-board .task:hover:not(.selected-task) {\n    transform: translate3d(0, 0, 0);\n    background: transparent;\n    box-shadow: none;\n  }\n  \n  .filter-btn:hover,\n  .queue-btn:hover,\n  .icon-button:hover {\n    transform: translate3d(0, 0, 0);\n    background: transparent;\n  }\n\n\n  .todoist-board .selected-task .task-metadata {\n    padding-bottom: 0.5rem;\n    margin-bottom: 1rem;\n  }\n  .todoist-board .selected-task .task-description {\n    max-height: none;\n    overflow-y: visible;\n    margin-bottom: 0.5rem;\n  }\n}\n\n@media only screen and (max-width: 768px) {\n  .markdown-preview-view .cm-preview-code-block.cm-embed-block.cm-lang-todoist-board,\n  .markdown-source-view.mod-cm6 .block-language-todoist-board.todoist-board,\n  .markdown-rendered .block-language-todoist-board.todoist-board,\n  .cm-preview-code-block.cm-embed-block.markdown-rendered.cm-lang-todoist-board,\n  .view-content .block-language-todoist-board.todoist-board.cm-embed-block.cm-lang-todoist-board {\n    position: relative;\n    left: 50%;\n    transform: translateX(-50%);\n    transform-origin: top left;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    padding: 0 !important;\n    margin: 0 !important;\n    border-radius: 0 !important;\n    box-sizing: border-box;\n    overflow-x: hidden;\n  }\n\n  /* Reading Mode: fix horizontal scroll and alignment */\n  .markdown-rendered .block-language-todoist-board.todoist-board.reading-mode {\n    position: relative;\n    left: 50%;\n    transform: translateX(-50%);\n    width: 100vw !important;\n    max-width: 100vw !important;\n    margin: 0 !important;\n    padding: 0 !important;\n    overflow-x: hidden;\n  }\n\n  .filter-button-wrapper {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    width: 55%;\n    max-width: 60%;\n  }\n}\n\n/* ========== Accessibility & Motion ========== */\n@media (prefers-reduced-motion: reduce) {\n  *,\n  *::before,\n  *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n  \n  .todoist-board .task:hover:not(.selected-task) {\n    transform: translate3d(0, 0, 0);\n  }\n  \n  \n  .pill.overdue {\n    animation: none;\n  }\n}\n\n/* ========== Focus Management ========== */\n .todoist-board .task:focus-visible {\n   outline: 2px solid #6366f1;\n   outline-offset: 2px;\n }\n\n.filter-btn:focus-visible,\n.queue-btn:focus-visible,\n.icon-button:focus-visible {\n  outline: 2px solid #6366f1;\n  outline-offset: 2px;\n}\n\n\n\n/* ========== MODULE: Dark Theme ========== */\nbody.theme-dark {\n  --pill-bg: #374151;\n  --pill-text: #d1d5db;\n  --meta-text: #9ca3af;\n}\n\nbody.theme-dark .list-toolbar {\n  background: transparent;\n  border: 1px solid rgba(55, 65, 81, 0.3);\n  /* Inset effect for dark theme toolbar */\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05),\n              inset 0 -1px 2px rgba(0, 0, 0, 0.04);\n  transition: background-color 0.2s ease;\n}\nbody.theme-dark .list-toolbar.sticky {\n  background-color: #1e1e1e;\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05),\n              inset 0 -1px 2px rgba(0, 0, 0, 0.04),\n              0 1px 4px rgba(0, 0, 0, 0.15);\n}\n\nbody.theme-dark .todoist-board .task {\n  color: #f9fafb;\n}\n\nbody.theme-dark .todoist-board .task:hover:not(.selected-task) {\n  background: #1f2937;\n}\n\n\nbody.theme-dark .todoist-board .task::before {\n  background: linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);\n}\n\nbody.theme-dark .settings-input,\nbody.theme-dark .settings-action-btn {\n  background: #374151;\n  border-color: #4b5563;\n  color: #f9fafb;\n}\n\nbody.theme-dark .icon-picker-wrapper.visible {\n  background: #1f2937;\n  border-color: #374151;\n}\n\nbody.theme-dark .todoist-board .task {\n  background: transparent;\n  color: #f9fafb;\n}\n\nbody.theme-light .todoist-board .task {\n  color: #111827;\n}\n\nbody.theme-dark .todoist-board .task:hover:not(.selected-task) {\n  background: #1f2937;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.4);\n}\n\n/* ========== iOS/Safari Fixes ========== */\n .todoist-board .task.dragging-row {\n   touch-action: none !important;\n   user-select: none !important;\n   -webkit-user-select: none !important;\n   -webkit-touch-callout: none !important;\n }\n\n.list-view.drag-scroll-block {\n  touch-action: none !important;\n  user-select: none !important;\n  -webkit-user-select: none !important;\n  -webkit-touch-callout: none !important;\n}\n\nbody.drag-disable {\n  position: fixed !important;\n  overflow: hidden !important;\n  touch-action: none !important;\n  -webkit-user-select: none !important;\n  user-select: none !important;\n  -webkit-touch-callout: none !important;\n}\n/* --- Checkbox completion animation --- */\n .todoist-board .task-checked-anim {\n   transition: transform 0.2s ease;\n   transform: scale(0.96);\n }\n /* --- Completed task row styling --- */\n .todoist-board .task.completed .task-content {\n   text-decoration: line-through;\n   opacity: 0.5;\n   transition: all 0.3s ease;\n }\n/* --- Icon grid for settings --- */\n/* Icon picker trigger and popup */\n.icon-trigger {\n  position: relative;\n  box-sizing: border-box;\n}\n\n/* --- Icon grid for settings --- */\n/* --- Improved Icon Picker Grid Layout --- */\n\n.icon-grid-btn {\n  width: 36px;\n  height: 36px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  margin: 0;\n}\n.icon-picker-wrapper .icon-grid-btn {\n  background: none;\n  border: none;\n  cursor: pointer;\n  transition: transform 0.1s ease;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  overflow: visible;\n}\n.icon-picker-wrapper .icon-grid-btn:hover {\n  transform: scale(1.1);\n}\n.icon-picker-wrapper .icon-grid-btn.selected {\n  border-color: #007aff;\n  background-color: #e6f0ff;\n}\n.icon-grid-btn svg {\n  width: 20px;\n  height: 20px;\n  overflow: visible;\n}\n/* --- Icon color picker row --- */\n.icon-color-row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  justify-content: center;\n  align-items: center;\n  padding: 6px 6px;\n  border-top: 1px solid #eee;\n  margin-top: 6px;\n  width: 100%;\n  box-sizing: border-box;\n  grid-column: 1 / -1;\n}\ninput .icon-color-picker {\n  width: 28px;\n  height: 24px;\n}\n\n/* --- Settings save row spacing --- */\n.settings-save-row {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  justify-content: flex-start;\n  margin-top: 12px;\n}\n\n/* --- Icon button style --- */\n.icon-button {\n  background: none;\n  border: none;\n  padding: 4px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.icon-color-swatch {\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  cursor: pointer;\n  border: 2px solid white;\n  box-shadow: 0 0 0 1px #ccc;\n}\n.icon-color-swatch:hover {\n  box-shadow: 0 0 0 2px #888;\n}\n/* ================================\n   Modern Nesting: Non-task Note\n   ================================ */\n/* ================================\n   Modern Nesting: Non-task Note\n   ================================ */\n.non-task-note, .non-task-note .task-title {\n  font-size: 1rem;\n  font-weight: 600;\n  color: #1f2937; /* dark gray for visibility */\n  padding-block: 0.75rem;\n  padding-inline: 1rem;\n  margin-block: 0.5rem;\n  margin-inline: 0;\n  background: none;\n  border: none !important;\n  white-space: pre-wrap;\n  word-break: break-word;\n  opacity: 1;\n}\n\nbody.theme-dark .non-task-note {\n  color: #f9fafb;\n  border: none !important;\n}\n\n.non-task-note .chin-inner {\n  height: 0.1rem;\n}\n.non-task-note.selected-task { \n  border: none;\n  box-shadow: none;\n  margin-bottom: 2rem;\n}\n\n/* ========== Hide metadata and description for non-task notes ========== */\n.non-task-note .task-metadata,\n.non-task-note .task-description, .non-task-note .todoist-checkbox {\n  display: none !important;\n  max-height: 0 !important;\n  opacity: 0 !important;\n  padding: 0 !important;\n  margin: 0 !important;\n}\n\n.non-task-note {\n  min-height: 4rem;\n  padding-bottom: 0.5rem;\n}\n.non-task-note .task-content-wrapper {\nposition: absolute;\nbottom: -1rem;\n}\n.non-task-note .task-title {\n  color: #374151;\n}\n\n.task-placeholder .mini-toolbar {\n  display: none !important;\n}\n\n\n\n/* ========== Custom Mini Toolbar Layout ========== */\n\n/* ========== Custom Mini Toolbar Layout ========== */\n/* Mini-toolbar is centered in its wrapper, with delete button outside */\n\n#mini-toolbar-wrapper {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 100;\n  pointer-events: auto;\n  /* Prevents click-through, matches JS */\n}\n\n#mini-toolbar-wrapper .mini-toolbar {\n  margin: 0 auto;\n}\n\n/* Hide delete button by default, only show when selected-task is active */\n\n.selected-task .mini-toolbar-wrapper .circle-btn.delete-btn {\n  display: flex;\n  position: absolute;\n  right: 0;\n  transform-origin: center;\n  transform: scale(1.25);\n  z-index: 10;\n  color: #fefefe;\n  background-color: rgb(48, 48, 48);\n  opacity: 1;\n  border-radius: 999px;\n  padding: 4px 0;\n  transition: none !important;\n}\n.selected-task .mini-toolbar-wrapper .circle-btn.delete-btn:hover {\n  color: red;\n}\n.mini-toolbar-dates-wrapper {\n  display: flex;\n  gap: 0.5rem;\n}\n\n.mini-toolbar .date-btn {\n\n  border-radius: 6px;\n  padding: 4px 10px;\n  font-weight: 500;\n  font-size: 0.75rem;\n  transition: all var(--transition-fast);\n}\n\n.mini-toolbar .date-btn:hover {\n  background: rgba(99, 102, 241, 0.08);\n  transform: scale(1.05);\n}\n\n.mini-toolbar .circle-btn {\n  border-radius: 999px;\n  padding: 4px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all var(--transition-fast);\n}\n\n.mini-toolbar .circle-btn:hover {\n  background: rgba(99, 102, 241, 0.08);\n  transform: scale(1.05);\n}\n.mini-toolbar-wrapper {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 8px;\n  padding: 0 !important;\n}\n\n\n.icon-button.refresh-btn.syncing > svg {\n  animation: spin 1s linear infinite;\n  transform-origin: center;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n/* ========== Chin-Style Mini Toolbar ========== */\n\n.fixed-chin {\n  display: none;\n  position: relative;\n  width: 100%;\n  padding: 0.5rem 1rem 0.5rem;\n  align-items: flex-end;\n  justify-content: flex-start;\n  flex-direction: column;\n}\n\n.selected-task .fixed-chin {\n  display: flex;\n  margin-top: 0.5rem;\n}\n\n\n.chin-inner {\n  display: none;\n}\n\n.selected-task .chin-inner {\n  display: flex;\n  gap: 0.25rem;\n  border-top: 1px solid rgba(0, 0, 0, 0.05);\n  margin-top: 1rem;\n  width: 100%;\n  justify-content: flex-start;\n  flex-wrap: wrap;\n  background-color: rgba(243, 244, 246, 0.2); /* light gray background */\n  border-radius: 6px;\n  padding: 0.5rem 0.75rem;\n}\nbody.theme-dark .selected-task .chin-inner {\n  background-color: var(--background-primary);\n  border-radius: 12px;\n}\n\n.chin-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 4px 8px;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  border-radius: 6px;\n  background: white;\n  color: #374151;\n  font-size: 0.7rem;\n  font-weight: 500;\n  cursor: pointer;\n  box-shadow: none !important;\n  transition: all var(--transition-fast);\n}\n\n\n.chin-btn:hover {\n  background: #f3f4f6;\n  border-color: #d1d5db;\n}\n\n.chin-btn:active {\n  background: #e5e7eb;\n  transform: scale(0.97);\n}\n\n.chin-btn:focus-visible {\n  outline: 2px solid #6366f1;\n  outline-offset: 2px;\n}\n\nbody.theme-dark .chin-btn {\n  background: #1f2937;\n  border-color: #374151;\n  color: #f9fafb;\n}\n\nbody.theme-dark .chin-btn:hover {\n  background: #374151;\n  border-color: #4b5563;\n}\n\n/* Chin-Style Button Customizations for Selected Task */\n.selected-task .mini-toolbar-wrapper .delete-btn {\n  color: red;\n  right: 0;\n  margin-left: auto;\n}\n.selected-task .mini-toolbar-wrapper .delete-btn .lucide {\n  stroke: red;\n}\n.selected-task .edit-btn svg {\n  stroke: #FDB600; \n}\n.selected-task .tomorrow-btn svg {\n  stroke: #a176e6;\n}\n.selected-task .today-btn svg {\n  stroke: #0764fa; \n}\n.selected-task .mini-toolbar .today-btn .date-subtitle {\n  font-size: 0.5rem;\n  color: #9ca3af;\n  margin-top: 2px;\n  display: block;\n}\n\n/*=========================== Misc. ===========================*/\n\n\n.selected-task .task-metadata {\n  animation: none;\n}\n/* ========== Always show trash/delete SVG icon in settings modal ========== */\n.settings-filter-table .icon-button svg {\n  width: 16px;\n  height: 16px;\n  fill: none;\n  display: inline-block;\n  opacity: 1;\n  visibility: visible;\n}\n/* ========== Filter Badge Z-Index Fix ========== */\n.filter-badge span,\n.filter-badge svg {\n  position: relative;\n  z-index: 2;\n}\n/* Container Query Example for .task */\n@container style (max-width: 500px) {\n  .task {\n    font-size: 0.8rem;\n  }\n}\n\n/* --- Settings filter table styling --- */\n.settings-filter-table th,\n.settings-filter-table td {\n  padding: 4px 6px;\n  vertical-align: middle;\n}\n\n.settings-filter-table input[type=\"text\"] {\n  padding: 3px 5px;\n  font-size: 0.85em;\n}\n\n.settings-filter-table td:nth-child(4) {\n  text-align: center;\n  vertical-align: middle;\n}\n.settings-filter-table input[type=\"radio\"] {\n  transform: scale(1.3);\n  margin: 0;\n}\n\n.settings-filter-table button {\n  padding: 4px 8px;\n  font-size: 1em;\n  cursor: pointer;\n}\n\n/* Constrain the width of the Title column in the settings filter table */\n.settings-filter-table td:nth-child(2) input[type=\"text\"] {\n  max-width: 160px;\n}\n\n/* --- Icon dropdown styling --- */\n.icon-dropdown {\n  margin-left: 6px;\n  font-size: 1.1em;\n  padding: 2px 4px;\n  border-radius: 5px;\n  border: 1px solid #ccc;\n  vertical-align: middle;\n  background: #fff;\n  min-width: 38px;\n}\n/* ========== Smooth Deselection Transition ========== */\n.deselecting {\n  opacity: 0.6;\n  transform: scale(0.99) translateY(1px);\n  transition:\n    opacity 300ms ease,\n    transform 300ms ease;\n  z-index: 0;\n}\n\n\n/* ========== Task Modal: Flatter Things 3 Style ========== */\n.todoist-edit-task-modal .modal-content {\n  display: flex;\n  justify-content: center;\n  padding: 0;\n  max-width: 100%;\n}\n\n.todoist-edit-task-modal .taskmodal-wrapper {\n  background: var(--modal-bg, #f9f9fb);\n  border-radius: 12px;\n  padding: 1rem;\n  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  min-width: 260px;\n  font-size: 0.85rem;\n  width: 100%;\n}\nbody.theme-dark .todoist-edit-task-modal .taskmodal-wrapper {\n  background-color: #1e1e1e;\n}\n\n/* --- Task Modal Fields --- */\n\n.todoist-edit-task-modal .taskmodal-title-field,\n.todoist-edit-task-modal .taskmodal-description-field,\n.todoist-edit-task-modal .taskmodal-date-field,\n.todoist-edit-task-modal .taskmodal-project-field,\n.todoist-edit-task-modal .taskmodal-labels-field {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.todoist-edit-task-modal .taskmodal-date-label,\n.todoist-edit-task-modal .taskmodal-project-label,\n.todoist-edit-task-modal .taskmodal-labels-label {\n  font-size: 0.65rem;\n  font-weight: 500;\n  color: #6b7280;\n}\n\n.todoist-edit-task-modal .taskmodal-title-input {\n  border: none;\n  background: #fff;\n  border-radius: 6px;\n  border-bottom: 1px solid #e0e0e0;\n  padding: 3px 3px;\n  font-size: 0.9rem;\n  width: 100%;\n}\n.todoist-edit-task-modal .taskmodal-title-input:focus {\n  outline: none;\n  border-color: #6366f1;\n}\n\n.todoist-edit-task-modal .taskmodal-description-input {\n  border: none;\n  background: #fff;\n  border-radius: 6px;\n  border-bottom: 1px solid #e0e0e0;\n  padding: 3px 3px;\n  font-size: 0.9rem;\n  resize: vertical;\n  min-height: 4rem;\n}\n.todoist-edit-task-modal .taskmodal-description-input:focus {\n  outline: none;\n  border-color: #6366f1;\n}\n\n.todoist-edit-task-modal .taskmodal-date-input {\n  border: none;\n  background: #fff;\n  border-radius: 6px;\n  border-bottom: 1px solid #e0e0e0;\n  padding: 3px 0;\n  font-size: 0.9rem;\n  text-align: center;\n}\n.todoist-edit-task-modal .taskmodal-date-input:focus {\n  outline: none;\n  border-color: #6366f1;\n}\n\n.todoist-edit-task-modal .taskmodal-labels-select {\n  padding: 4px 6px;\n  font-size: 0.8rem;\n  border: 1px solid #e5e7eb;\n  border-radius: 6px;\n  background: #fff;\n  min-height: 60px;\n  max-height: 120px;\n  overflow-y: auto;\n  resize: vertical;\n  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);\n}\n\n.todoist-edit-task-modal .taskmodal-label-list {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.25rem;\n}\n\n.todoist-edit-task-modal .taskmodal-label-checkbox {\n  background: #eee;\n  border-radius: 6px;\n  padding: 4px 8px;\n  font-size: 0.7rem;\n  display: flex;\n  align-items: center;\n  gap: 3px;\n}\n\n/* === Enhanced Date Input Styling for Task Modal === */\n.todoist-edit-task-modal .taskmodal-date-input-row {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n}\n\n.todoist-edit-task-modal .taskmodal-date-input-row input[type=\"date\"] {\n  flex: 1;\n  min-width: 0;\n  text-align: center;\n  height: 2rem;\n}\n\n.todoist-edit-task-modal .taskmodal-date-input-row input[type=\"date\"]:first-child {\n  border-radius: 6px 0 0 6px;\n}\n\n.todoist-edit-task-modal .taskmodal-date-input-row input[type=\"date\"]:last-child {\n  background-color: #ede9fe;\n  border-radius: 0 6px 6px 0;\n  color: #6b21a8;\n  font-weight: 600;\n}\n\n.todoist-edit-task-modal .taskmodal-date-input-row input[type=\"date\"]:hover {\n  background-color: hsl(0, 0, 0.3);\n}\n\n.todoist-edit-task-modal .taskmodal-button-row {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.25rem;\n  margin-top: 0.5rem;\n}\n\n.todoist-edit-task-modal .taskmodal-button-save {\n  background: linear-gradient(135deg, #6366f1, #4338ca);\n  color: white;\n  font-weight: 500;\n  padding: 0.4rem 0.75rem;\n  border-radius: 6px;\n  border: none;\n  font-size: 0.8rem;\n}\n\n.todoist-edit-task-modal .taskmodal-button-cancel {\n  color: #6b7280;\n  border: 1px solid #d1d5db;\n  background: #f9fafb;\n  border-radius: 6px;\n  padding: 0.4rem 0.75rem;\n  font-size: 0.8rem;\n}\n/* ========== Hamburger Dropdown Styles ========== */\n.menu-dropdown {\n  position: absolute;\n  top: 2.5rem;\n  right: 0;\n  background: white;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  box-shadow: var(--shadow-medium);\n  padding: 0.5rem 0;\n  min-width: 150px;\n  z-index: 2000;\n  animation: fade-in-scale var(--transition-spring) ease-out;\n}\n\n.menu-dropdown-item {\n  padding: 0.5rem 1rem;\n  font-size: 0.875rem;\n  cursor: pointer;\n  transition: background var(--transition-fast);\n  white-space: nowrap;\n}\n\n.menu-dropdown-item:hover {\n  background: rgba(99, 102, 241, 0.08);\n}\n\n.menu-dropdown.hidden {\n  display: none;\n}\n\nbody.theme-dark .menu-dropdown {\n  background: #1f2937;\n  border-color: #374151;\n}\n\nbody.theme-dark .menu-dropdown-item {\n  color: #f9fafb;\n}\n\nbody.theme-dark .menu-dropdown-item:hover {\n  background: rgba(255, 255, 255, 0.05);\n}\n\nbody > div.app-container > div.horizontal-main-container > div > div.workspace-split.mod-vertical.mod-root > div > div.workspace-tab-container > div > div > div.view-content > div.markdown-source-view.cm-s-obsidian.mod-cm6.node-insert-event.is-readable-line-width.is-live-preview.is-folding > div > div.cm-scroller > div.cm-sizer > div.cm-contentContainer > div > div.cm-preview-code-block.cm-embed-block.markdown-rendered.cm-lang-todoist-board {\n  border: none;\n  box-shadow: none;\n}\n/* ========== Enlarge and Thicken Focus/Queue and Add Task Icons ========== */\n.queue-btn svg,\n.add-task-btn svg {\n  width: 24px;\n  height: 24px;\n  stroke-width: 2;\n  stroke: currentColor;\n}\n\n.queue-btn,\n.add-task-btn {\n  color: #1f2937; /* dark gray for light theme */\n}\n\nbody.theme-dark .queue-btn,\nbody.theme-dark .add-task-btn {\n  color: #f9fafb; /* light gray for dark theme */\n}\n/* ========== Reading Mode Layout Fix ========== */\n.markdown-reading-view .block-language-todoist-board.todoist-board {\n  all: unset;\n  display: block;\n  padding: 0;\n  margin: 0;\n}\n.change-indicator {\n  display: inline-block;\n  position: absolute;\n  bottom: 4px;\n  right: 4px;\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background-color: orange;\n  opacity: 0.8;\n  z-index: 10;\n  pointer-events: none;\n}\n\n@keyframes pulse {\n  0% {\n    transform: scale(1);\n    opacity: 0.7;\n  }\n  50% {\n    transform: scale(1.2);\n    opacity: 1;\n  }\n  100% {\n    transform: scale(1);\n    opacity: 0.7;\n  }\n}\n\n\n\n/* ========== Subtask Visual Hierarchy ========== */\n/* ========== Subtask Row Compact Design ========== */\n/* ========== Subtask Row Compact Design with Expansion Toggle ========== */\n/* ========== Subtask Row Compact Design ========== */\n.subtask-row {\n  padding: 0 !important;\n  margin: 0 0 0 1rem;\n  border: none;\n  background: transparent;\n  border-radius: 0;\n  line-height: 1.2;\n  max-height: 2.2rem;\n  display: flex;\n  align-items: center;\n}\n.subtask-row .task-metadata,\n.subtask-row .task-description {\n  display: none !important;\n  max-height: 0 !important;\n  opacity: 0 !important;\n  padding: 0 !important;\n  margin: 0 !important;\n}\n\n/* Compact subtask title and checkbox alignment */\n.subtask-row .task-title {\n  font-size: 0.78rem;\n  padding: 0;\n  margin: 0;\n}\n\n.subtask-row input.todoist-checkbox {\n  margin-right: 6px;\n  width: 18px;\n  height: 18px;\n}\n\n.subtask-row.expanded-subtask {\n  max-height: 5rem !important;\n}\n\n/* ========== Subtask Visibility ========== */\n.subtask-wrapper {\n  display: none;\n}\n\n.selected-task .subtask-wrapper {\n  display: flex;\n  flex-direction: column;\n  gap: 0;\n  margin-top: 0.25rem;\n  width: 95%;\n  overflow: visible;\n  max-height: unset;\n}\n.subtask-wrapper .task-scroll-wrapper {\n  overflow-y: hidden;\n}\n.subtask-row::before { \n  position: absolute;\n  top: -0.25rem;\n}\n\nbody.theme-dark .subtask-row {\n  border-left: 2px solid #374151;\n}\n/* Hide metadata in subtasks unless selected */\n.subtask-row .task-meta {\n  display: none;\n}\n\n.subtask-row.selected .task-meta {\n  display: flex;\n}\n/* Hide <small> elements in unselected subtasks */\n.subtask-row:not(.selected) small {\n  display: none;\n}\n\n/* ========== Parent Task Visual Distinction ========== */\n.task.parent-task {\n  position: relative;\n}\n\n.task.parent-task .parent-icon {\n  position: absolute;\n  padding-left: 0.5rem;\n  bottom: 0.75rem;\n  opacity: 0.3;\n  transition: opacity 0.3s ease;\n  width: 16px;\n  height: 16px;\n}\n\n.task.parent-task.selected-task .parent-icon {\n  opacity: 0;\n}\n\n .todoist-board .task-description:empty,\n .todoist-board .task-metadata:empty {\n   display: none !important;\n   max-height: 0 !important;\n   opacity: 0 !important;\n   padding: 0 !important;\n   margin: 0 !important;\n }\n .todoist-board .task-description .desc-empty {\n   display: none;\n }\n .todoist-board .date-subtitle {\n display: none;\n }\n\n.menu-dropdown-item {\n  display: flex;\n  align-items: center;\n}\n\n.menu-dropdown-item svg {\n  vertical-align: middle;\n  margin-right: 8px;\n}\n/* Subtask checkbox style */\n\n\n/* ========== Custom cursor for task, selected-task, and add-task-btn ========== */\n .todoist-board .task,\n .todoist-board .selected-task,\n .add-task-btn {\n   cursor: pointer;\n }\n.empty-filter {\n  font-size: 0.85rem;\n  font-style: italic;\n  color: #9ca3af;\n  text-align: center;\n  padding: 2rem 1rem;\n  opacity: 0.75;\n  max-width: 80%;\n  margin: 2rem auto;\n  line-height: 1.5;\n}\n\nbody.theme-dark .empty-filter {\n  color: #d1d5db;\n  opacity: 0.7;\n}\n\n/* Compact mode styles for todoist-board, including reading mode */\n .block-language-todoist-board.todoist-board.compact-mode .task:not(.selected-task) {\n   max-height: 3rem;\n   overflow: hidden;\n   border-left: 4px solid var(--project-color, #e5e7eb);\n   padding-left: 0.75rem;\n }\n .block-language-todoist-board.todoist-board.compact-mode .task:not(.selected-task) .task-metadata,\n .block-language-todoist-board.todoist-board.compact-mode .task:not(.selected-task) .task-description {\n   display: none !important;\n   max-height: 0 !important;\n   opacity: 0 !important;\n   padding: 0 !important;\n   margin: 0 !important;\n }\n.menu-dropdown-wrapper {\n  position: relative;\n  overflow: visible;\n}\n\n.menu-dropdown {\n  position: absolute;\n  z-index: 1000;\n  top: 100%;\n  right: 0;\n}\n/* For dark theme, apply to .taskmodal-wrapper and .taskmodal-labels-select */\nbody.theme-dark .todoist-edit-task-modal .taskmodal-labels-select {\n  background-color: transparent;\n  border-color: #4b5563;\n  color: #f9fafb;\n}\n\n/* ========== Task Modal: Project & Date Row Layout ========== */\n.todoist-edit-task-modal .taskmodal-row {\n  display: flex;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.todoist-edit-task-modal .taskmodal-project-field,\n.todoist-edit-task-modal .taskmodal-date-field {\n  flex: 1;\n}\n\n/* Match select-project height for the date picker */\ninput.taskmodal-date-input {\n  height: 2rem;\n}\n/* Dark mode: make the label pills use the dark bg/text vars */\nbody.theme-dark .todoist-edit-task-modal .taskmodal-label-checkbox {\n  background: var(--pill-bg);\n  color: var(--pill-text);\n}\n/* Mobile keyboard-safe modal alignment */\n  .todoist-edit-task-modal .modal-content {\n    /* push the wrapper toward the top */\n    align-items: flex-start;\n    justify-content: center;\n  }\n@media only screen and (max-width: 600px) {\n\n  /* 2. Anchor the modal itself to the bottom of that container */\n  body > div.modal-container.todoist-edit-task-modal.mod-dim > div.modal {\n    position: absolute;\n    top: 15%;\n    max-height: fit-content;\n    width: 100%;\n    max-width: 100%;\n    margin: 0;\n    box-sizing: border-box;\n  }\n\n  /* 3. Keep your scrolling and margin tweaks in the same block */\n  .todoist-edit-task-modal .modal-content {\n    align-items: flex-start;\n    justify-content: center;\n  }\n}\n/* 📘 Reading Mode Support */\n.todoist-board.reading-mode {\n  padding-bottom: 0 !important;\n  margin-bottom: 0 !important;\n  overflow: visible;\n  background: transparent;\n}\n\n.todoist-board.reading-mode .list-wrapper {\n  padding-bottom: 0;\n}\n\n.todoist-board.reading-mode .todoist-edit-task-modal,\n.todoist-board.reading-mode .todoist-add-task-modal {\n  position: fixed !important;\n  z-index: 9999;\n}\n\n.todoist-board.reading-mode .menu-dropdown-wrapper {\n  position: fixed !important;\n  z-index: 9999;\n}\n .todoist-board .task .repeat-icon {\n   position: absolute;\n   padding-left: 0.5rem;\n   bottom: 0.75rem;\n   opacity: 0.3;\n   width: 16px;\n   height: 16px;\n }\n\n .todoist-board .task.selected-task .repeat-icon {\n   opacity: 0;\n }\n/* === Hide Icons in Compact Mode === */\n.block-language-todoist-board.todoist-board.compact-mode .parent-icon,\n.block-language-todoist-board.todoist-board.compact-mode .repeat-icon {\n  display: none !important; \n}\n/* ================================\n   Dark mode: Enhanced Task Modal Inputs & Fields\n   ================================ */\nbody.theme-dark .todoist-edit-task-modal .taskmodal-title-input,\nbody.theme-dark .todoist-edit-task-modal .taskmodal-description-input,\nbody.theme-dark .todoist-edit-task-modal .taskmodal-date-input {\n  background: #1f2937;\n  color: #f9fafb;\n  border-bottom: 1px solid #4b5563;\n}\n\nbody.theme-dark .todoist-edit-task-modal .taskmodal-title-input::placeholder,\nbody.theme-dark .todoist-edit-task-modal .taskmodal-description-input::placeholder {\n  color: #9ca3af;\n  opacity: 0.6;\n}\n\nbody.theme-dark .todoist-edit-task-modal .taskmodal-project-select,\nbody.theme-dark .todoist-edit-task-modal .taskmodal-labels-select {\n  background: #1f2937;\n  color: #f9fafb;\n  border-color: #4b5563;\n}\n\nbody.theme-dark .todoist-edit-task-modal .taskmodal-label-checkbox {\n  background: #374151;\n  color: #f9fafb;\n}\n\nbody.theme-dark .todoist-edit-task-modal .taskmodal-label-checkbox:hover {\n  background: #4b5563;\n}\n\nbody.theme-dark .todoist-edit-task-modal .taskmodal-date-input-row input[type=\"date\"] {\n  background: #1f2937;\n  color: #f9fafb;\n  border: 1px solid #4b5563;\n}\n\nbody.theme-dark .todoist-edit-task-modal .taskmodal-date-input-row input[type=\"date\"]::placeholder {\n  color: #9ca3af;\n  opacity: 0.6;\n}";
styleInject(css_248z);

// ======================= 🌟 Constants & Interfaces =======================
// --- Todoist Colors by Name to Hex ---
const TODOIST_COLORS = {
    berry_red: "#b8256f",
    red: "#db4035",
    orange: "#ff9933",
    yellow: "#fad000",
    olive_green: "#afb83b",
    lime_green: "#7ecc49",
    green: "#299438",
    mint_green: "#6accbc",
    teal: "#158fad",
    sky_blue: "#14aaf5",
    light_blue: "#96c3eb",
    blue: "#4073ff",
    grape: "#884dff",
    violet: "#af38eb",
    lavender: "#eb96eb",
    magenta: "#e05194",
    salmon: "#ff8d85",
    charcoal: "#808080",
    grey: "#b8b8b8",
    taupe: "#ccac93"
};
// --- Selected Filter Index State ---
let selectedFilterIndex = 0;
const DEFAULT_SETTINGS = {
    apiKey: "",
    filters: [
        { icon: "star", filter: "today", title: "Today" },
        { icon: "hourglass", filter: "overdue", title: "Overdue" },
        { icon: "calendar-days", filter: "due after: today & due before: +4 days", title: "Next 3 days" },
        { icon: "moon", filter: "due after: today & due before: +30 days", title: "All upcoming tasks" },
        { icon: "inbox", filter: "no due date", title: "No due date" },
    ],
    compactMode: false
};
const EMPTY_IMAGE = new Image(1, 1);
EMPTY_IMAGE.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
function getProjectHexColor(task, projects) {
    const color = projects.find(p => p.id === task.project_id)?.color;
    return TODOIST_COLORS[color] || "#e5e7eb";
}
class TodoistBoardPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        // --- Cancellation token for filter rendering ---
        this.currentRenderToken = "";
        this.compactMode = false;
        this._globalClickListener = (e) => {
            const openDropdown = document.querySelector(".menu-dropdown:not(.hidden)");
            if (openDropdown)
                openDropdown.classList.add("hidden");
        };
        // ======================= 🔌 Plugin Class =======================
        this.cachedProjects = [];
        this.htmlCache = {};
        this.taskCache = {};
        this.projectCache = null;
        this.labelCache = null;
        this.taskCacheTimestamps = {};
        this.projectCacheTimestamp = 0;
        this.labelCacheTimestamp = 0;
    }
    async fetchFilteredTasksFromREST(apiKey, filter) {
        const url = `https://api.todoist.com/rest/v2/tasks?filter=${encodeURIComponent(filter)}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });
        const tasks = await response.json();
        return tasks;
    }
    async fetchMetadataFromSync(apiKey) {
        const response = await fetch("https://api.todoist.com/sync/v9/sync", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                sync_token: "*",
                resource_types: JSON.stringify(["all"])
            })
        });
        const data = await response.json();
        // Save projects and labels to localStorage with timestamp
        localStorage.setItem('todoistProjectsCache', JSON.stringify(data.projects || []));
        localStorage.setItem('todoistLabelsCache', JSON.stringify(data.labels || []));
        localStorage.setItem('todoistProjectsCacheTimestamp', String(Date.now()));
        localStorage.setItem('todoistLabelsCacheTimestamp', String(Date.now()));
        return {
            projects: data.projects || [],
            sections: data.sections || [],
            labels: data.labels || []
        };
    }
    async preloadFilters() {
        const now = Date.now();
        const cacheTTL = 24 * 60 * 60 * 1000;
        const filters = this.settings.filters || DEFAULT_SETTINGS.filters;
        await Promise.all(filters.map(async (f) => {
            const key = f.filter;
            const local = localStorage.getItem(`todoistTasksCache:${key}`);
            const timestamp = parseInt(localStorage.getItem(`todoistTasksCacheTimestamp:${key}`) || "0");
            if (local && now - timestamp < cacheTTL) {
                this.taskCache[key] = JSON.parse(local);
                this.taskCacheTimestamps[key] = timestamp;
                this.fetchFilteredTasksFromREST(this.settings.apiKey, key).then(tasks => {
                    const oldTasks = this.taskCache[key] || [];
                    const oldIds = new Set(oldTasks.map(t => t.id));
                    const newIds = new Set(tasks.map(t => t.id));
                    const hasChanges = oldTasks.length !== tasks.length ||
                        tasks.some(t => !oldIds.has(t.id)) ||
                        oldTasks.some(t => !newIds.has(t.id));
                    if (hasChanges) {
                        this.taskCache[key] = tasks;
                        this.taskCacheTimestamps[key] = Date.now();
                        localStorage.setItem(`todoistTasksCache:${key}`, JSON.stringify(tasks));
                        localStorage.setItem(`todoistTasksCacheTimestamp:${key}`, String(Date.now()));
                    }
                });
            }
            else {
                const tasks = await this.fetchFilteredTasksFromREST(this.settings.apiKey, key);
                this.taskCache[key] = tasks;
                this.taskCacheTimestamps[key] = now;
                localStorage.setItem(`todoistTasksCache:${key}`, JSON.stringify(tasks));
                localStorage.setItem(`todoistTasksCacheTimestamp:${key}`, String(now));
            }
        }));
    }
    async completeTask(taskId) {
        await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}/close`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.settings.apiKey}`,
                "Content-Type": "application/json"
            }
        });
        // Update badge count for current filter after completion
        const currentFilter = document.querySelector(".todoist-board")?.getAttribute("data-current-filter") || "";
        const badge = document.querySelector(`.filter-row[data-filter="${currentFilter}"] .filter-badge-count`);
        if (badge) {
            const cache = JSON.parse(localStorage.getItem(`todoistTasksCache:${currentFilter}`) || "[]");
            badge.textContent = String(Math.max(0, cache.length - 1));
        }
    }
    // ======================= 🚀 Plugin Load Lifecycle =======================
    async onload() {
        const data = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, data?.settings || {});
        this.addSettingTab(new TodoistBoardSettingTab(this.app, this));
        if (!this.settings.filters?.some(f => f.isDefault)) {
            if (this.settings.filters && this.settings.filters.length > 0) {
                this.settings.filters[0].isDefault = true;
            }
        }
        if (this.settings.filters && !this.settings.filters.some(f => f.isDefault)) {
            this.settings.filters.forEach((f, i) => f.isDefault = (i === 0));
        }
        // Set compactMode from settings or default to false
        this.compactMode = this.settings.compactMode ?? false;
        this.loadingOverlay = document.createElement("div");
        this.loadingOverlay.className = "loading-overlay";
        const spinner = document.createElement("div");
        spinner.className = "spinner";
        this.loadingOverlay.appendChild(spinner);
        this.registerDomEvent(this.loadingOverlay, "click", (e) => e.stopPropagation());
        this.registerMarkdownCodeBlockProcessor("todoist-board", async (source, el, ctx) => {
            // Add classes for code block container
            el.classList.add("block-language-todoist-board", "todoist-board");
            // --- PATCH: Add sourcePath fallback ---
            const sourcePath = ctx.sourcePath || "reading-mode-placeholder";
            let filter = "today";
            const match = source.match(/filter:\s*(.*)/);
            if (match) {
                filter = match[1].trim();
            }
            else {
                const defaultFilterObj = this.settings.filters?.find(f => f.isDefault);
                if (defaultFilterObj)
                    filter = defaultFilterObj.filter;
            }
            // Set data-current-filter attribute after determining filter
            el.setAttribute("data-current-filter", filter);
            // PATCH: fallback to localStorage if this.taskCache[filter] is undefined or not an array
            let preloadTasks = this.taskCache[filter];
            if (!Array.isArray(preloadTasks)) {
                const local = localStorage.getItem(`todoistTasksCache:${filter}`);
                preloadTasks = local ? JSON.parse(local) : [];
                this.taskCache[filter] = preloadTasks;
            }
            // Load project and label metadata from localStorage (if cache is fresh)
            const projLocal = localStorage.getItem('todoistProjectsCache');
            const projTimestamp = parseInt(localStorage.getItem('todoistProjectsCacheTimestamp') || "0");
            if (projLocal && Date.now() - projTimestamp < 24 * 60 * 60 * 1000) {
                this.projectCache = JSON.parse(projLocal);
                this.projectCacheTimestamp = projTimestamp;
            }
            const labelLocal = localStorage.getItem('todoistLabelsCache');
            const labelTimestamp = parseInt(localStorage.getItem('todoistLabelsCacheTimestamp') || "0");
            if (labelLocal && Date.now() - labelTimestamp < 24 * 60 * 60 * 1000) {
                this.labelCache = JSON.parse(labelLocal);
                this.labelCacheTimestamp = labelTimestamp;
            }
            const preloadMeta = {
                sections: [],
                projects: this.projectCache || [],
                labels: this.labelCache || []
            };
            // --- PATCH: Pass sourcePath instead of ctx.sourcePath ---
            // Reading mode detection: use .markdown-reading-view (modern Obsidian)
            el.closest(".markdown-reading-view") !== null;
            // (If needed, you can use isReadingMode in your logic below)
            this.renderTodoistBoard(el, source, sourcePath, this.settings.apiKey, {
                tasks: preloadTasks,
                ...preloadMeta
            });
        });
        // await this.preloadFilters();
        setTimeout(this.preloadFilters.bind(this), 500);
        // this.setupDoubleTapPrevention();
        // Ensure onLayoutReady is called with the correct `this` context (fixes TS/Rollup warning):
        setTimeout(this.onLayoutReady.bind(this), 1);
        // Immediately render default filter board using localStorage (skip waiting for DOM)
        // Replaced setTimeout with polling-based logic.
        const tryRenderInitial = () => {
            const defaultFilter = this.settings.filters?.find(f => f.isDefault)?.filter || "today";
            const boardContainer = document.querySelector(".todoist-board");
            if (boardContainer) {
                boardContainer.setAttribute("data-current-filter", defaultFilter);
                const cachedTasks = JSON.parse(localStorage.getItem(`todoistTasksCache:${defaultFilter}`) || "[]");
                this.renderTodoistBoard(boardContainer, `filter: ${defaultFilter}`, {}, this.settings.apiKey, {
                    tasks: cachedTasks,
                    projects: JSON.parse(localStorage.getItem("todoistProjectsCache") || "[]"),
                    labels: JSON.parse(localStorage.getItem("todoistLabelsCache") || "[]"),
                    sections: []
                });
                return true;
            }
            return false;
        };
        let tries = 0;
        const poll = setInterval(() => {
            if (tryRenderInitial() || ++tries > 40)
                clearInterval(poll);
        }, 50);
        document.addEventListener("click", this._globalClickListener);
    }
    // ======================= 🏁 Auto-render Default Filter on Startup =======================
    // This block ensures the default filter's board is rendered immediately after UI is ready.
    // Inserted at the end of onload().
    // It waits for DOM elements to be present, then triggers the default filter render.
    async onLayoutReady() {
        // Wait for DOM to be ready (filter bar and board container rendered)
        // We'll use a short interval to check for elements.
        const tryRenderDefault = () => {
            const defaultFilterEl = document.querySelector(".filter-icon[data-filter]");
            const container = document.querySelector(".todoist-board");
            if (defaultFilterEl && container) {
                const source = defaultFilterEl.getAttribute("data-filter") || "";
                container.setAttribute("data-current-filter", source);
                container.innerHTML = "";
                this.renderTodoistBoard(container, source, {}, this.settings?.apiKey || "");
                defaultFilterEl.classList.add("filter-selected");
                return true;
            }
            return false;
        };
        // Try immediately, then poll for up to 1s.
        if (tryRenderDefault())
            return;
        let tries = 0;
        setTimeout(() => { if (this.onLayoutReady)
            this.onLayoutReady(); }, 1);
        const interval = setInterval(() => {
            if (tryRenderDefault() || ++tries > 20)
                clearInterval(interval);
        }, 50);
    }
    // ======================= 🧹 Persistence & Cleanup =======================
    async savePluginData() {
        await this.saveData({ settings: this.settings });
    }
    onunload() {
        document.removeEventListener("click", this._globalClickListener);
        const dropdown = document.querySelector(".menu-dropdown-wrapper");
        if (dropdown)
            dropdown.remove();
    }
    // ======================= 🧱 Board Renderer =======================
    async renderTodoistBoard(container, source, ctx, apiKey, preloadData) {
        if (container.getAttribute("data-rendering") === "true")
            return;
        // --- Always proceed with rendering, even if same filter and task count ---
        const currentFilter = container.getAttribute("data-current-filter") || "";
        let tasks = [];
        try {
            const cachedTasksKey = `todoistTasksCache:${currentFilter}`;
            tasks = JSON.parse(localStorage.getItem(cachedTasksKey) || "[]");
        }
        catch (e) {
            tasks = [];
        }
        container.innerHTML = "";
        const currentKey = `${currentFilter}:${tasks?.length || 0}`;
        container.setAttribute("data-prev-render-key", currentKey);
        // --- Always use the latest tasks from localStorage, not memory ---
        // (already loaded as tasks above)
        // Sync in-memory cache with localStorage
        this.taskCache[currentFilter] = tasks;
        // PATCH: If no tasks or not an array, skip render and warn
        if (!tasks || !Array.isArray(tasks)) {
            container.removeAttribute("data-rendering");
            return;
        }
        if (this.loadingOverlay) {
            this.loadingOverlay.style.display = "flex";
        }
        try {
            this.setupContainer(container);
            container.classList.toggle("compact-mode", this.compactMode);
            const filterOptions = this.getFilterOptions();
            const rawSource = source;
            const hideToolbar = rawSource.includes("toolbar: false");
            source = this.getSourceOrDefault(rawSource, filterOptions);
            // Insert reading mode class logic after root .todoist-board element is created
            const todoistBoardEl = container;
            // Add class to handle reading mode layout
            if (container.closest(".markdown-reading-view")) {
                todoistBoardEl.classList.add("reading-mode");
            }
            const { toolbar, listWrapper } = this.createLayout(container);
            if (hideToolbar) {
                toolbar.classList.add("hide-toolbar");
                toolbar.style.display = "none";
            }
            if (!hideToolbar) {
                this.renderToolbar(toolbar, filterOptions, source, container, ctx, apiKey, listWrapper);
            }
            // Use tasks from localStorage to drive the rendering
            // (Pass as preloadData so renderTaskList uses them)
            // Also ensure we pass the latest metadata if available
            const meta = {
                sections: [],
                projects: this.projectCache || [],
                labels: this.labelCache || []
            };
            // --- PATCH: Remove filtering by sourcePath for tasks ---
            await this.renderTaskList(listWrapper, source, apiKey, { tasks, ...meta });
            // PATCH: Fetch metadata in background if stale, then re-render
            const now = Date.now();
            const metadataCacheTTL = 5 * 60 * 1000;
            const metadataFresh = this.projectCache && (now - this.projectCacheTimestamp < metadataCacheTTL);
            if (!metadataFresh) {
                this.fetchMetadataFromSync(apiKey).then(metadata => {
                    this.projectCache = metadata.projects;
                    this.labelCache = metadata.labels;
                    this.projectCacheTimestamp = now;
                    this.labelCacheTimestamp = now;
                    // Re-render the board with fresh metadata
                    this.renderTodoistBoard(container, source, ctx, apiKey);
                });
            }
            this.setupGlobalEventListeners();
            this.setupMutationObserver(container);
        }
        finally {
            if (this.loadingOverlay) {
                this.loadingOverlay.style.display = "none";
            }
            container.removeAttribute("data-rendering");
        }
    }
    setupContainer(container) {
        container.classList.add("todoist-board");
        container.onpointerup = () => {
            window.getSelection()?.removeAllRanges();
        };
        if (this.loadingOverlay && !container.contains(this.loadingOverlay)) {
            container.appendChild(this.loadingOverlay);
        }
    }
    createLayout(container) {
        container.empty();
        const listToolbar = document.createElement("div");
        listToolbar.className = "list-toolbar";
        container.appendChild(listToolbar);
        const listView = document.createElement("div");
        listView.classList.add("list-view");
        const listWrapper = document.createElement("div");
        listWrapper.className = "list-wrapper";
        listView.appendChild(listWrapper);
        container.appendChild(listView);
        return { toolbar: listToolbar, listWrapper };
    }
    getFilterOptions() {
        return (this.settings.filters && this.settings.filters.length > 0)
            ? this.settings.filters
            : DEFAULT_SETTINGS.filters;
    }
    getSourceOrDefault(source, filterOptions) {
        if (!source || !source.trim()) {
            const defaultFilterObj = filterOptions.find(f => f.isDefault) || filterOptions[0];
            return `filter: ${defaultFilterObj?.filter}`;
        }
        // Remove any 'toolbar:' line from the source
        return source
            .split("\n")
            .filter(line => !line.trim().toLowerCase().startsWith("toolbar:"))
            .join("\n");
    }
    // ======================= 🛠️ Toolbar Rendering =======================
    renderToolbar(toolbar, filterOptions, source, container, ctx, apiKey, listWrapper) {
        // Utility for div creation
        const createDiv = (opts = {}) => {
            const el = document.createElement("div");
            if (opts.cls)
                el.className = opts.cls;
            return el;
        };
        // Outer wrapper for the filter row
        const filterWrapper = createDiv({ cls: "filter-row-wrapper" });
        // Ensure filterBar is created with the proper class
        const filterBar = createDiv({ cls: "filter-bar" });
        // Try to match source string, fallback to isDefault, fallback to 0
        const matchIdx = filterOptions.findIndex((opt) => source.trim() === `filter: ${opt.filter}`);
        if (matchIdx !== -1) {
            selectedFilterIndex = matchIdx;
        }
        else if (typeof filterOptions.findIndex((f) => f.isDefault) === "number") {
            filterOptions.findIndex((f) => f.isDefault);
        }
        // Render all .filter-row elements (buttons)
        filterOptions.forEach((opt, idx) => {
            const filterRow = document.createElement("div");
            filterRow.className = "filter-row";
            filterRow.innerHTML = `<span class="filter-icon"></span><span class="filter-title">${opt.title}</span>`;
            filterRow.setAttribute("data-filter", opt.filter);
            const iconEl = filterRow.querySelector(".filter-icon");
            obsidian.setIcon(iconEl, opt.icon || "star");
            // --- Begin updated badge code with background and count layering ---
            const badge = document.createElement("span");
            badge.className = "filter-badge";
            const badgeBg = document.createElement("span");
            badgeBg.className = "filter-badge-bg";
            const badgeCount = document.createElement("span");
            badgeCount.className = "filter-badge-count";
            // Use localStorage to get the latest count for this filter
            const badgeTasksKey = `todoistTasksCache:${opt.filter}`;
            const badgeTasks = JSON.parse(localStorage.getItem(badgeTasksKey) || "[]");
            badgeCount.textContent = String(badgeTasks.length);
            badge.appendChild(badgeBg);
            badge.appendChild(badgeCount);
            // Assign the background color to the icon container instead
            if (opt.color) {
                filterRow?.style.setProperty('--badge-bg', opt.color);
                badge.style.color = 'white';
            }
            if (iconEl)
                iconEl.appendChild(badge);
            // --- End badge code ---
            // --- Begin conditional badge display logic ---
            if (idx !== selectedFilterIndex) {
                badge.style.display = "none";
            }
            // --- End conditional badge display logic ---
            if (idx === selectedFilterIndex) {
                filterRow.classList.add("selected");
            }
            // --- PATCH: Use addEventListener for click, with event handling for reading/live preview ---
            filterRow.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Clear selected class from all
                container.querySelectorAll(".filter-row").forEach(el => el.classList.remove("selected"));
                // Mark this one selected
                filterRow.classList.add("selected");
                // Update data-current-filter attribute
                const todoistBoardEl = container.closest(".todoist-board");
                if (todoistBoardEl) {
                    todoistBoardEl.dataset.currentFilter = opt.filter;
                }
                // Re-render with the selected filter
                this.renderTodoistBoard(container, `filter: ${opt.filter}`, {}, this.settings.apiKey);
            });
            filterBar.appendChild(filterRow);
        });
        // Add queue and settings/refresh buttons
        const queueWrapper = this.createQueueButton(listWrapper);
        const settingsRefreshWrapper = this.createSettingsRefreshButtons(container, source, ctx, apiKey);
        // filterBar.appendChild(queueWrapper); // Move queueWrapper out of filterBar
        // --- Wrap the filterBar with filterWrapper ---
        filterWrapper.appendChild(filterBar);
        // --- Begin: Add Capture (+) Button before settings/refresh buttons ---
        // Create Capture (+) Button using Obsidian icon
        const captureBtn = createSpan({ cls: "add-task-btn clickable-icon" });
        obsidian.setIcon(captureBtn, "circle-plus");
        captureBtn.title = "Add Task";
        captureBtn.style.marginRight = "6px";
        captureBtn.onclick = () => {
            this.openAddTaskModal();
        };
        // --- End: Add Capture (+) Button ---
        // Set queue icon color to black
        queueWrapper.querySelector(".queue-btn");
        toolbar.appendChild(filterWrapper);
        toolbar.appendChild(queueWrapper);
        toolbar.appendChild(captureBtn);
        toolbar.appendChild(settingsRefreshWrapper);
    }
    // ======================= ➕ Task Modal Content Builder =======================
    /**
     * Build a .taskmodal element for add/edit task.
     * @param fields - {title, description, due, projectId, labels}
     * @param submitLabel - string for submit button
     * @param onSubmit - callback({title, description, due, projectId, labels})
     * @returns HTMLElement (.taskmodal)
     */
    buildTaskModalContent(fields, submitLabel, onSubmit) {
        // Utility functions with taskmodal- prefix
        const createEl = (tag, opts = {}) => {
            const el = document.createElement(tag);
            if (opts.cls)
                el.className = opts.cls;
            if (opts.text)
                el.textContent = opts.text;
            if (opts.type)
                el.type = opts.type;
            if (opts.value !== undefined)
                el.value = opts.value;
            if (opts.attr)
                for (const k in opts.attr)
                    el.setAttribute(k, opts.attr[k]);
            return el;
        };
        const createDiv = (cls) => {
            if (typeof cls === "string") {
                return createEl("div", { cls });
            }
            return createEl("div");
        };
        // Outer wrapper
        const wrapper = createDiv("taskmodal-wrapper");
        // Title field
        const titleField = createDiv("taskmodal-title-field");
        const titleInput = createEl("input", { cls: "taskmodal-title-input", type: "text", value: fields.title ?? "" });
        titleInput.placeholder = "Task title";
        titleField.appendChild(titleInput);
        wrapper.appendChild(titleField);
        // Description field
        const descField = createDiv("taskmodal-description-field");
        const descInput = createEl("textarea", { cls: "taskmodal-description-input" });
        descInput.placeholder = "Description";
        descInput.value = fields.description ?? "";
        descField.appendChild(descInput);
        wrapper.appendChild(descField);
        // Date row
        const dateField = createDiv("taskmodal-date-field");
        const dateLabel = createEl("label", { cls: "taskmodal-date-label", text: "📅 Due Date" });
        const dateRow = createDiv("taskmodal-date-input-row");
        const dueInput = createEl("input", { cls: "taskmodal-date-input", type: "date", value: fields.due ?? "" });
        dueInput.placeholder = "Due date";
        const clearDateBtn = createEl("button", { cls: "taskmodal-clear-date", text: "✕" });
        clearDateBtn.title = "Clear Due Date";
        clearDateBtn.onclick = () => { dueInput.value = ""; };
        dateRow.appendChild(dueInput);
        dateRow.appendChild(clearDateBtn);
        dateField.appendChild(dateLabel);
        dateField.appendChild(dateRow);
        // Project select
        const projectField = createDiv("taskmodal-project-field");
        const projectLabel = createEl("label", { cls: "taskmodal-project-label", text: "🗂️ Project" });
        const projectSelect = createEl("select", { cls: "taskmodal-project-select" });
        const projects = this.cachedProjects.length > 0 ? this.cachedProjects : (this.projectCache || []);
        for (const project of projects) {
            const option = createEl("option");
            option.value = project.id;
            option.textContent = project.name;
            if (fields.projectId && project.id == fields.projectId) {
                option.selected = true;
            }
            projectSelect.appendChild(option);
        }
        projectField.appendChild(projectLabel);
        projectField.appendChild(projectSelect);
        // --- Group project and date fields into a row ---
        const projectAndDateRow = createDiv("taskmodal-row");
        projectAndDateRow.appendChild(projectField);
        projectAndDateRow.appendChild(dateField);
        wrapper.appendChild(projectAndDateRow);
        // Labels (checkbox list to match edit modal)
        const labelField = createDiv("taskmodal-labels-field");
        const labelLabel = createEl("label", { cls: "taskmodal-labels-label", text: "🏷️ Labels" });
        const labelList = createDiv("taskmodal-label-list");
        (this.labelCache || []).forEach((label) => {
            const labelCheckbox = createEl("label", { cls: "taskmodal-label-checkbox" });
            const checkbox = createEl("input", { type: "checkbox", attr: { value: label.name } });
            checkbox.checked = Array.isArray(fields.labels) && fields.labels.includes(label.name);
            labelCheckbox.appendChild(checkbox);
            labelCheckbox.append(label.name);
            labelList.appendChild(labelCheckbox);
        });
        labelField.appendChild(labelLabel);
        labelField.appendChild(labelList);
        wrapper.appendChild(labelField);
        // Button row
        const buttonRow = createDiv("taskmodal-button-row");
        const cancelBtn = createEl("button", { cls: "taskmodal-button-cancel", text: "Cancel" });
        // Cancel action is set by modal logic, not here
        const saveBtn = createEl("button", { cls: "taskmodal-button-save", text: submitLabel });
        saveBtn.onclick = async () => {
            const title = titleInput.value.trim();
            const description = descInput.value.trim();
            const due = dueInput.value;
            const projectId = projectSelect.value;
            const labels = Array.from(wrapper.querySelectorAll("input[type='checkbox']:checked")).map(input => input.value);
            if (!title)
                return;
            onSubmit({ title, description, due, projectId, labels });
        };
        buttonRow.appendChild(cancelBtn);
        buttonRow.appendChild(saveBtn);
        wrapper.appendChild(buttonRow);
        // Expose for modal logic: { titleInput, descInput, dueInput, projectSelect }
        wrapper._fields = {
            titleInput, descInput, dueInput, projectSelect
        };
        wrapper._cancelBtn = cancelBtn;
        return wrapper;
    }
    // --- Add Task Modal ---
    async openAddTaskModal() {
        const Modal = require("obsidian").Modal;
        const modal = new Modal(this.app);
        modal.containerEl.classList.add("todoist-edit-task-modal");
        // Ensure project and label data are loaded before rendering modal
        if (!this.projectCache || !this.labelCache) {
            const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
            this.projectCache = metadata.projects;
            this.labelCache = metadata.labels;
        }
        // After preloading filters, update badge count for current filter
        await this.preloadFilters();
        const currentFilter = document.querySelector(".todoist-board")?.getAttribute("data-current-filter") || "";
        const badge = document.querySelector(`.filter-row[data-filter="${currentFilter}"] .filter-badge-count`);
        if (badge) {
            const cache = JSON.parse(localStorage.getItem(`todoistTasksCache:${currentFilter}`) || "[]");
            badge.textContent = String(cache.length);
        }
        // Build modal content with empty fields
        const content = this.buildTaskModalContent({
            title: "",
            description: "",
            due: "",
            projectId: this.projectCache?.find((p) => p.name === "Inbox")?.id || undefined,
            labels: []
        }, "Add Task", async ({ title, description, due, projectId, labels }) => {
            await fetch("https://api.todoist.com/rest/v2/tasks", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.settings.apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: title,
                    description: description,
                    project_id: projectId || this.projectCache?.find((p) => p.name === "Inbox")?.id || undefined,
                    ...(due ? { due_date: due } : {}),
                    ...(labels && labels.length > 0 ? { labels } : {})
                })
            });
            modal.close();
            await this.preloadFilters();
            this.app.workspace.trigger("markdown-preview-rendered");
        });
        // Set cancel button to close modal
        content._cancelBtn.onclick = () => modal.close();
        modal.contentEl.appendChild(content);
        // Focus title input after modal is rendered
        setTimeout(() => {
            content._fields.titleInput?.focus();
        }, 10);
        modal.open();
    }
    // The createFilterGroup function is now unused in the new filter bar implementation.
    // ======================= 🔄 Filter Click Handling =======================
    async handleFilterClick(opt, container, ctx, apiKey) {
        const now = Date.now();
        // --- Render token logic to ensure only latest filter click is processed ---
        const renderToken = Date.now().toString();
        this.currentRenderToken = renderToken;
        const confirmedFilter = opt.filter;
        // --- Always trigger a full re-render, even if filter unchanged and task count same ---
        const local = localStorage.getItem(`todoistTasksCache:${opt.filter}`);
        const localTasks = local ? JSON.parse(local) : [];
        // Render from localStorage first (if available) for instant feedback
        this.taskCache[opt.filter] = localTasks;
        this.renderTodoistBoard(container, `filter: ${opt.filter}`, ctx, apiKey, {
            tasks: localTasks,
            sections: [],
            projects: this.projectCache || [],
            labels: this.labelCache || []
        });
        container.setAttribute("data-current-filter", opt.filter);
        // Immediately call the manual sync logic (force refresh)
        const tasks = await this.fetchFilteredTasksFromREST(apiKey, opt.filter);
        // --- Guarded block: check for stale render or filter switch ---
        if (this.currentRenderToken !== renderToken ||
            container.getAttribute("data-current-filter") !== confirmedFilter) {
            return;
        }
        this.taskCache[opt.filter] = tasks;
        const badge = document.querySelector(`.filter-row[data-filter="${opt.filter}"] .filter-badge-count`);
        if (badge)
            badge.textContent = String(tasks.length);
        this.taskCacheTimestamps[opt.filter] = now;
        localStorage.setItem(`todoistTasksCache:${opt.filter}`, JSON.stringify(tasks));
        localStorage.setItem(`todoistTasksCacheTimestamp:${opt.filter}`, String(now));
        this.renderTodoistBoard(container, `filter: ${opt.filter}`, ctx, apiKey, {
            tasks,
            sections: [],
            projects: this.projectCache || [],
            labels: this.labelCache || []
        });
        const metadata = await this.fetchMetadataFromSync(apiKey);
        this.projectCache = metadata.projects;
        this.labelCache = metadata.labels;
        this.projectCacheTimestamp = now;
        this.labelCacheTimestamp = now;
    }
    createQueueButton(listWrapper) {
        let queueActive = false;
        // Use Obsidian's icon system for the queue button (use "list" as example)
        const queueBtn = createSpan({ cls: "queue-btn clickable-icon" });
        obsidian.setIcon(queueBtn, "focus");
        queueBtn.title = "Queue tasks";
        queueBtn.onclick = () => {
            queueActive = !queueActive;
            this.updateQueueView(queueActive, listWrapper);
        };
        const queueWrapper = document.createElement("div");
        queueWrapper.className = "queue-wrapper";
        queueWrapper.appendChild(queueBtn);
        return queueWrapper;
    }
    createSettingsRefreshButtons(container, source, ctx, apiKey) {
        // Create a hamburger menu button
        const menuBtn = document.createElement("button");
        obsidian.setIcon(menuBtn, "menu");
        menuBtn.title = "Menu";
        menuBtn.classList.add("icon-button");
        // Create dropdown
        const menuDropdown = document.createElement("div");
        menuDropdown.className = "menu-dropdown hidden";
        // Settings option
        const settingsOption = document.createElement("div");
        // Insert icon span before text
        const settingsIcon = document.createElement("span");
        obsidian.setIcon(settingsIcon, "settings");
        settingsIcon.style.marginRight = "8px";
        settingsOption.appendChild(settingsIcon);
        settingsOption.className = "menu-dropdown-item";
        settingsOption.onclick = () => {
            menuDropdown.classList.add("hidden");
            this.openSettingsModal();
        };
        // Use append() instead of textContent to avoid overwriting icon
        settingsOption.append("Settings");
        // Manual Sync option
        const syncOption = document.createElement("div");
        // Insert icon span before text
        const syncIcon = document.createElement("span");
        obsidian.setIcon(syncIcon, "refresh-cw");
        syncIcon.style.marginRight = "8px";
        syncOption.appendChild(syncIcon);
        syncOption.className = "menu-dropdown-item";
        syncOption.onclick = async () => {
            menuDropdown.classList.add("hidden");
            // Manual Sync: Clear cache for the current filter, clear list view, trigger fresh render from API
            const currentFilter = container.getAttribute("data-current-filter") || "";
            // Remove cached tasks and timestamp for current filter
            localStorage.removeItem(`todoistTasksCache:${currentFilter}`);
            localStorage.removeItem(`todoistTasksCacheTimestamp:${currentFilter}`);
            // Find the list wrapper inside the container
            const listWrapper = container.querySelector(".list-wrapper");
            if (listWrapper) {
                listWrapper.innerHTML = "";
                const tasks = await this.fetchFilteredTasksFromREST(this.settings.apiKey, currentFilter);
                // --- Fetch and update project/label metadata as part of manual sync ---
                const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
                this.projectCache = metadata.projects;
                this.labelCache = metadata.labels;
                this.projectCacheTimestamp = Date.now();
                this.labelCacheTimestamp = Date.now();
                // ---
                this.taskCache[currentFilter] = tasks;
                const badge = document.querySelector(`.filter-row[data-filter="${currentFilter}"] .filter-badge-count`);
                if (badge)
                    badge.textContent = String(tasks.length);
                this.taskCacheTimestamps[currentFilter] = Date.now();
                localStorage.setItem(`todoistTasksCache:${currentFilter}`, JSON.stringify(tasks));
                localStorage.setItem(`todoistTasksCacheTimestamp:${currentFilter}`, String(Date.now()));
                const projects = this.projectCache || [];
                const labels = this.labelCache || [];
                this.renderTaskList(listWrapper, `filter: ${currentFilter}`, this.settings.apiKey, {
                    tasks,
                    projects,
                    labels
                });
            }
            else {
                // Also refresh metadata if not using a listWrapper
                const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
                this.projectCache = metadata.projects;
                this.labelCache = metadata.labels;
                this.projectCacheTimestamp = Date.now();
                this.labelCacheTimestamp = Date.now();
                this.renderTodoistBoard(container, source, ctx, this.settings.apiKey);
            }
        };
        // Use append() instead of textContent to avoid overwriting icon
        syncOption.append("Manual Sync");
        menuDropdown.appendChild(settingsOption);
        menuDropdown.appendChild(syncOption);
        const divider = document.createElement("div");
        divider.className = "menu-divider";
        menuDropdown.appendChild(divider);
        const compactOption = document.createElement("div");
        compactOption.className = "menu-dropdown-item";
        const compactIcon = document.createElement("span");
        obsidian.setIcon(compactIcon, "align-justify");
        compactIcon.style.marginRight = "8px";
        compactOption.appendChild(compactIcon);
        // Set the initial label based on this.compactMode
        compactOption.textContent = this.compactMode ? "Show Details" : "Compact Mode";
        compactOption.prepend(compactIcon);
        compactOption.onclick = () => {
            this.compactMode = !this.compactMode;
            this.settings.compactMode = this.compactMode;
            this.savePluginData();
            // --- PATCH: Update DOM class for compact mode in real-time ---
            const block = document.querySelector(".block-language-todoist-board");
            if (block) {
                if (this.settings.compactMode) {
                    block.classList.add("compact-mode");
                }
                else {
                    block.classList.remove("compact-mode");
                }
            }
            // New logic: Replace the block node to force a repaint in reading mode
            const currentBoard = document.querySelector(".todoist-board");
            if (currentBoard) {
                const parent = currentBoard.closest(".markdown-reading-view") || currentBoard.parentElement;
                if (parent) {
                    const cloned = currentBoard.cloneNode(true);
                    cloned.classList.toggle("compact-mode", this.compactMode);
                    currentBoard.replaceWith(cloned);
                }
                const currentFilter = currentBoard.getAttribute("data-current-filter") || "";
                const cachedTasks = JSON.parse(localStorage.getItem(`todoistTasksCache:${currentFilter}`) || "[]");
                const board = document.querySelector(".todoist-board");
                board.innerHTML = "";
                this.renderTodoistBoard(board, currentFilter, cachedTasks, { ctxId: "compactToggle" });
            }
            compactOption.textContent = this.compactMode ? "Show Details" : "Compact Mode";
            compactOption.prepend(compactIcon);
            // Hide the menu after toggling compact mode
            // @ts-ignore
            const menu = {
                hideAtMouseEvent: (evt) => {
                    menuDropdown.classList.add("hidden");
                }
            };
            menu.hideAtMouseEvent(new MouseEvent("click"));
        };
        menuDropdown.appendChild(compactOption);
        // --- PATCH: Wrap menuDropdown in a menu-dropdown-wrapper to prevent clipping ---
        const menuDropdownWrapper = document.createElement("div");
        menuDropdownWrapper.className = "menu-dropdown-wrapper";
        menuDropdownWrapper.appendChild(menuDropdown);
        // --- Move menuDropdownWrapper outside settingsRefreshWrapper and append to body ---
        // We'll store a reference for event handling.
        document.body.appendChild(menuDropdownWrapper);
        // --- By default, hide the dropdown ---
        menuDropdown.classList.add("hidden");
        // Toggle dropdown on menu button click, position absolutely below the button
        menuBtn.onclick = (e) => {
            e.stopPropagation();
            const rect = menuBtn.getBoundingClientRect();
            menuDropdownWrapper.style.position = "absolute";
            menuDropdownWrapper.style.top = `${rect.bottom + window.scrollY}px`;
            menuDropdownWrapper.style.left = `${rect.left + window.scrollX}px`;
            menuDropdown.classList.toggle("hidden");
        };
        // Hide dropdown on outside click
        document.addEventListener("click", (e) => {
            if (!menuDropdown.classList.contains("hidden")) {
                menuDropdown.classList.add("hidden");
            }
        });
        // Prevent click inside dropdown from closing it
        menuDropdown.addEventListener("click", (e) => {
            e.stopPropagation();
        });
        // --- Only the menuBtn is inside the wrapper now ---
        const settingsRefreshWrapper = document.createElement("div");
        settingsRefreshWrapper.className = "settings-refresh-wrapper";
        settingsRefreshWrapper.appendChild(menuBtn);
        // menuDropdownWrapper is now outside, not appended here
        return settingsRefreshWrapper;
    }
    createRefreshButton(container, source, ctx, apiKey) {
        const refreshBtn = document.createElement("button");
        refreshBtn.type = "button";
        obsidian.setIcon(refreshBtn, "refresh-cw");
        refreshBtn.title = "Force refresh cache";
        refreshBtn.classList.add("icon-button", "refresh-btn");
        refreshBtn.onclick = () => {
            requestAnimationFrame(() => {
                refreshBtn.classList.add("syncing");
                const selectedRow = document.querySelector(".filter-row.selected");
                selectedRow?.classList.add("syncing");
                requestAnimationFrame(async () => {
                    await this.preloadFilters();
                    setTimeout(() => {
                        refreshBtn.classList.remove("syncing");
                        selectedRow?.classList.remove("syncing");
                        this.renderTodoistBoard(container, source, ctx, apiKey);
                    }, 4000); // Delay to allow animation to register
                });
            });
        };
        return refreshBtn;
    }
    createSettingsButton() {
        const settingsBtn = document.createElement("span");
        obsidian.setIcon(settingsBtn, "settings");
        settingsBtn.title = "Edit toolbar filters";
        settingsBtn.className = "icon-button";
        settingsBtn.onclick = () => this.openSettingsModal();
        return settingsBtn;
    }
    async openSettingsModal() {
        let Modal;
        try {
            ({ Modal } = await import('obsidian'));
        }
        catch (e) {
            Modal = require("obsidian").Modal;
        }
        const modal = new Modal(this.app);
        modal.containerEl.classList.add("settings-modal");
        modal.titleEl.setText("Customize Toolbar Filters");
        if (!this.settings.filters)
            this.settings.filters = [];
        if (this.settings.filters.length === 0) {
            this.settings.filters.push({ icon: "⭐", filter: "today", title: "Today" });
        }
        // --- Table-based settings UI ---
        const renderSettingsUI = () => {
            const c = modal.contentEl;
            c.empty();
            const table = c.createEl("table", { cls: "settings-filter-table" });
            const thead = table.createEl("thead");
            const headRow = thead.createEl("tr");
            ["Icon", "Title", "Filter", "Default", "Delete"].forEach(text => {
                headRow.createEl("th", { text });
            });
            const tbody = table.createEl("tbody");
            // --- Helper to render a single filter row ---
            const renderFilterRow = (f, idx) => {
                const thisFilter = this.settings.filters[idx];
                const row = tbody.createEl("tr");
                // Icon picker trigger and popup
                const iconCell = row.createEl("td");
                // Trigger div
                const iconTrigger = iconCell.createDiv({ cls: "icon-trigger" });
                iconTrigger.innerHTML = "";
                obsidian.setIcon(iconTrigger, f.icon || "star");
                iconTrigger.style.cursor = "pointer";
                iconTrigger.style.fontSize = "1.6em";
                iconTrigger.style.border = "1px solid #ccc";
                iconTrigger.style.borderRadius = "6px";
                iconTrigger.style.width = "36px";
                iconTrigger.style.height = "36px";
                iconTrigger.style.display = "flex";
                iconTrigger.style.alignItems = "center";
                iconTrigger.style.justifyContent = "center";
                iconTrigger.style.position = "relative";
                // Picker wrapper (popup)
                const iconPickerWrapper = iconCell.createDiv({ cls: "icon-picker-wrapper" });
                iconPickerWrapper.classList.remove("visible");
                // --- Scroll styling for icon picker ---
                iconPickerWrapper.style.maxHeight = "160px";
                iconPickerWrapper.style.overflowY = "auto";
                // --- Color Picker Row ---
                const colorRow = iconPickerWrapper.createDiv({ cls: "icon-color-row" });
                // 24 handpicked, aesthetically pleasing and commonly used colors
                const colors = [
                    "#FF6B6B", "#F06595", "#CC5DE8", "#845EF7", "#5C7CFA", "#339AF0",
                    "#22B8CF", "#20C997", "#51CF66", "#94D82D", "#FCC419", "#FF922B",
                    "#FF6B00", "#FFD43B", "#A9E34B", "#69DB7C", "#38D9A9", "#4DABF7",
                    "#748FFC", "#9775FA", "#DA77F2", "#F783AC", "#FF8787", "#FF9F40"
                ];
                colors.forEach(color => {
                    const swatch = document.createElement("div");
                    swatch.className = "icon-color-swatch";
                    swatch.style.background = color;
                    swatch.onclick = () => {
                        iconTrigger.querySelector("svg")?.setAttribute("stroke", color);
                        thisFilter.color = color;
                    };
                    colorRow.appendChild(swatch);
                });
                // Add a final "custom" swatch (color input)
                const customColor = document.createElement("input");
                customColor.type = "color";
                customColor.className = "icon-color-picker";
                customColor.style.padding = "0";
                customColor.style.border = "2px solid #ccc";
                customColor.style.background = "conic-gradient(red, orange, yellow, green, cyan, blue, violet, red)";
                customColor.style.cursor = "pointer";
                customColor.oninput = () => {
                    iconTrigger.querySelector("svg")?.setAttribute("stroke", customColor.value);
                    thisFilter.color = customColor.value;
                };
                colorRow.appendChild(customColor);
                // Use extended Obsidian icon set for icon picker (100 icons)
                const obsidianIcons = [
                    "check", "calendar", "star", "heart", "search", "plus", "trash", "pencil", "folder", "document",
                    "file-plus", "anchor", "zap", "settings", "book-open", "box", "bug", "camera", "cast", "cloud",
                    "command", "compass", "database", "download", "eye", "flag", "globe", "image", "key", "layers",
                    "link", "list", "lock", "map", "mic", "moon", "music", "pause", "phone", "refresh-cw", "save",
                    "scissors", "send", "share", "shield", "shopping-cart", "sliders", "sun", "terminal", "thumbs-up",
                    "toggle-left", "trash-2", "trending-up", "upload", "user", "video", "watch", "wifi", "x-circle",
                    "alarm-clock", "bell", "briefcase", "clipboard", "coffee", "credit-card", "disc", "dollar-sign",
                    "edit-2", "fast-forward", "file-text", "film", "gift", "hand", "home", "inbox", "info", "layout",
                    "lightbulb", "list-checks", "loader", "log-in", "log-out", "menu", "message-circle", "navigation",
                    "notebook", "package", "palette", "paperclip", "play", "printer", "repeat", "rss", "server", "shopping-bag",
                    "sidebar", "smile", "timer", "target", "toggle-right", "swords", "truck", "umbrella", "wallet", "zap-off"
                ];
                // Move colorRow to the top of the picker UI (before icon grid)
                iconPickerWrapper.appendChild(colorRow);
                obsidianIcons.forEach(iconName => {
                    const iconBtn = document.createElement("span");
                    iconBtn.className = "icon-grid-btn";
                    obsidian.setIcon(iconBtn, iconName);
                    iconBtn.title = iconName;
                    if (f.icon === iconName)
                        iconBtn.classList.add("selected");
                    iconBtn.onclick = (e) => {
                        e.preventDefault();
                        thisFilter.icon = iconName;
                        iconTrigger.innerHTML = "";
                        obsidian.setIcon(iconTrigger, iconName);
                        iconPickerWrapper.classList.remove("visible");
                        iconPickerWrapper.querySelectorAll(".icon-grid-btn").forEach((b) => b.classList.remove("selected"));
                        iconBtn.classList.add("selected");
                    };
                    iconPickerWrapper.appendChild(iconBtn);
                });
                iconTrigger.onclick = (e) => {
                    e.stopPropagation();
                    // Close all other pickers
                    document.querySelectorAll(".icon-picker-wrapper.visible").forEach((el) => {
                        if (el !== iconPickerWrapper)
                            el.classList.remove("visible");
                    });
                    // Toggle this one
                    iconPickerWrapper.classList.toggle("visible");
                };
                // Title input
                const titleCell = row.createEl("td");
                const titleInput = titleCell.createEl("input", { type: "text" });
                titleInput.value = f.title || "";
                titleInput.oninput = () => f.title = titleInput.value;
                // Filter input
                const filterCell = row.createEl("td");
                const filterInput = filterCell.createEl("input", { type: "text" });
                filterInput.value = f.filter || "";
                filterInput.oninput = () => f.filter = filterInput.value;
                // Default radio
                const defaultCell = row.createEl("td");
                const defaultInput = defaultCell.createEl("input", { type: "radio" });
                defaultInput.name = "default-filter";
                defaultInput.checked = !!f.isDefault;
                defaultInput.onchange = () => {
                    this.settings.filters.forEach((_, i) => this.settings.filters[i].isDefault = (i === idx));
                };
                // Delete button
                const deleteCell = row.createEl("td");
                const deleteBtn = deleteCell.createEl("button");
                obsidian.setIcon(deleteBtn, "trash-2");
                deleteBtn.querySelector("svg")?.removeAttribute("fill"); // Ensure it's stroke-only
                deleteBtn.className = "icon-button";
                deleteBtn.onclick = () => {
                    this.settings.filters.splice(idx, 1);
                    row.remove(); // Just remove the row instead of rerendering everything
                };
            };
            // Render all filter rows
            this.settings.filters.forEach((f, idx) => {
                renderFilterRow(f, idx);
            });
            // Add button
            const addRow = c.createEl("div", { cls: "settings-action-row" });
            const addBtn = addRow.createEl("button", { text: "➕ Add Filter" });
            addBtn.onclick = () => {
                const newFilter = { icon: "❔", title: "", filter: "" };
                this.settings.filters.push(newFilter);
                renderFilterRow(newFilter, this.settings.filters.length - 1);
            };
            // Save and Clear buttons
            const saveRow = c.createEl("div", { cls: "settings-save-row" });
            const saveBtn = saveRow.createEl("button", { text: "Save" });
            saveBtn.onclick = async () => {
                if (!this.settings.filters.some(f => f.isDefault)) {
                    this.settings.filters[0].isDefault = true;
                }
                // Ensure the filters array is updated (including color)
                this.settings.filters = [...this.settings.filters];
                await this.savePluginData();
                // Reset filter index state to reflect the first/default filter after changes
                selectedFilterIndex = 0;
                // Optionally trigger markdown rendering again
                this.app.workspace.trigger("markdown-preview-rendered");
                // --- PATCH: Force all todoist-board containers to rerender before closing modal ---
                document.querySelectorAll(".todoist-board").forEach((el) => {
                    const container = el;
                    const source = container.getAttribute("data-current-filter") || "";
                    container.innerHTML = "";
                    this.renderTodoistBoard(container, source, {}, (this.settings && this.settings.apiKey) || "");
                });
                modal.close();
                // After closing the modal, force rerender of all matching code blocks after a slight delay
                setTimeout(() => {
                    const markdownEls = document.querySelectorAll("pre > code.language-todoist-board");
                    markdownEls.forEach((el) => {
                        const pre = el.parentElement;
                        const container = document.createElement("div");
                        pre.replaceWith(container);
                        const source = el.textContent?.trim() || "";
                        this.renderTodoistBoard(container, source, {}, this.settings.apiKey);
                    });
                }, 100);
            };
            const clearCacheBtn = saveRow.createEl("button");
            clearCacheBtn.style.padding = "6px 6px";
            clearCacheBtn.style.marginTop = "4px";
            const iconSpan = document.createElement("span");
            iconSpan.style.marginRight = "6px";
            obsidian.setIcon(iconSpan, "x-circle");
            clearCacheBtn.appendChild(iconSpan);
            clearCacheBtn.append("Clear Cache");
            clearCacheBtn.onclick = () => {
                // Only clear task/project/label caches, not UI/layout or icon settings
                for (const key in localStorage) {
                    if (key.startsWith("todoistTasksCache:") ||
                        key.startsWith("todoistTasksCacheTimestamp:") ||
                        key.startsWith("todoistProjectsCache") ||
                        key.startsWith("todoistLabelsCache")) {
                        localStorage.removeItem(key);
                    }
                }
                // Notification to user (Obsidian-compatible, fallback-safe)
                // @ts-ignore
                new window.Notice("Todoist task cache cleared. Plugin will re-fetch data.");
            };
            // After saveRow is created and appended, add the global click handler for icon picker wrappers
            modal.containerEl.addEventListener("mousedown", (e) => {
                document.querySelectorAll(".icon-picker-wrapper.visible").forEach((el) => {
                    const trigger = el.previousElementSibling;
                    if (!el.contains(e.target) && !trigger?.contains(e.target)) {
                        el.classList.remove("visible");
                    }
                });
            });
        };
        renderSettingsUI();
        modal.open();
    }
    // ======================= 📋 Task List Rendering =======================
    async renderTaskList(listWrapper, source, apiKey, preloadData) {
        const match = source.match(/filter:\s*(.*)/);
        const filters = match ? match[1].split(",").map(f => f.trim()) : ["today"];
        // --- PATCH: preloadData block ---
        if (preloadData) {
            const { tasks, projects, labels } = preloadData;
            const projectMap = Object.fromEntries(projects.map(p => [p.id, p.name]));
            const labelMap = Object.fromEntries((labels ?? []).map(l => [l.id, l.name]));
            const labelColorMap = Object.fromEntries((labels ?? []).map(l => [l.id, l.color]));
            const orderKey = `todoistBoardOrder:${filters.join(",")}`;
            const savedOrder = JSON.parse(localStorage.getItem(orderKey) || "[]");
            tasks.sort((a, b) => {
                const idxA = savedOrder.indexOf(a.id);
                const idxB = savedOrder.indexOf(b.id);
                return (idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA) -
                    (idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB);
            });
            // --- Group subtasks by parent_id ---
            const subtasksByParentId = {};
            tasks.forEach(task => {
                if (task.parent_id) {
                    if (!subtasksByParentId[task.parent_id])
                        subtasksByParentId[task.parent_id] = [];
                    subtasksByParentId[task.parent_id].push(task);
                }
            });
            // --- Only render parent tasks and their subtasks ---
            for (const task of tasks) {
                if (task.parent_id)
                    continue; // skip subtasks in top-level loop
                if (task.content?.trim().startsWith("* ")) {
                    const clonedTask = { ...task, content: task.content.trim().substring(2) };
                    const row = this.createTaskRow(clonedTask, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
                    row.classList.add("non-task-note");
                    this.setupTaskDragAndDrop(row, listWrapper, filters);
                    listWrapper.appendChild(row);
                    continue;
                }
                const row = this.createTaskRow(task, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
                // Only setup drag-and-drop for parent tasks
                this.setupTaskDragAndDrop(row, listWrapper, filters);
                listWrapper.appendChild(row);
                // --- PATCH: fallback to global subtask lookup if not found in subtasksByParentId ---
                const allSubtasks = Object.values(this.taskCache).flat().filter((t) => t.parent_id === task.id);
                const subtasks = allSubtasks.length > 0 ? allSubtasks : (subtasksByParentId[task.id] || []);
                // --- Render subtasks directly nested inside parent row, INSIDE task-content-wrapper ---
                if (subtasks.length > 0) {
                    const subtaskWrapper = document.createElement("div");
                    subtaskWrapper.className = "subtask-wrapper";
                    for (const sub of subtasks) {
                        const subRow = this.createTaskRow(sub, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
                        subRow.classList.add("subtask-row");
                        // Clean up subtask UI (remove metadata, chin, description)
                        const meta = subRow.querySelector(".task-metadata");
                        if (meta)
                            meta.remove();
                        const desc = subRow.querySelector(".task-description");
                        if (desc)
                            desc.remove();
                        const chin = subRow.querySelector(".fixed-chin");
                        if (chin)
                            chin.remove();
                        subtaskWrapper.appendChild(subRow);
                    }
                    // PATCH: Insert into task-content-wrapper if exists, else fallback to row
                    const contentWrapper = row.querySelector('.task-content-wrapper');
                    if (contentWrapper) {
                        contentWrapper.appendChild(subtaskWrapper);
                    }
                    else {
                        row.appendChild(subtaskWrapper);
                    }
                }
            }
            // --- Insert empty quote if no tasks ---
            if (tasks.length === 0) {
                const quoteDiv = document.createElement("div");
                quoteDiv.className = "empty-filter";
                quoteDiv.textContent = "No tasks found for this filter.";
                listWrapper.appendChild(quoteDiv);
            }
            return;
        }
        const now = Date.now();
        const cacheTTL = 24 * 60 * 60 * 1000;
        let projects = [];
        let labels = [];
        let metadata;
        const metadataCacheTTL = 24 * 60 * 60 * 1000;
        const metadataTimestamp = this.projectCacheTimestamp;
        const metadataFresh = this.projectCache && (now - metadataTimestamp < metadataCacheTTL);
        if (metadataFresh) {
            projects = this.projectCache;
            labels = this.labelCache;
            metadata = { projects, sections: [], labels };
        }
        else {
            metadata = await this.fetchMetadataFromSync(apiKey);
            projects = metadata.projects;
            labels = metadata.labels;
            this.projectCache = projects;
            this.labelCache = labels;
            this.projectCacheTimestamp = now;
            this.labelCacheTimestamp = now;
        }
        let tasks = [];
        const filter = filters[0];
        const taskTimestamp = this.taskCacheTimestamps[filter] || 0;
        const useCache = this.taskCache[filter] && (now - taskTimestamp < cacheTTL);
        if (useCache) {
            tasks = this.taskCache[filter];
        }
        else {
            tasks = await this.fetchFilteredTasksFromREST(apiKey, filter);
            this.taskCache[filter] = tasks;
            this.taskCacheTimestamps[filter] = now;
        }
        const projectMap = Object.fromEntries(projects.map((p) => [p.id, p.name]));
        const labelMap = Object.fromEntries((labels ?? []).map((l) => [l.id, l.name]));
        const labelColorMap = Object.fromEntries((labels ?? []).map((l) => [l.id, l.color]));
        const orderKey = `todoistBoardOrder:${filters.join(",")}`;
        const savedOrder = JSON.parse(localStorage.getItem(orderKey) || "[]");
        tasks.sort((a, b) => {
            const idxA = savedOrder.indexOf(a.id);
            const idxB = savedOrder.indexOf(b.id);
            return (idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA) -
                (idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB);
        });
        // --- Group subtasks by parent_id for non-preloadData path ---
        const subtasksByParentId = {};
        tasks.forEach(task => {
            if (task.parent_id) {
                if (!subtasksByParentId[task.parent_id])
                    subtasksByParentId[task.parent_id] = [];
                subtasksByParentId[task.parent_id].push(task);
            }
        });
        for (const task of tasks) {
            if (task.parent_id)
                continue; // skip subtasks in top-level loop
            if (task.content?.trim().startsWith("* ")) {
                const clonedTask = { ...task, content: task.content.trim().substring(2) };
                const row = this.createTaskRow(clonedTask, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
                row.classList.add("non-task-note");
                this.setupTaskDragAndDrop(row, listWrapper, filters);
                listWrapper.appendChild(row);
                continue;
            }
            const row = this.createTaskRow(task, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
            // Only setup drag-and-drop for parent tasks
            this.setupTaskDragAndDrop(row, listWrapper, filters);
            listWrapper.appendChild(row);
            // --- PATCH: fallback to global subtask lookup if not found in subtasksByParentId ---
            const allSubtasks = Object.values(this.taskCache).flat().filter((t) => t.parent_id === task.id);
            const subtasks = allSubtasks.length > 0 ? allSubtasks : (subtasksByParentId[task.id] || []);
            // --- Render subtasks directly nested inside parent row ---
            if (subtasks.length > 0) {
                const subtaskWrapper = document.createElement("div");
                subtaskWrapper.className = "subtask-wrapper";
                for (const sub of subtasks) {
                    const subRow = this.createTaskRow(sub, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters);
                    subRow.classList.add("subtask-row");
                    // Clean up subtask UI (remove metadata, chin, description)
                    const meta = subRow.querySelector(".task-metadata");
                    if (meta)
                        meta.remove();
                    const desc = subRow.querySelector(".task-description");
                    if (desc)
                        desc.remove();
                    const chin = subRow.querySelector(".fixed-chin");
                    if (chin)
                        chin.remove();
                    subtaskWrapper.appendChild(subRow);
                }
                row.appendChild(subtaskWrapper);
            }
        }
        // --- Insert empty quote if no tasks ---
        if (tasks.length === 0) {
            const quoteDiv = document.createElement("div");
            quoteDiv.className = "empty-filter";
            quoteDiv.textContent = "No tasks found for this filter.";
            listWrapper.appendChild(quoteDiv);
        }
        try {
            if (source && source.trim().startsWith("filter:")) {
                localStorage.setItem("todoistBoardLastFilter", source.trim());
            }
        }
        catch (e) { }
    }
    // ======================= 🧩 Task Row Creation =======================
    createTaskRow(task, projectMap, labelMap, labelColorMap, projects, apiKey, listWrapper, filters) {
        const row = document.createElement("div");
        // --- PATCH: Apply .non-task-note class if original content starts with "* " ---
        if (task.content?.trim().startsWith("* ")) {
            row.classList.add("non-task-note");
        }
        row.classList.add("task");
        row.dataset.id = task.id;
        // PATCH: Set the row id to the task id for later DOM removal
        row.id = task.id;
        // Set project color CSS variable
        row.style.setProperty("--project-color", getProjectHexColor(task, projects));
        // --- PATCH: Add "parent-task" class if task has children (by parent_id) ---
        const hasChildren = Object.values(this.taskCache).flat().some((t) => t.parent_id === task.id);
        if (hasChildren) {
            row.classList.add("parent-task");
        }
        // --- PATCH: Add repeating task icon if task is recurring ---
        const isRepeating = !!task.due?.is_recurring;
        if (isRepeating) {
            const repeatIcon = document.createElement("span");
            repeatIcon.classList.add("repeat-icon");
            obsidian.setIcon(repeatIcon, "repeat");
            row.appendChild(repeatIcon);
        }
        // --- PATCH: Replace task-inner with scroll wrapper and fixed chin ---
        const scrollWrapper = document.createElement("div");
        scrollWrapper.className = "task-scroll-wrapper";
        const taskInner = document.createElement("div");
        taskInner.className = "task-inner";
        const fixedChin = document.createElement("div");
        fixedChin.className = "fixed-chin";
        scrollWrapper.appendChild(taskInner);
        scrollWrapper.appendChild(fixedChin);
        // Determine if this is a non-task note (content starts with '* ')
        const isNote = task.content?.trim().startsWith("* ");
        if (isNote) {
            const noteContent = document.createElement("div");
            noteContent.className = "task-content";
            const titleSpan = document.createElement("span");
            titleSpan.className = "task-title";
            titleSpan.textContent = task.content.trim().substring(2);
            noteContent.appendChild(titleSpan);
            taskInner.appendChild(noteContent);
            row.appendChild(scrollWrapper);
        }
        else {
            this.setupTaskInteractions(row, task, taskInner, apiKey, listWrapper, filters);
            const rowCheckbox = this.createPriorityCheckbox(task.priority, async () => {
                if (rowCheckbox.checked) {
                    await this.completeTask(task.id);
                    const taskRow = document.getElementById(task.id);
                    if (taskRow)
                        taskRow.remove();
                    await this.savePluginData();
                    this.handleQueueCompletion(listWrapper);
                }
            });
            rowCheckbox.classList.add(`priority-${task.priority}`);
            // PATCH: Move checkbox out of .task-inner and into .task before scrollWrapper
            row.appendChild(rowCheckbox);
            // --- PATCH: Insert parent-icon using setIcon if hasChildren, after checkbox, before scrollWrapper ---
            if (hasChildren) {
                const icon = document.createElement("span");
                icon.classList.add("parent-icon");
                obsidian.setIcon(icon, "list-tree");
                row.appendChild(icon);
            }
            row.appendChild(scrollWrapper);
            const left = this.createTaskContent(task, projectMap, labelMap, labelColorMap, projects);
            taskInner.appendChild(left);
            const deadline = this.createTaskDeadline(task);
            row.appendChild(deadline);
        }
        return row;
    }
    setupTaskInteractions(row, task, taskInner, apiKey, listWrapper, filters) {
        let tapStartX = 0;
        let tapStartY = 0;
        row.addEventListener("pointerdown", (e) => {
            if (row.classList.contains("subtask-row"))
                return;
            tapStartX = e.clientX;
            tapStartY = e.clientY;
        });
        row.addEventListener("pointerup", (e) => {
            const isCheckbox = e.target.closest('input[type="checkbox"]');
            if (isCheckbox)
                return;
            const dx = Math.abs(e.clientX - tapStartX);
            const dy = Math.abs(e.clientY - tapStartY);
            if (dx > 5 || dy > 5)
                return;
            e.stopPropagation();
            // --- Subtask expand/collapse logic ---
            if (row.classList.contains("subtask-row")) {
                const alreadyExpanded = row.classList.contains("expanded-subtask");
                document.querySelectorAll(".subtask-row.expanded-subtask").forEach(el => {
                    el.classList.remove("expanded-subtask");
                });
                if (!alreadyExpanded) {
                    row.classList.add("expanded-subtask");
                }
                return;
            }
            // Instead of handling subtask-row here, let handleTaskSelection handle it with event
            this.handleTaskSelection(row, task, apiKey, e);
        });
        this.setupTaskDragAndDrop(row, listWrapper, filters);
    }
    handleTaskSelection(row, task, apiKey, event) {
        // If the event originated from within a subtask-row, skip parent selection/deselection
        if (event) {
            const target = event.target;
            if (target.closest(".subtask-row"))
                return;
        }
        // If already selected, deselect on second click
        if (row.classList.contains("selected-task")) {
            this.deselectTask(row);
            return;
        }
        const titleSpan = row.querySelector(".task-title");
        const rowCheckbox = row.querySelector("input[type='checkbox']");
        const metaSpan = row.querySelector(".task-metadata");
        // Add no-transition and freeze-transition classes as per new logic
        document.querySelectorAll('.task').forEach(t => {
            t.classList.add('no-transition');
            if (!t.classList.contains('selected-task')) {
                t.classList.add('freeze-transition');
            }
        });
        // Updated deselection logic to allow simultaneous deselect and select transitions
        document.querySelectorAll(".selected-task").forEach(el => {
            if (el !== row) {
                el.classList.add("task-deselecting");
                el.classList.remove("selected-task");
                setTimeout(() => {
                    el.classList.remove("task-deselecting");
                    const titleSpan = el.querySelector(".task-title");
                    const rowCheckbox = el.querySelector("input[type='checkbox']");
                    const metaSpan = el.querySelector(".task-metadata");
                    const desc = el.querySelector(".task-description");
                    if (titleSpan)
                        titleSpan.classList.remove("task-title-selected");
                    if (rowCheckbox)
                        rowCheckbox.classList.remove("task-checkbox-selected");
                    if (metaSpan)
                        metaSpan.classList.remove("task-meta-selected");
                    if (desc)
                        desc.classList.remove("show-description");
                    const toolbar = document.getElementById("mini-toolbar");
                    if (toolbar)
                        toolbar.remove();
                }, 300);
            }
        });
        // Apply new selection immediately
        row.classList.add("selected-task");
        if (row.classList.contains("selected-task")) {
            this.selectTask(row, task, titleSpan, rowCheckbox, metaSpan, apiKey);
            // Remove transition classes after selecting the new task
            requestAnimationFrame(() => {
                document.querySelectorAll('.task').forEach(t => {
                    t.classList.remove('no-transition');
                    t.classList.remove('freeze-transition');
                });
            });
        }
        else {
            this.deselectTask(row);
            // Remove transition classes after frame if deselecting
            requestAnimationFrame(() => {
                document.querySelectorAll('.task').forEach(t => {
                    t.classList.remove('no-transition');
                    t.classList.remove('freeze-transition');
                });
            });
        }
    }
    // ======================= ✴️ Task Selection Logic =======================
    selectTask(row, task, titleSpan, rowCheckbox, metaSpan, apiKey) {
        titleSpan.classList.add("task-title-selected");
        rowCheckbox.classList.add("task-checkbox-selected");
        metaSpan.classList.add("task-meta-selected");
        row.classList.add("selected-task");
        // Removed code that adds .show-description to .task-description
        this.createMiniToolbar(row, task, apiKey);
        // No dynamic transform here; handled by CSS.
    }
    deselectTask(row) {
        // row.classList.add("task-deselecting"); // Removed as per instructions
        const toolbar = document.getElementById("mini-toolbar");
        if (toolbar)
            toolbar.remove();
        setTimeout(() => {
            row.classList.remove("selected-task", "task-deselecting");
            const titleSpan = row.querySelector(".task-title");
            const rowCheckbox = row.querySelector("input[type='checkbox']");
            const metaSpan = row.querySelector(".task-metadata");
            const desc = row.querySelector(".task-description");
            if (titleSpan)
                titleSpan.classList.remove("task-title-selected");
            if (rowCheckbox)
                rowCheckbox.classList.remove("task-checkbox-selected");
            if (metaSpan) {
                metaSpan.classList.remove("task-meta-selected");
                // Remove transform reset; handled by CSS now.
            }
            if (desc)
                desc.classList.remove("show-description");
        }, 200);
    }
    // ======================= 🧰 Mini Toolbar =======================
    createMiniToolbar(row, task, apiKey) {
        const oldWrapper = document.getElementById("mini-toolbar-wrapper");
        if (oldWrapper)
            oldWrapper.remove();
        const wrapper = document.createElement("div");
        wrapper.id = "mini-toolbar-wrapper";
        wrapper.className = "mini-toolbar-wrapper fixed-chin";
        const chinContainer = document.createElement("div");
        chinContainer.className = "chin-inner";
        // Today button
        const todayBtn = document.createElement("button");
        todayBtn.className = "chin-btn today-btn";
        obsidian.setIcon(todayBtn, "calendar");
        todayBtn.append("Today");
        todayBtn.setAttribute("data-index", "0");
        todayBtn.onclick = () => this.setTaskToToday(task.id, apiKey, chinContainer, todayBtn);
        // Add date subtitle after SVG icon
        const subtitle = document.createElement("p");
        subtitle.className = "date-subtitle";
        // Show today's date as just the day of the month
        subtitle.textContent = String(new Date().getDate());
        todayBtn.appendChild(subtitle);
        chinContainer.appendChild(todayBtn);
        // Tomorrow button
        const tmrwBtn = document.createElement("button");
        tmrwBtn.className = "chin-btn tomorrow-btn";
        obsidian.setIcon(tmrwBtn, "sunrise");
        tmrwBtn.append("Tmrw");
        tmrwBtn.setAttribute("data-index", "1");
        tmrwBtn.onclick = () => this.deferTask(task.id, apiKey, chinContainer);
        chinContainer.appendChild(tmrwBtn);
        // Edit button
        const editBtn = document.createElement("button");
        editBtn.className = "chin-btn edit-btn";
        obsidian.setIcon(editBtn, "pencil");
        editBtn.append("Edit");
        editBtn.setAttribute("data-index", "2");
        editBtn.onclick = () => {
            let filters = [];
            const board = row.closest(".todoist-board");
            if (board && board.hasAttribute("data-current-filter")) {
                filters = [board.getAttribute("data-current-filter")];
            }
            if (!filters.length)
                filters = ["today"];
            this.openEditTaskModal(task, row, filters);
        };
        chinContainer.appendChild(editBtn);
        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "chin-btn delete-btn";
        obsidian.setIcon(deleteBtn, "trash");
        deleteBtn.setAttribute("data-index", "3");
        deleteBtn.onclick = () => this.deleteTask(task.id, apiKey, chinContainer);
        chinContainer.appendChild(deleteBtn);
        wrapper.appendChild(chinContainer);
        row.appendChild(wrapper);
        wrapper.addEventListener("click", (e) => e.stopPropagation());
    }
    // ======================= ✏️ Edit Task Modal =======================
    // --- Edit Task Modal ---
    openEditTaskModal(task, row, filters) {
        // At the very start, replace task with latest version from localStorage if available
        const currentFilter = filters.join(",");
        const cachedTasksKey = `todoistTasksCache:${currentFilter}`;
        const cachedTasks = JSON.parse(localStorage.getItem(cachedTasksKey) || "[]");
        const latestTask = cachedTasks.find((t) => t.id === task.id);
        if (latestTask)
            task = latestTask;
        // Utility functions with taskmodal- prefix
        const createEl = (tag, opts = {}) => {
            const el = document.createElement(tag);
            if (opts.cls)
                el.className = opts.cls;
            if (opts.text)
                el.textContent = opts.text;
            if (opts.type)
                el.type = opts.type;
            if (opts.value !== undefined)
                el.value = opts.value;
            if (opts.attr)
                for (const k in opts.attr)
                    el.setAttribute(k, opts.attr[k]);
            return el;
        };
        const createDiv = (cls) => {
            if (typeof cls === "string") {
                return createEl("div", { cls });
            }
            return createEl("div");
        };
        // Modal from Obsidian
        let Modal;
        try {
            ({ Modal } = require("obsidian"));
        }
        catch (e) {
            Modal = window.Modal;
        }
        const modal = new Modal(this.app);
        modal.containerEl.classList.add("todoist-edit-task-modal");
        // --- Ensure project and label metadata is loaded before building dropdown ---
        (async () => {
            if (!this.projectCache || this.projectCache.length === 0) {
                const metadata = await this.fetchMetadataFromSync(this.settings.apiKey);
                this.projectCache = metadata.projects;
                this.labelCache = metadata.labels;
            }
            // After preloading filters, update badge count for current filter
            await this.preloadFilters();
            const currentFilter = document.querySelector(".todoist-board")?.getAttribute("data-current-filter") || "";
            const badge = document.querySelector(`.filter-row[data-filter="${currentFilter}"] .filter-badge-count`);
            if (badge) {
                const cache = JSON.parse(localStorage.getItem(`todoistTasksCache:${currentFilter}`) || "[]");
                badge.textContent = String(cache.length);
            }
            // Outer wrapper
            const wrapper = createDiv("taskmodal-wrapper");
            // Title field
            const titleField = createDiv("taskmodal-title-field");
            const titleLabel = createEl("label", { cls: "taskmodal-label", text: "Task Title" });
            const titleInput = createEl("input", { cls: "taskmodal-title-input", type: "text", value: task.content });
            titleField.appendChild(titleLabel);
            titleField.appendChild(titleInput);
            wrapper.appendChild(titleField);
            // Description field
            const descField = createDiv("taskmodal-description-field");
            const descLabel = createEl("label", { cls: "taskmodal-label", text: "Description" });
            const descInput = createEl("textarea", { cls: "taskmodal-description-input" });
            descInput.value = task.description ?? "";
            descField.appendChild(descLabel);
            descField.appendChild(descInput);
            wrapper.appendChild(descField);
            // Date row
            const dateField = createDiv("taskmodal-date-field");
            const dateLabel = createEl("label", { cls: "taskmodal-date-label", text: "📅 Due Date" });
            const dateRow = createDiv("taskmodal-date-input-row");
            const dueInput = createEl("input", { cls: "taskmodal-date-input", type: "date", value: task.due?.date ?? "" });
            const clearDateBtn = createEl("button", { cls: "taskmodal-clear-date", text: "✕" });
            clearDateBtn.title = "Clear Due Date";
            clearDateBtn.onclick = () => { dueInput.value = ""; };
            dateRow.appendChild(dueInput);
            dateRow.appendChild(clearDateBtn);
            dateField.appendChild(dateLabel);
            dateField.appendChild(dateRow);
            // Project select
            const projectField = createDiv("taskmodal-project-field");
            const projectLabel = createEl("label", { cls: "taskmodal-project-label", text: "🗂️ Project" });
            const projectSelect = createEl("select", { cls: "taskmodal-project-select" });
            const projects = this.cachedProjects.length > 0 ? this.cachedProjects : (this.projectCache || []);
            for (const project of projects) {
                const option = createEl("option");
                option.value = project.id;
                option.textContent = project.name;
                // Use string comparison for project id selection
                if (String(task.project_id) === String(project.id)) {
                    option.selected = true;
                }
                projectSelect.appendChild(option);
            }
            projectField.appendChild(projectLabel);
            projectField.appendChild(projectSelect);
            // --- Group project and date fields into a row ---
            const projectAndDateRow = createDiv("taskmodal-row");
            projectAndDateRow.appendChild(projectField);
            projectAndDateRow.appendChild(dateField);
            wrapper.appendChild(projectAndDateRow);
            // Labels
            const labelField = createDiv("taskmodal-labels-field");
            const labelLabel = createEl("label", { cls: "taskmodal-labels-label", text: "🏷️ Labels" });
            const labelList = createDiv("taskmodal-label-list");
            (this.labelCache || []).forEach((label) => {
                const labelCheckbox = createEl("label", { cls: "taskmodal-label-checkbox" });
                const checkbox = createEl("input", { type: "checkbox" });
                checkbox.value = label.name;
                checkbox.checked = task.labels.includes(label.name);
                labelCheckbox.appendChild(checkbox);
                labelCheckbox.append(label.name);
                labelList.appendChild(labelCheckbox);
            });
            labelField.appendChild(labelLabel);
            labelField.appendChild(labelList);
            wrapper.appendChild(labelField);
            // Button row
            const buttonRow = createDiv("taskmodal-button-row");
            const cancelBtn = createEl("button", { cls: "taskmodal-button-cancel", text: "Cancel" });
            cancelBtn.onclick = () => modal.close();
            const saveBtn = createEl("button", { cls: "taskmodal-button-save", text: "Save" });
            saveBtn.onclick = async () => {
                const newTitle = titleInput.value.trim();
                const newDesc = descInput.value.trim();
                const newDue = dueInput.value;
                const newProjectId = projectSelect.value;
                if (!newTitle)
                    return;
                // Save the original project_id and labels before mutating task
                const originalProjectId = task.project_id;
                const originalLabels = [...task.labels];
                // Gather checked labels from custom checkbox list
                const selectedLabels = Array.from(labelList.querySelectorAll("input:checked")).map(cb => cb.value);
                // Immediately replace the task in cache with edited version (but do NOT mutate task yet)
                const editedTask = {
                    ...task,
                    content: newTitle,
                    description: newDesc,
                    due: newDue ? { date: newDue } : null,
                    project_id: Number(newProjectId),
                    labels: selectedLabels
                };
                // Do NOT mutate task here. (Moved mutation to after fetch.)
                // task.content = editedTask.content;
                // task.description = editedTask.description;
                // task.due = editedTask.due;
                // task.project_id = editedTask.project_id;
                // task.labels = editedTask.labels;
                // Save to localStorage
                const updatedTasks = cachedTasks.map((t) => t.id === task.id ? editedTask : t);
                localStorage.setItem(cachedTasksKey, JSON.stringify(updatedTasks));
                localStorage.setItem(`todoistTasksCacheTimestamp:${currentFilter}`, String(Date.now()));
                // Show pulsing orange sync indicator (sync in progress) - DELAYED VERSION
                setTimeout(() => {
                    const updatedRow = document.getElementById(task.id);
                    if (!updatedRow) {
                        console.warn("❌ Could not find row for sync indicator", task.id);
                        return;
                    }
                    const oldIndicator = updatedRow.querySelector(".change-indicator");
                    if (oldIndicator)
                        oldIndicator.remove();
                    const newIndicator = document.createElement("span");
                    newIndicator.className = "change-indicator";
                    newIndicator.style.position = "absolute";
                    newIndicator.style.bottom = "4px";
                    newIndicator.style.right = "4px";
                    newIndicator.style.width = "8px";
                    newIndicator.style.height = "8px";
                    newIndicator.style.borderRadius = "50%";
                    newIndicator.style.backgroundColor = "orange";
                    newIndicator.style.opacity = "0.8";
                    newIndicator.style.zIndex = "10";
                    newIndicator.style.animation = "pulse 1s infinite";
                    newIndicator.title = "Syncing...";
                    updatedRow.style.position = "relative";
                    updatedRow.appendChild(newIndicator);
                    console.log("✅ Appended sync indicator (delayed)");
                }, 100);
                // Rerender from updated localStorage
                document.querySelectorAll(".todoist-board").forEach((el) => {
                    const container = el;
                    const source = container.getAttribute("data-current-filter") || "";
                    container.innerHTML = "";
                    this.renderTodoistBoard(container, source, {}, this.settings.apiKey);
                });
                // Now close the modal after UI and storage updates
                modal.close();
                setTimeout(async () => {
                    // --- PATCH: Use conditional update body and POST as per new instructions ---
                    const updateBody = {};
                    if (newTitle !== task.content)
                        updateBody.content = newTitle;
                    if (newDesc !== task.description)
                        updateBody.description = newDesc;
                    if (newDue !== (task.due?.date ?? "")) {
                        if (newDue)
                            updateBody.due_date = newDue;
                        else
                            updateBody.due_string = "no date";
                    }
                    // Removed project_id update from updateBody here
                    if (JSON.stringify(selectedLabels) !== JSON.stringify(originalLabels)) {
                        updateBody.labels = selectedLabels;
                    }
                    // --- Ensure at least one accepted field for Todoist API ---
                    const requiredFields = ["content", "description", "due_date", "due_string", "labels"];
                    const updateKeys = Object.keys(updateBody);
                    const hasRequiredField = updateKeys.some(k => requiredFields.includes(k));
                    if (!hasRequiredField) {
                        updateBody.content = task.content; // Add fallback to satisfy API
                    }
                    // Log the constructed update body before sending the fetch request
                    console.log("Sending update to Todoist:", updateBody);
                    const result = await fetch(`https://api.todoist.com/rest/v2/tasks/${task.id}`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${this.settings.apiKey}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(updateBody)
                    });
                    const data = await result.text();
                    console.log("Todoist update response:", result.status, data);
                    // After updating content/description/due/labels, move project if needed
                    if (Number(newProjectId) !== Number(originalProjectId)) {
                        await fetch("https://api.todoist.com/sync/v9/sync", {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${this.settings.apiKey}`,
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: new URLSearchParams({
                                sync_token: "*",
                                resource_types: '["items"]',
                                commands: JSON.stringify([
                                    {
                                        type: "item_move",
                                        uuid: crypto.randomUUID(),
                                        args: {
                                            id: task.id,
                                            project_id: Number(newProjectId)
                                        }
                                    }
                                ])
                            })
                        });
                        // PATCH: update project dropdown to reflect new project in case the modal is still open
                        const selectedOption = [...projectSelect.options].find(o => o.value === String(newProjectId));
                        if (selectedOption)
                            selectedOption.selected = true;
                    }
                    // --- Now, after the updateBody and fetch, mutate the task object properties ---
                    task.content = newTitle;
                    task.description = newDesc;
                    task.due = newDue ? { date: newDue } : null;
                    task.project_id = Number(newProjectId);
                    task.labels = selectedLabels;
                    await this.savePluginData();
                    // PATCH: rerender all code blocks after save
                    const markdownEls = document.querySelectorAll("pre > code.language-todoist-board");
                    markdownEls.forEach((el) => {
                        const pre = el.parentElement;
                        const container = document.createElement("div");
                        pre.replaceWith(container);
                        this.renderTodoistBoard(container, `filter: ${filters.join(",")}`, {}, this.settings.apiKey);
                    });
                    // --- PATCH: After modal is closed and DOM is updated, refresh metadata and rerender boards ---
                    const refreshedMetadata = await this.fetchMetadataFromSync(this.settings.apiKey);
                    this.labelCache = refreshedMetadata.labels;
                    // Optionally rerender all todoist-board containers with fresh metadata
                    document.querySelectorAll(".todoist-board").forEach((el) => {
                        const container = el;
                        const source = container.getAttribute("data-current-filter") || "";
                        container.innerHTML = "";
                        this.renderTodoistBoard(container, source, {}, this.settings.apiKey);
                    });
                    // --- NEW: Sync indicator logic ---
                    const updatedIndicator = document.getElementById(task.id)?.querySelector(".change-indicator");
                    if (result.ok) {
                        // --- PATCH: Update localStorage with the edited task after confirmed sync ---
                        const tasksKey = `todoistTasksCache:${currentFilter}`;
                        const storedTasks = JSON.parse(localStorage.getItem(tasksKey) || "[]");
                        const updatedTasksAfterSync = storedTasks.map((t) => t.id === task.id
                            ? {
                                ...t,
                                content: newTitle,
                                description: newDesc,
                                due: newDue ? { date: newDue } : null,
                                project_id: Number(newProjectId),
                                labels: selectedLabels
                            }
                            : t);
                        localStorage.setItem(tasksKey, JSON.stringify(updatedTasksAfterSync));
                        localStorage.setItem(`todoistTasksCacheTimestamp:${currentFilter}`, String(Date.now()));
                        if (updatedIndicator) {
                            updatedIndicator.style.animation = "none";
                            updatedIndicator.style.backgroundColor = "limegreen";
                            updatedIndicator.title = "Synced";
                            setTimeout(() => updatedIndicator.remove(), 1000);
                        }
                    }
                    else if (updatedIndicator) {
                        updatedIndicator.style.animation = "none";
                        updatedIndicator.style.backgroundColor = "red";
                        updatedIndicator.title = "Failed to sync";
                    }
                }, 0);
            };
            buttonRow.appendChild(cancelBtn);
            buttonRow.appendChild(saveBtn);
            wrapper.appendChild(buttonRow);
            modal.contentEl.appendChild(wrapper);
        })();
        modal.open();
    }
    // ======================= 📆 Quick Actions (Today, Tmrw, Delete) =======================
    async setTaskToToday(taskId, apiKey, toolbar, btn) {
        if (btn?._busy)
            return;
        btn._busy = true;
        const oldText = btn.innerText;
        btn.innerText = "⏳";
        try {
            const today = new Date();
            const iso = today.toISOString().split("T")[0];
            const resp = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ due_date: iso })
            });
            if (resp.ok) {
                btn.innerText = "🎉";
                setTimeout(() => {
                    this.taskCache = {};
                    this.taskCacheTimestamps = {};
                    const taskRow = document.getElementById(taskId);
                    if (taskRow)
                        taskRow.remove();
                }, 900);
            }
            else {
                btn.innerText = "❌";
                alert("Failed to update task.");
            }
        }
        catch (err) {
            btn.innerText = "❌";
            alert("Error: " + String(err));
        }
        finally {
            setTimeout(() => {
                btn._busy = false;
                btn.innerText = oldText;
            }, 900);
        }
    }
    async deferTask(taskId, apiKey, toolbar) {
        const btn = toolbar.querySelector('.chin-btn[data-index="1"]');
        if (btn._busy)
            return;
        btn._busy = true;
        const oldText = btn.innerText;
        btn.innerText = "⏳";
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const iso = tomorrow.toISOString().split("T")[0];
            const resp = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "due_date": iso })
            });
            if (resp.ok) {
                btn.innerText = "🎉";
                setTimeout(() => {
                    this.taskCache = {};
                    this.taskCacheTimestamps = {};
                    // PATCH: Remove the task element from the DOM manually
                    const taskRow = document.getElementById(taskId);
                    if (taskRow)
                        taskRow.remove();
                    // Will trigger re-render on next filter click
                }, 900);
            }
            else {
                btn.innerText = "❌";
                alert("Failed to update task. Try again.");
            }
        }
        catch (err) {
            btn.innerText = "❌";
            alert("Error updating task: " + String(err));
        }
        finally {
            setTimeout(() => {
                btn._busy = false;
                btn.innerText = oldText;
            }, 900);
        }
    }
    async deleteTask(taskId, apiKey, toolbar) {
        if (!confirm("Delete this task? This action cannot be undone."))
            return;
        const btn = toolbar.querySelector('.chin-btn[data-index="3"]');
        if (btn._busy)
            return;
        btn._busy = true;
        btn.innerText = "⏳";
        try {
            const resp = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${apiKey}`
                }
            });
            if (resp.ok) {
                btn.innerText = "✅";
                setTimeout(() => {
                    this.taskCache = {};
                    this.taskCacheTimestamps = {};
                    // PATCH: Remove the task element from the DOM manually
                    const taskRow = document.getElementById(taskId);
                    if (taskRow)
                        taskRow.remove();
                    // Will trigger re-render on next filter click
                }, 900);
            }
            else {
                btn.innerText = "❌";
                alert("Failed to delete task.");
            }
        }
        catch (err) {
            btn.innerText = "❌";
            alert("Error deleting task: " + String(err));
        }
        finally {
            setTimeout(() => {
                btn._busy = false;
                btn.innerText = "🗑";
            }, 900);
        }
    }
    handleQueueCompletion(listWrapper) {
        const tasks = Array.from(listWrapper.querySelectorAll(".task"))
            .filter(el => {
            const elHtml = el;
            return !elHtml.classList.contains("completed") && elHtml.offsetParent !== null;
        });
        const next = tasks[0];
        if (next) {
            // Remove queue-dimmed
            next.classList.remove("queue-dimmed");
            // Select the task as if clicked
            requestAnimationFrame(() => {
                next.scrollIntoView({ behavior: "smooth", block: "center" });
                requestAnimationFrame(() => {
                    next.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
                });
            });
        }
    }
    // ======================= 🧱 Task Content Building =======================
    createTaskContent(task, projectMap, labelMap, labelColorMap, projects) {
        const left = document.createElement("div");
        left.className = "task-content";
        const titleSpan = document.createElement("span");
        titleSpan.textContent = task.content;
        titleSpan.className = "task-title";
        const metaSpan = document.createElement("small");
        metaSpan.className = "task-metadata";
        const pills = this.createTaskPills(task, projectMap, labelMap, labelColorMap, projects);
        pills.forEach(pill => metaSpan.appendChild(pill));
        const descEl = document.createElement("div");
        descEl.className = "task-description";
        if (typeof task.description === "string" && task.description.trim()) {
            descEl.textContent = task.description;
        }
        else {
            descEl.textContent = " ";
            descEl.classList.add("desc-empty");
        }
        const contentWrapper = document.createElement("div");
        contentWrapper.className = "task-content-wrapper";
        contentWrapper.appendChild(titleSpan);
        contentWrapper.appendChild(descEl);
        if (metaSpan)
            contentWrapper.appendChild(metaSpan);
        left.appendChild(contentWrapper);
        return left;
    }
    createTaskPills(task, projectMap, labelMap, labelColorMap, projects) {
        const pills = [];
        // Due date pill
        const duePill = this.createDuePill(task.due?.date);
        if (duePill)
            pills.push(duePill);
        // Project pill
        const projectPill = this.createProjectPill(task.project_id, projectMap, projects);
        if (projectPill)
            pills.push(projectPill);
        // Label pill
        const labelPill = this.createLabelPill(task.labels, labelMap, labelColorMap);
        if (labelPill)
            pills.push(labelPill);
        return pills.filter(pill => pill.style.display !== "none");
    }
    createDuePill(dueDate) {
        if (!dueDate)
            return null;
        const duePill = document.createElement("span");
        duePill.className = "pill";
        duePill.setAttribute("data-type", "due");
        const due = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0)
            duePill.classList.add("overdue");
        else if (diffDays === 0)
            duePill.classList.add("today");
        else if (diffDays <= 2)
            duePill.classList.add("soon");
        else
            duePill.classList.add("future");
        if (due.toDateString() === today.toDateString()) {
            duePill.textContent = "Today";
        }
        else if (due.toDateString() === tomorrow.toDateString()) {
            duePill.textContent = "Tomorrow";
        }
        else {
            duePill.textContent = due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
        return duePill;
    }
    createProjectPill(projectId, projectMap, projects) {
        if (!projectId)
            return null;
        const projectPill = document.createElement("span");
        projectPill.className = "pill project-pill";
        projectPill.setAttribute("data-type", "project");
        const projName = projectMap[projectId] || "Unknown Project";
        const projectColorId = projects.find((p) => p.id === projectId)?.color;
        const projectHexColor = TODOIST_COLORS[projectColorId];
        projectPill.innerHTML = projName === "Inbox"
            ? `<span class="project-hash" style="color:${projectHexColor};">#</span> 📥 Inbox`
            : `<span class="project-hash" style="color:${projectHexColor};">#</span> ${projName}`;
        return projectPill;
    }
    createLabelPill(labels, labelMap, labelColorMap) {
        if (!labels || labels.length === 0)
            return null;
        const labelPill = document.createElement("span");
        labelPill.className = "pill label-pill";
        labelPill.setAttribute("data-type", "label");
        labelPill.innerHTML = labels.map((id) => {
            const name = labelMap[id] || id;
            const color = labelColorMap[id] || "#9333ea";
            return `<span><span style="color:${color}; font-size: 1.05em;">@ </span>${name}</span>`;
        }).join(`<span class="label-separator">,</span>`);
        return labelPill;
    }
    createTaskDeadline(task) {
        const right = document.createElement("div");
        right.className = "task-deadline";
        const deadline = task.deadline?.date;
        if (!deadline)
            return right;
        const deadlineWrapper = document.createElement("div");
        deadlineWrapper.className = "deadline-wrapper";
        const deadlineLabel = document.createElement("div");
        deadlineLabel.textContent = "🎯 deadline";
        deadlineLabel.className = "deadline-label";
        const deadlinePill = document.createElement("div");
        deadlinePill.className = "pill deadline-date";
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        let deadlineText = "";
        if (diffDays === 0) {
            deadlineText = "Today";
        }
        else if (diffDays === 1) {
            deadlineText = "Tomorrow";
        }
        else if (diffDays > 1 && diffDays <= 5) {
            deadlineText = `In ${diffDays} days`;
        }
        else {
            const options = { month: "short", day: "numeric" };
            deadlineText = deadlineDate.toLocaleDateString("en-US", options);
        }
        deadlinePill.textContent = deadlineText;
        deadlineWrapper.appendChild(deadlineLabel);
        deadlineWrapper.appendChild(deadlinePill);
        right.appendChild(deadlineWrapper);
        return right;
    }
    // ======================= 🖱️ Drag & Drop =======================
    setupTaskDragAndDrop(row, listWrapper, filters) {
        let lastTap = 0;
        row.onpointerdown = (ev) => {
            // PATCH: Ignore pointerdown if it's on the mini-toolbar/fixed-chin
            if (ev.target?.closest(".fixed-chin"))
                return;
            // console.log("🔽 pointerdown", ev.pointerType, ev.clientX, ev.clientY);
            const tapNow = Date.now();
            if (tapNow - lastTap < 300)
                return;
            if (ev.target.closest('input[type="checkbox"]')) {
                return;
            }
            const isTouch = ev.pointerType === "touch" || ev.pointerType === "pen";
            const startX = ev.clientX;
            const startY = ev.clientY;
            let longPressTimer = null;
            let dragging = false;
            let pid = ev.pointerId;
            // NEW:
            const beginDrag = (e) => {
                // console.log("🏁 beginDrag");
                if (dragging)
                    return;
                // console.log("🎯 drag initialized");
                dragging = true;
                const listView = listWrapper.closest(".list-view");
                if (listView) {
                    listView.classList.add("drag-scroll-block");
                    listView.style.touchAction = "none";
                }
                // NOW prevent default since we're starting a drag
                if (e && e.cancelable) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                // NOW set these drag properties
                row.style.touchAction = "none";
                document.body.classList.add("drag-disable");
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
                document.body.style.height = '100%';
                // PATCH: Prevent select on iOS during drag
                document.body.style.webkitUserSelect = 'none';
                document.body.style.userSelect = 'none';
                listWrapper.style.touchAction = 'none';
                // NEW (reuse the existing listView variable):
                if (listView) {
                    listView.style.touchAction = "none";
                    listView.style.overflow = "hidden";
                }
                // PATCH: Also block touchAction on .list-view
                if (listWrapper.closest(".list-view")) {
                    listWrapper.closest(".list-view").style.touchAction = "none";
                }
                document.body.style.overflow = 'hidden'; // Prevent page scroll too
                if (e)
                    e.preventDefault();
                window.getSelection()?.removeAllRanges();
                row.classList.add("dragging-row");
                // PATCH: Add classes to block drag/scroll globally
                document.body.classList.add("drag-disable");
                listWrapper.classList.add("drag-scroll-block");
                // PATCH: block scroll in list-view while dragging
                if (listView) {
                    listView.classList.add("drag-scroll-block");
                    listView.style.touchAction = "none";
                }
                const obsidianContainers = [
                    document.querySelector('.workspace-leaf-content'),
                    document.querySelector('.markdown-preview-view'),
                    document.querySelector('.cm-editor'),
                    document.querySelector('.view-content')
                ];
                obsidianContainers.forEach(container => {
                    if (container) {
                        const el = container;
                        el.style.touchAction = 'none';
                        el.style.overflow = 'hidden';
                        // Store original values to restore later
                        el.dataset.originalTouchAction = el.style.touchAction;
                        el.dataset.originalOverflow = el.style.overflow;
                    }
                });
                if (e)
                    e.preventDefault();
                if (e)
                    e.stopPropagation();
                window.getSelection()?.removeAllRanges();
                row.classList.add("dragging-row");
                // Add global drag classes
                document.body.classList.add("drag-disable");
                listWrapper.classList.add("drag-scroll-block");
                if (listView) {
                    listView.classList.add("drag-scroll-block");
                }
                // console.log("📦 Placeholder inserted");
                if (navigator.vibrate) {
                    navigator.vibrate([30, 20, 30]);
                }
                const placeholder = row.cloneNode(true);
                placeholder.id = "todoist-placeholder";
                placeholder.className = "task-placeholder";
                const rowRect = row.getBoundingClientRect();
                startY - rowRect.top;
                listWrapper.insertBefore(placeholder, row);
                const moveWhileDragging = (e) => {
                    // console.log("📍 pointermove during drag", e.clientY);
                    if (e.pointerId !== pid)
                        return;
                    e.preventDefault();
                    e.stopPropagation();
                    const rows = Array.from(listWrapper.children).filter(c => c !== row && c !== placeholder);
                    for (let i = 0; i < rows.length; i++) {
                        const other = rows[i];
                        const otherRect = other.getBoundingClientRect();
                        if (e.clientY < otherRect.top + otherRect.height / 2) {
                            listWrapper.insertBefore(placeholder, other);
                            break;
                        }
                        if (i === rows.length - 1) {
                            listWrapper.appendChild(placeholder);
                        }
                    }
                };
                const finishDrag = (e) => {
                    // console.log("✅ finishDrag");
                    if (e.pointerId !== pid)
                        return;
                    row.releasePointerCapture(pid);
                    row.removeEventListener("pointermove", moveWhileDragging);
                    row.removeEventListener("pointerup", finishDrag);
                    row.removeEventListener("pointercancel", finishDrag);
                    row.removeEventListener("lostpointercapture", finishDrag);
                    row.classList.remove("dragging-row");
                    // PATCH: unblock scroll in list-view after dragging
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.width = '';
                    document.body.style.height = '';
                    document.body.style.webkitUserSelect = '';
                    document.body.style.userSelect = '';
                    // PATCH: unblock scroll in list-view after dragging
                    if (listView)
                        listView.classList.remove("drag-scroll-block");
                    if (listView)
                        listView.style.touchAction = "";
                    listWrapper.style.touchAction = '';
                    if (listView) {
                        listView.style.touchAction = "";
                        listView.style.overflow = "";
                        listView.classList.remove("drag-scroll-block");
                    }
                    const obsidianContainers = [
                        document.querySelector('.workspace-leaf-content'),
                        document.querySelector('.markdown-preview-view'),
                        document.querySelector('.cm-editor'),
                        document.querySelector('.view-content')
                    ];
                    obsidianContainers.forEach(container => {
                        if (container) {
                            const el = container;
                            el.style.touchAction = el.dataset.originalTouchAction || '';
                            el.style.overflow = el.dataset.originalOverflow || '';
                            delete el.dataset.originalTouchAction;
                            delete el.dataset.originalOverflow;
                        }
                    });
                    listWrapper.insertBefore(row, placeholder);
                    placeholder.remove();
                    // console.log("📤 Drag completed and placeholder removed");
                    // PATCH: Also restore touchAction on .list-view after drag
                    if (listWrapper.closest(".list-view")) {
                        listWrapper.closest(".list-view").style.touchAction = "";
                    }
                    document.body.style.overflow = '';
                    // PATCH: Restore iOS select after drag
                    document.body.style.webkitUserSelect = '';
                    row.style.touchAction = '';
                    // PATCH: Remove drag-disable and drag-scroll-block classes
                    document.body.classList.remove("drag-disable");
                    listWrapper.classList.remove("drag-scroll-block");
                    row.style.touchAction = '';
                    document.body.classList.remove("drag-disable");
                    listWrapper.classList.remove("drag-scroll-block");
                    const newOrder = Array.from(listWrapper.children)
                        .map(c => c.getAttribute("data-id"))
                        .filter(id => id);
                    localStorage.setItem(`todoistBoardOrder:${filters.join(",")}`, JSON.stringify(newOrder));
                    this.savePluginData();
                };
                row.setPointerCapture(pid);
                row.addEventListener("pointermove", moveWhileDragging);
                row.addEventListener("pointerup", finishDrag);
                row.addEventListener("pointercancel", finishDrag);
                row.addEventListener("lostpointercapture", finishDrag);
            };
            if (isTouch) {
                let moved = false;
                const moveThreshold = 25;
                const onTouchMove = (e) => {
                    // console.log("👣 onTouchMove", e.clientX, e.clientY);
                    const dx = Math.abs(e.clientX - startX);
                    const dy = Math.abs(e.clientY - startY);
                    if (dx > moveThreshold || dy > moveThreshold) {
                        moved = true;
                        cleanup();
                    }
                };
                const cleanup = () => {
                    // console.log("🧹 Cleanup triggered");
                    if (longPressTimer !== null)
                        clearTimeout(longPressTimer);
                    row.removeEventListener('pointermove', onTouchMove);
                    row.removeEventListener('pointerup', cleanup);
                    row.removeEventListener('pointercancel', cleanup);
                    // Remove drag-scroll-block from .list-view after drag/touch cleanup
                    const listView = listWrapper.closest(".list-view");
                    if (listView) {
                        listView.classList.remove("drag-scroll-block");
                    }
                    if (listView)
                        listView.style.touchAction = "";
                    row.style.touchAction = "";
                    // PATCH: Remove drag-disable and drag-scroll-block classes
                    document.body.classList.remove("drag-disable");
                    listWrapper.classList.remove("drag-scroll-block");
                };
                // PATCH: passive: false for pointermove
                row.addEventListener('pointermove', onTouchMove, { passive: true });
                row.addEventListener('pointerup', cleanup, { passive: true });
                row.addEventListener('pointercancel', cleanup, { passive: true });
                longPressTimer = window.setTimeout(() => {
                    // console.log("⏳ Long press timer fired");
                    if (!moved) {
                        if (ev.cancelable)
                            ev.preventDefault();
                        beginDrag(ev);
                    }
                }, 150);
            }
            else if (ev.pointerType === "mouse") {
                const moveCheck = (e) => {
                    const dx = Math.abs(e.clientX - startX);
                    const dy = Math.abs(e.clientY - startY);
                    if (dx > 5 || dy > 5) {
                        row.removeEventListener("pointermove", moveCheck);
                        beginDrag(e);
                    }
                };
                row.addEventListener("pointermove", moveCheck);
                row.addEventListener("pointerup", () => {
                    row.removeEventListener("pointermove", moveCheck);
                });
            }
        };
        row.addEventListener("pointercancel", () => {
            // console.log("⚠️ pointercancel triggered");
            window.getSelection()?.removeAllRanges();
        });
    }
    setupGlobalEventListeners() {
        document.addEventListener("click", (e) => {
            const target = e.target;
            // Updated logic: if inside .fixed-chin, do nothing
            if (target.closest(".fixed-chin"))
                return;
            if (!target.closest(".task-inner")) {
                this.clearSelectedTaskHighlight();
            }
        });
    }
    clearSelectedTaskHighlight() {
        document.querySelectorAll(".selected-task").forEach((el) => {
            el.classList.remove("selected-task");
            void el.offsetWidth; // force reflow
            setTimeout(() => {
                const toolbar = el.querySelector("#mini-toolbar-wrapper");
                if (toolbar)
                    toolbar.remove();
            }, 0); // delay toolbar removal until next frame
        });
    }
    setupMutationObserver(container) {
        const observer = new MutationObserver(() => {
            const listView = container.querySelector(".list-view");
            const isDragging = !!container.querySelector(".task-placeholder");
            listView?.classList.toggle("drag-scroll-block", isDragging);
            // --- PATCH: disable iOS scrolling and selection while dragging
            if (isDragging) {
                document.body.style.touchAction = "none";
                document.body.style.webkitUserSelect = "none";
            }
            else {
                document.body.style.touchAction = "";
                document.body.style.webkitUserSelect = "";
            }
        });
        observer.observe(container, {
            attributes: false,
            childList: true,
            subtree: true,
        });
    }
    createPriorityCheckbox(priority, onChange) {
        const priorityColors = {
            4: "#d1453b", // P1 - red
            3: "#eb8909", // P2 - orange
            2: "#246fe0", // P3 - blue
            1: "#808080", // P4 - grey
        };
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "todoist-checkbox";
        const rowPrioColor = priorityColors[priority] || "#999";
        checkbox.style.borderColor = rowPrioColor;
        checkbox.style.background = `${rowPrioColor}0D`;
        // Prevent task selection when clicking checkbox
        checkbox.addEventListener("click", async (e) => {
            e.stopPropagation(); // Prevents selecting the task when checking
        });
        checkbox.addEventListener("change", async () => {
            // Find the row (task container)
            const row = checkbox.closest('.task');
            await onChange();
            // Animation and haptic feedback when marking complete
            if (checkbox.checked && row) {
                if (navigator.vibrate)
                    navigator.vibrate([20]);
                row.classList.add("task-checked-anim");
                // Add completed class and fade out
                row.classList.add("completed");
                // TypeScript fix: cast row to HTMLElement for .style
                const rowEl = row;
                rowEl.style.transition = "opacity 0.2s ease-out";
                rowEl.style.opacity = "0.4";
                setTimeout(() => {
                    // Optionally remove from DOM after 300ms
                    if (rowEl.parentElement)
                        rowEl.parentElement.removeChild(rowEl);
                }, 300);
                setTimeout(() => rowEl.classList.remove("task-checked-anim"), 200);
            }
        });
        return checkbox;
    }
    updateQueueView(active, listWrapper) {
        const rows = Array.from(listWrapper.children);
        rows.forEach((r, i) => {
            const titleSpan = r.querySelector(".task-title");
            if (!titleSpan)
                return;
            if (active) {
                if (i === 0) {
                    r.classList.remove("queue-dimmed");
                    r.classList.add("queue-focused");
                    titleSpan.classList.add("queue-focused-title");
                    r.scrollIntoView({ behavior: "smooth", block: "center", inline: "start" });
                }
                else {
                    r.classList.add("queue-dimmed");
                    r.classList.remove("queue-focused");
                    titleSpan.classList.remove("queue-focused-title");
                }
            }
            else {
                r.classList.remove("queue-dimmed", "queue-focused");
                titleSpan.classList.remove("queue-focused-title");
            }
        });
    }
}
// --- Inject task description show/hide CSS ---
const descStyle = document.createElement('style');
descStyle.textContent = `
.task-description {
  display: none;
  /* Optional for animation:
  opacity: 0;
  max-height: 0;
  transition: opacity 0.2s, max-height 0.2s;
  */
}
.selected-task .task-description,
.task-description.show-description {
  display: block;
  /* Optional for animation:
  opacity: 1;
  max-height: 200px;
  */
}
.desc-empty {
  color: #999;
  font-style: italic;
}
`;
if (!document.head.querySelector('style[data-todoist-board-desc-css]')) {
    descStyle.setAttribute('data-todoist-board-desc-css', 'true');
    document.head.appendChild(descStyle);
}
// ======================= ⚙️ Settings Tab =======================
class TodoistBoardSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Todoist Board Settings" });
        new obsidian.Setting(containerEl)
            .setName("🔑 Todoist API Key")
            .setDesc("Enter your Todoist API key to enable the plugin.")
            .addText((text) => {
            text
                .setPlaceholder("API Key")
                .setValue(this.plugin.settings.apiKey);
            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Submit";
            submitBtn.style.marginLeft = "8px";
            const indicator = document.createElement("span");
            indicator.style.marginLeft = "8px";
            indicator.style.fontWeight = "bold";
            submitBtn.onclick = async () => {
                indicator.textContent = "⏳";
                try {
                    const res = await fetch("https://api.todoist.com/sync/v9/sync", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${text.inputEl.value}`,
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: new URLSearchParams({
                            sync_token: "*",
                            resource_types: JSON.stringify(["projects"])
                        })
                    });
                    if (!res.ok)
                        throw new Error("Invalid");
                    this.plugin.settings.apiKey = text.inputEl.value;
                    indicator.textContent = "✅";
                    await this.plugin.savePluginData();
                }
                catch {
                    indicator.textContent = "❌";
                }
            };
            text.inputEl.parentElement?.appendChild(submitBtn);
            text.inputEl.parentElement?.appendChild(indicator);
        });
        // --- Support My Work Button ---
        new obsidian.Setting(containerEl)
            .setName("👯‍♀️ Support My Work")
            .setDesc("If you like how this plugin is shaping up, please consider supporting my work by buying me a coffee or TEN!")
            .addButton((button) => {
            button.setButtonText("☕ Coffee Season");
            button.buttonEl.style.backgroundColor = "var(--interactive-accent)";
            button.buttonEl.style.color = "white";
            button.onClick(() => {
                window.open("https://ko-fi.com/jamiedaghaim", "_blank");
            });
        });
    }
}

module.exports = TodoistBoardPlugin;
//# sourceMappingURL=main.js.map
