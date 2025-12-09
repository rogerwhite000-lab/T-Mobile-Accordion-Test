import React, { useEffect, useRef, useState } from 'react';

export type AccordionItem = {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
};

export type AccordionProps = {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
};

/**
 * Accessible Accordion (TypeScript) with roving tabindex.
 * Roving tabindex behavior:
 * - Only the currently focusable header has tabindex=0, others -1.
 * - ArrowUp/ArrowDown/Home/End change which header is focusable and move focus.
 * ARIA: button with aria-expanded, aria-controls. Panel role=region with aria-labelledby.
 */
export default function Accordion({
  items,
  allowMultiple = false,
  className = '',
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0); // for roving tabindex
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    // ensure refs length matches items length
    buttonsRef.current = buttonsRef.current.slice(0, items.length);

    // clamp activeIndex if items change
    setActiveIndex((prev) => {
      if (items.length === 0) return 0;
      return prev > items.length - 1 ? 0 : prev;
    });
  }, [items.length]);

  const isOpen = (id: string) => openIds.includes(id);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  const focusButton = (index: number) => {
    const btn = buttonsRef.current[index];
    if (btn) {
      btn.focus();
    }
    setActiveIndex(index);
  };

  const onKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const { key } = e;
    const max = items.length - 1;
    let targetIndex: number | null = null;

    if (key === 'ArrowDown') targetIndex = index + 1 > max ? 0 : index + 1;
    if (key === 'ArrowUp') targetIndex = index - 1 < 0 ? max : index - 1;
    if (key === 'Home') targetIndex = 0;
    if (key === 'End') targetIndex = max;

    if (targetIndex !== null) {
      e.preventDefault();
      focusButton(targetIndex);
      return;
    }

    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      toggle(items[index].id);
    }
  };

  if (items.length === 0) return null;

  return (
    <div
      className={`accordion ${className}`}
      role="group"
      aria-label="Accordion"
    >
      {items.map((item, i) => {
        const buttonId = `accordion-button-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;
        const expanded = isOpen(item.id);

        return (
          <div className="accordion__item" key={item.id}>
            <h3>
              <button
                id={buttonId}
                ref={(el) => (buttonsRef.current[i] = el)}
                className="accordion__button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => {
                  toggle(item.id);
                  // when clicking, make that button the roving focusable one
                  setActiveIndex(i);
                }}
                onKeyDown={(e) => onKeyDown(e, i)}
                tabIndex={i === activeIndex ? 0 : -1}
              >
                {item.title}
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!expanded}
              className="accordion__panel"
            >
              <div>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
