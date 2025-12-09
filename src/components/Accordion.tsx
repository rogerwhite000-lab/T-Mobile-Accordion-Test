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
 * - Only the currently focusable header has tabindex=0, others -1.
 * - ArrowUp / ArrowDown / Home / End move focus.
 * - Enter / Space toggle the active item.
 */
export default function Accordion({
  items,
  allowMultiple = false,
  className = '',
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    buttonsRef.current = buttonsRef.current.slice(0, items.length);

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
    if (btn) btn.focus();
    setActiveIndex(index);
  };

  // ✅ CLEANER KEYBOARD HANDLER
  const onKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const max = items.length - 1;
    let targetIndex: number | null = null;

    switch (e.key) {
      case 'ArrowDown':
        targetIndex = index + 1 > max ? 0 : index + 1;
        break;

      case 'ArrowUp':
        targetIndex = index - 1 < 0 ? max : index - 1;
        break;

      case 'Home':
        targetIndex = 0;
        break;

      case 'End':
        targetIndex = max;
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        toggle(items[index].id);
        return;

      default:
        return;
    }

    if (targetIndex !== null) {
      e.preventDefault();
      focusButton(targetIndex);
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
