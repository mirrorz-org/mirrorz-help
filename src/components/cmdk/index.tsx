// Port from https://github.com/pacocoursey/cmdk/blob/605ae1304baff5ed6f7675d6028ad8dc0b93f0ca/cmdk/src/index.tsx

import type * as RadixDialog from '@radix-ui/react-dialog';
import {
  Root as RadixDialogRoot,
  Portal as RadixDialogPortal,
  Overlay as RadixDialogOverlay,
  Content as RadixDialogContent
} from '@radix-ui/react-dialog';
import {
  createContext,
  useContext,
  useId,
  useEffect,
  useState,
  useMemo,
  useRef,
  forwardRef,
  useSyncExternalStore
} from 'react';
import commandScore from 'command-score';
import { useLayoutEffect } from 'foxact/use-isomorphic-layout-effect';
import { useIsClient } from 'foxact/use-is-client';

interface Children { children?: React.ReactNode };
type DivProps = React.HTMLAttributes<HTMLDivElement>;

type LoadingProps = Children & {
  /** Estimated progress of loading asynchronous options. */
  progress?: number
};
type EmptyProps = Children & DivProps & {};
type SeparatorProps = DivProps & {
  /** Whether this separator should always be rendered. Useful if you disable automatic filtering. */
  alwaysRender?: boolean
};
type DialogProps = RadixDialog.DialogProps &
  CommandProps & {
    /** Provide a custom element the Dialog should portal into. */
    container?: HTMLElement,
    dialogOverlayClassName?: string | undefined,
    dialogContentClassName?: string | undefined
  };
type ListProps = Children & DivProps & {};
type ItemProps = Children &
  Omit<DivProps, 'disabled' | 'onSelect' | 'value'> & {
    /** Whether this item is currently disabled. */
    disabled?: boolean,
    /** Event handler for when this item is selected, either via click or keyboard selection. */
    onSelect?: (lowerCaseValue: string, originValue: string, identifier?: string) => void,
    /**
     * A unique value for this item.
     * If no value is provided, it will be inferred from `children` or the rendered `textContent`. If your `textContent` changes between renders, you _must_ provide a stable, unique `value`.
     */
    value?: string,
    identifier?: string
  };
type GroupProps = Children &
  Omit<DivProps, 'heading' | 'value'> & {
    /** Optional heading to render for this group. */
    heading?: React.ReactNode,
    /** If no heading is provided, you must provie a value that is unique for this group. */
    value?: string
  };
type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> & {
  /**
   * Optional controlled state for the value of the search input.
   */
  value?: string,
  /**
   * Event handler called when the search value changes.
   */
  onValueChange?: (search: string) => void
};
type CommandProps = Children &
  DivProps & {
    /**
     * Accessible label for this command menu. Not shown visibly.
     */
    label?: string,
    /**
     * Optionally set to `false` to turn off the automatic filtering and sorting.
     * If `false`, you must conditionally render valid items based on the search query yourself.
     */
    shouldFilter?: boolean,
    /**
     * Custom filter function for whether each command menu item should matches the given search query.
     * It should return a number between 0 and 1, with 1 being the best match and 0 being hidden entirely.
     * By default, uses the `command-score` library.
     */
    filter?: (value: string, search: string) => number,
    /**
     * Optional controlled state of the selected command menu item.
     */
    value?: string,
    /**
     * Event handler called when the selected item of the menu changes.
     */
    onValueChange?: (value: string) => void,
    /**
     * Optionally set to `true` to turn on looping around when using the arrow keys.
     */
    loop?: boolean
  };

interface Context {
  value: (id: string, value: string) => void,
  item: (id: string, groupId: string) => () => void,
  group: (id: string) => () => void,
  filter: () => boolean,
  label: string,
  // Ids
  listId: string,
  labelId: string,
  inputId: string
};
interface State {
  search: string,
  value: string,
  filtered: { count: number, items: Map<string, number>, groups: Set<string> }
};
interface Store {
  subscribe: (callback: () => void) => () => void,
  snapshot: () => State,
  setState: <K extends keyof State>(key: K, value: State[K], opts?: any) => void,
  emit: () => void
};

const LIST_SELECTOR = '[cmdk-list-sizer=""]';
const GROUP_SELECTOR = '[cmdk-group=""]';
const GROUP_ITEMS_SELECTOR = '[cmdk-group-items=""]';
const GROUP_HEADING_SELECTOR = '[cmdk-group-heading=""]';
const ITEM_SELECTOR = '[cmdk-item=""]';
const VALID_ITEM_SELECTOR = `${ITEM_SELECTOR}:not([aria-disabled="true"])`;
const SELECT_EVENT = 'cmdk-item-select';
const VALUE_ATTR = 'data-value';
const defaultFilter: CommandProps['filter'] = (value, search) => commandScore(value, search);

// @ts-ignore
const CommandContext = createContext<Context>(undefined);
const useCommand = () => useContext(CommandContext);
// @ts-ignore
const StoreContext = createContext<Store>(undefined);
const useStore = () => useContext(StoreContext);
// @ts-ignore
const GroupContext = createContext<string>(undefined);

const Command = forwardRef<HTMLDivElement, CommandProps>((props, forwardedRef) => {
  const ref = useRef<HTMLDivElement>(null);
  const state = useLazyRef<State>(() => ({
    /** Value of the search query. */
    search: '',
    /** Currently selected item value. */
    value: '',
    filtered: {
      /** The count of all visible items. */
      count: 0,
      /** Map from visible item id to its search score. */
      items: new Map(),
      /** Set of groups with at least one visible item. */
      groups: new Set()
    }
  }));
  const allItems = useLazyRef<Set<string>>(() => new Set()); // [...itemIds]
  const allGroups = useLazyRef<Map<string, Set<string>>>(() => new Map()); // groupId → [...itemIds]
  const ids = useLazyRef<Map<string, string>>(() => new Map()); // id → value
  const listeners = useLazyRef<Set<() => void>>(() => new Set()); // [...rerenders]
  const propsRef = useAsRef(props);
  const { label, children, value, onValueChange, filter, shouldFilter, ...etc } = props;

  const listId = useId();
  const labelId = useId();
  const inputId = useId();

  const schedule = useScheduleLayoutEffect();

  /** Controlled mode `value` handling. */
  useLayoutEffect(() => {
    if (value !== undefined) {
      const v = value.trim().toLowerCase();
      state.current.value = v;
      schedule(6, scrollSelectedIntoView);
      store.emit();
    }
  }, [value]);

  const store: Store = useMemo(() => {
    return {
      subscribe(cb) {
        listeners.current.add(cb);
        return () => listeners.current.delete(cb);
      },
      snapshot() {
        return state.current;
      },
      setState(key, value, opts) {
        if (Object.is(state.current[key], value)) return;
        state.current[key] = value;

        if (key === 'search') {
          // Filter synchronously before emitting back to children
          filterItems();
          sort();
          schedule(1, () => {
            // Select the first item and emit again
            selectFirstItem();
            store.emit();
          });
        } else if (key === 'value') {
          if (propsRef.current.value !== undefined) {
            // If controlled, just call the callback instead of updating state internally
            propsRef.current.onValueChange?.(value as string);
            return;
            // opts is a boolean referring to whether it should NOT be scrolled into view
          } if (!opts) {
            // Scroll the selected item into view
            schedule(5, scrollSelectedIntoView);
          }
        }

        // Notify subscribers that state has changed
        store.emit();
      },
      emit() {
        listeners.current.forEach((l) => l());
      }
    };
  }, []);

  // @ts-expect-error -- port from cmdk
  const context: Context = useMemo(
    () => ({
      // Keep id → value mapping up-to-date
      value(id, value) {
        if (value !== ids.current.get(id)) {
          ids.current.set(id, value);
          state.current.filtered.items.set(id, score(value));
          schedule(2, () => {
            sort();
            store.emit();
          });
        }
      },
      // Track item lifecycle (mount, unmount)
      item(id, groupId) {
        allItems.current.add(id);

        // Track this item within the group
        if (groupId) {
          if (allGroups.current.has(groupId)) {
            // @ts-expect-error -- port from cmdk
            allGroups.current.get(groupId).add(id);
          } else {
            allGroups.current.set(groupId, new Set([id]));
          }
        }

        // Batch this, multiple items can mount in one pass
        // and we should not be filtering/sorting/emitting each time
        schedule(3, () => {
          filterItems();
          sort();

          // Could be initial mount, select the first item if none already selected
          if (!state.current.value) {
            selectFirstItem();
          }

          store.emit();
        });

        return () => {
          ids.current.delete(id);
          allItems.current.delete(id);
          state.current.filtered.items.delete(id);

          // Batch this, multiple items could be removed in one pass
          schedule(4, () => {
            filterItems();

            // The item removed could have been the selected one,
            // so selection should be moved to the first
            selectFirstItem();

            store.emit();
          });
        };
      },
      // Track group lifecycle (mount, unmount)
      group(id) {
        if (!allGroups.current.has(id)) {
          allGroups.current.set(id, new Set());
        }

        return () => {
          ids.current.delete(id);
          allGroups.current.delete(id);
        };
      },
      filter() {
        return propsRef.current.shouldFilter;
      },
      label: label || props['aria-label'],
      listId,
      inputId,
      labelId
    }),
    []
  );

  function score(value: string) {
    const filter = propsRef.current.filter ?? defaultFilter;
    // @ts-expect-error -- port from cmdk
    return value ? filter(value, state.current.search) : 0;
  }

  /** Sorts items by score, and groups by highest item score. */
  function sort() {
    if (
      !ref.current
      || !state.current.search
      // Explicitly false, because true | undefined is the default
      || propsRef.current.shouldFilter === false
    ) {
      return;
    }

    const scores = state.current.filtered.items;

    // Sort the groups
    const groups: Array<[string, number]> = [];
    state.current.filtered.groups.forEach((value) => {
      const items = allGroups.current.get(value);

      // Get the maximum score of the group's items
      let max = 0;
      // @ts-expect-error -- port from cmdk
      items.forEach((item) => {
        const score = scores.get(item);
        // @ts-expect-error -- port from cmdk
        max = Math.max(score, max);
      });

      groups.push([value, max]);
    });

    // Sort items within groups to bottom
    // Sort items outside of groups
    // Sort groups to bottom (pushes all non-grouped items to the top)
    const list = ref.current.querySelector(LIST_SELECTOR);

    // Sort the items
    getValidItems()
      .sort((a, b) => {
        const valueA = a.getAttribute(VALUE_ATTR);
        const valueB = b.getAttribute(VALUE_ATTR);
        // @ts-expect-error -- port from cmdk
        return (scores.get(valueB) ?? 0) - (scores.get(valueA) ?? 0);
      })
      .forEach((item) => {
        const group = item.closest(GROUP_ITEMS_SELECTOR);

        if (group) {
          // @ts-expect-error -- port from cmdk
          group.appendChild(item.parentElement === group ? item : item.closest(`${GROUP_ITEMS_SELECTOR} > *`));
        } else {
          // @ts-expect-error -- port from cmdk
          list.appendChild(item.parentElement === list ? item : item.closest(`${GROUP_ITEMS_SELECTOR} > *`));
        }
      });

    groups
      .sort((a, b) => b[1] - a[1])
      .forEach((group) => {
        // @ts-expect-error -- port from cmdk
        const element = ref.current.querySelector(`${GROUP_SELECTOR}[${VALUE_ATTR}="${group[0]}"]`);
        // @ts-expect-error -- port from cmdk
        element?.parentElement.appendChild(element);
      });
  }

  function selectFirstItem() {
    const item = getValidItems().find((item) => !item.ariaDisabled);
    const value = item?.getAttribute(VALUE_ATTR);
    // @ts-expect-error -- port from cmdk
    state.current.value = value || undefined;
  }

  /** Filters the current items. */
  function filterItems() {
    if (
      !state.current.search
      // Explicitly false, because true | undefined is the default
      || propsRef.current.shouldFilter === false
    ) {
      state.current.filtered.count = allItems.current.size;
      // Do nothing, each item will know to show itself because search is empty
      return;
    }

    // Reset the groups
    state.current.filtered.groups = new Set();
    let itemCount = 0;

    // Check which items should be included
    for (const id of allItems.current) {
      const value = ids.current.get(id);
      // @ts-expect-error -- port from cmdk
      const rank = score(value);
      state.current.filtered.items.set(id, rank);
      if (rank > 0) itemCount++;
    }

    // Check which groups have at least 1 item shown
    for (const [groupId, group] of allGroups.current) {
      for (const itemId of group) {
        // @ts-expect-error -- port from cmdk
        if (state.current.filtered.items.get(itemId) > 0) {
          state.current.filtered.groups.add(groupId);
          break;
        }
      }
    }

    state.current.filtered.count = itemCount;
  }

  function scrollSelectedIntoView() {
    const item = getSelectedItem();

    if (item) {
      if (item.parentElement?.firstChild === item) {
        // First item in Group, ensure heading is in view
        item.closest(GROUP_SELECTOR)?.querySelector(GROUP_HEADING_SELECTOR)?.scrollIntoView({ block: 'nearest' });
      }

      // Ensure the item is always in view
      item.scrollIntoView({ block: 'nearest' });
    }
  }

  /** Getters */

  function getSelectedItem() {
    // @ts-expect-error -- port from cmdk
    return ref.current.querySelector(`${ITEM_SELECTOR}[aria-selected="true"]`);
  }

  function getValidItems() {
    // @ts-expect-error -- port from cmdk
    return Array.from(ref.current.querySelectorAll(VALID_ITEM_SELECTOR));
  }

  /** Setters */

  function updateSelectedToIndex(index: number) {
    const items = getValidItems();
    const item = items[index];
    // @ts-expect-error -- port from cmdk
    if (item) store.setState('value', item.getAttribute(VALUE_ATTR));
  }

  function updateSelectedByChange(change: 1 | -1) {
    const selected = getSelectedItem();
    const items = getValidItems();
    const index = selected ? items.indexOf(selected) : -1;

    // Get item at this index
    let newSelected = items[index + change];

    if (propsRef.current.loop) {
      newSelected
        = index + change < 0
          ? items[items.length - 1]
          : (index + change === items.length
            ? items[0]
            : items[index + change]);
    }
    // @ts-expect-error -- port from cmdk
    if (newSelected) store.setState('value', newSelected.getAttribute(VALUE_ATTR));
  }

  function updateSelectedToGroup(change: 1 | -1) {
    const selected = getSelectedItem();
    let group = selected?.closest(GROUP_SELECTOR);
    let item: HTMLElement;
    // @ts-expect-error -- port from cmdk
    while (group && !item) {
      group = change > 0 ? findNextSibling(group, GROUP_SELECTOR) : findPreviousSibling(group, GROUP_SELECTOR);
      // @ts-expect-error -- port from cmdk
      item = group?.querySelector(VALID_ITEM_SELECTOR);
    }
    // @ts-expect-error -- port from cmdk
    if (item) {
      // @ts-expect-error -- port from cmdk
      store.setState('value', item.getAttribute(VALUE_ATTR));
    } else {
      updateSelectedByChange(change);
    }
  }

  const last = () => updateSelectedToIndex(getValidItems().length - 1);

  const next = (e: React.KeyboardEvent) => {
    e.preventDefault();

    if (e.metaKey) {
      // Last item
      last();
    } else if (e.altKey) {
      // Next group
      updateSelectedToGroup(1);
    } else {
      // Next item
      updateSelectedByChange(1);
    }
  };

  const prev = (e: React.KeyboardEvent) => {
    e.preventDefault();

    if (e.metaKey) {
      // First item
      updateSelectedToIndex(0);
    } else if (e.altKey) {
      // Previous group
      updateSelectedToGroup(-1);
    } else {
      // Previous item
      updateSelectedByChange(-1);
    }
  };

  return (
    <div
      ref={mergeRefs([ref, forwardedRef])}
      {...etc}
      cmdk-root=""
      onKeyDown={(e) => {
        etc.onKeyDown?.(e);

        if (!e.defaultPrevented) {
          switch (e.key) {
            case 'n':
            case 'j': {
              // vim keybind down
              if (e.ctrlKey) {
                next(e);
              }
              break;
            }
            case 'ArrowDown': {
              next(e);
              break;
            }
            case 'p':
            case 'k': {
              // vim keybind up
              if (e.ctrlKey) {
                prev(e);
              }
              break;
            }
            case 'ArrowUp': {
              prev(e);
              break;
            }
            case 'Home': {
              // First item
              e.preventDefault();
              updateSelectedToIndex(0);
              break;
            }
            case 'End': {
              // Last item
              e.preventDefault();
              last();
              break;
            }
            case 'Enter': {
              // Trigger item onSelect
              e.preventDefault();
              const item = getSelectedItem();
              if (item) {
                const event = new Event(SELECT_EVENT);
                item.dispatchEvent(event);
              }
            }
          }
        }
      }}
    >
      <label
        cmdk-label=""
        htmlFor={context.inputId}
        id={context.labelId}
        // Screen reader only
        style={srOnlyStyles}
      >
        {label}
      </label>
      <StoreContext.Provider value={store}>
        <CommandContext.Provider value={context}>{children}</CommandContext.Provider>
      </StoreContext.Provider>
    </div>
  );
});

/**
 * Command menu item. Becomes active on pointer enter or through keyboard navigation.
 * Preferably pass a `value`, otherwise the value will be inferred from `children` or
 * the rendered item's `textContent`.
 */
const Item = forwardRef<HTMLDivElement, ItemProps>((props, forwardedRef) => {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const groupId = useContext(GroupContext);
  const context = useCommand();
  const propsRef = useAsRef(props);

  useLayoutEffect(() => {
    return context.item(id, groupId);
  }, []);

  const value = useValue(id, ref, [props.value, props.children, ref]);

  const store = useStore();
  const selected = useCmdk((state) => state.value && state.value === value.current);
  const render = useCmdk((state) =>
    // @ts-expect-error -- port from cmdk
    (context.filter() ? (state.search ? state.filtered.items.get(id) > 0 : true) : true));

  useEffect(() => {
    const element = ref.current;
    if (!element || props.disabled) return;
    element.addEventListener(SELECT_EVENT, onSelect);
    return () => element.removeEventListener(SELECT_EVENT, onSelect);
  }, [render, props.onSelect, props.disabled]);

  function onSelect() {
    // @ts-expect-error -- port from cmdk
    propsRef.current.onSelect?.(value.current, props.value, props.identifier);
  }

  function select() {
    // @ts-expect-error -- port from cmdk
    store.setState('value', value.current, true);
  }

  if (!render) return null;

  const { disabled, value: _, onSelect: __, ...etc } = props;

  return (
    <div
      ref={mergeRefs([ref, forwardedRef])}
      {...etc}
      cmdk-item=""
      role="option"
      aria-disabled={disabled || undefined}
      aria-selected={selected || undefined}
      onPointerMove={disabled ? undefined : select}
      onClick={disabled ? undefined : onSelect}
    >
      {props.children}
    </div>
  );
});

/**
 * Group command menu items together with a heading.
 * Grouped items are always shown together.
 */
const Group = forwardRef<HTMLDivElement, GroupProps>((props, forwardedRef) => {
  const { heading, children, ...etc } = props;
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const context = useCommand();
  const render = useCmdk((state) => (context.filter() ? (state.search ? state.filtered.groups.has(id) : true) : true));

  useLayoutEffect(() => {
    return context.group(id);
  }, []);

  useValue(id, ref, [props.value, props.heading, headingRef]);

  const inner = <GroupContext.Provider value={id}>{children}</GroupContext.Provider>;

  return (
    <div
      ref={mergeRefs([ref, forwardedRef])}
      {...etc}
      cmdk-group=""
      role="presentation"
      hidden={render ? undefined : true}
    >
      {heading && (
        <div ref={headingRef} cmdk-group-heading="" aria-hidden id={headingId}>
          {heading}
        </div>
      )}
      <div cmdk-group-items="" role="group" aria-labelledby={heading ? headingId : undefined}>
        {inner}
      </div>
    </div>
  );
});

/**
 * A visual and semantic separator between items or groups.
 * Visible when the search query is empty or `alwaysRender` is true, hidden otherwise.
 */
const Separator = forwardRef<HTMLDivElement, SeparatorProps>((props, forwardedRef) => {
  const { alwaysRender, ...etc } = props;
  const ref = useRef<HTMLDivElement>(null);
  const render = useCmdk((state) => !state.search);

  if (!alwaysRender && !render) return null;
  return <div ref={mergeRefs([ref, forwardedRef])} {...etc} cmdk-separator="" role="separator" />;
});

/**
 * Command menu input.
 * All props are forwarded to the underyling `input` element.
 */
const Input = forwardRef<HTMLInputElement, InputProps>((props, forwardedRef) => {
  const { onValueChange, ...etc } = props;
  const isControlled = props.value != null;
  const store = useStore();
  const search = useCmdk((state) => state.search);
  const context = useCommand();

  useEffect(() => {
    if (props.value != null) {
      store.setState('search', props.value);
    }
  }, [props.value]);

  return (
    <input
      ref={forwardedRef}
      {...etc}
      cmdk-input=""
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      aria-autocomplete="list"
      role="combobox"
      aria-expanded={true}
      aria-controls={context.listId}
      aria-labelledby={context.labelId}
      id={context.inputId}
      type="text"
      value={isControlled ? props.value : search}
      onChange={(e) => {
        if (!isControlled) {
          store.setState('search', e.target.value);
        }

        onValueChange?.(e.target.value);
      }}
    />
  );
});

/**
 * Contains `Item`, `Group`, and `Separator`.
 * Use the `--cmdk-list-height` CSS variable to animate height based on the number of results.
 */
const List = forwardRef<HTMLDivElement, ListProps>((props, forwardedRef) => {
  const { children, ...etc } = props;
  const ref = useRef<HTMLDivElement>(null);
  const height = useRef<HTMLDivElement>(null);
  const context = useCommand();

  useEffect(() => {
    if (height.current && ref.current) {
      const el = height.current;
      const wrapper = ref.current;
      // @ts-expect-error -- port from cmdk
      let animationFrame;
      const observer = new ResizeObserver(() => {
        animationFrame = requestAnimationFrame(() => {
          const height = el.getBoundingClientRect().height;
          wrapper.style.setProperty('--cmdk-list-height', height.toFixed(1) + 'px');
        });
      });
      observer.observe(el);
      return () => {
        // @ts-expect-error -- port from cmdk
        cancelAnimationFrame(animationFrame);
        observer.unobserve(el);
      };
    }
  }, []);

  return (
    <div
      ref={mergeRefs([ref, forwardedRef])}
      {...etc}
      cmdk-list=""
      role="listbox"
      aria-label="Suggestions"
      id={context.listId}
      aria-labelledby={context.inputId}
    >
      <div ref={height} cmdk-list-sizer="">
        {children}
      </div>
    </div>
  );
});

/**
 * Renders the command menu in a Radix Dialog.
 */
const Dialog = forwardRef<HTMLDivElement, DialogProps>((props, forwardedRef) => {
  const {
    open,
    onOpenChange,
    container,
    dialogOverlayClassName,
    dialogContentClassName,
    ...etc
  } = props;
  return (
    <RadixDialogRoot open={open} onOpenChange={onOpenChange}>
      <RadixDialogPortal container={container}>
        <RadixDialogOverlay className={dialogOverlayClassName} cmdk-overlay="" />
        <RadixDialogContent className={dialogContentClassName} aria-label={props.label} cmdk-dialog="">
          <Command ref={forwardedRef} {...etc} />
        </RadixDialogContent>
      </RadixDialogPortal>
    </RadixDialogRoot>
  );
});

/**
 * Automatically renders when there are no results for the search query.
 */
const Empty = forwardRef<HTMLDivElement, EmptyProps>((props, forwardedRef) => {
  const isClient = useIsClient();
  const render = useCmdk((state) => state.filtered.count === 0);

  if (!isClient || !render) return null;
  return <div ref={forwardedRef} {...props} cmdk-empty="" role="presentation" />;
});

/**
 * You should conditionally render this with `progress` while loading asynchronous items.
 */
const Loading = forwardRef<HTMLDivElement, LoadingProps>((props, forwardedRef) => {
  const { progress, children, ...etc } = props;

  return (
    <div
      ref={forwardedRef}
      {...etc}
      cmdk-loading=""
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading..."
    >
      <div aria-hidden>{children}</div>
    </div>
  );
});

const pkg = Object.assign(Command, {
  List,
  Item,
  Input,
  Group,
  Separator,
  Dialog,
  Empty,
  Loading
});
export { useCmdk as useCommandState };
export { pkg as Command };

/**
 *
 *
 * Helpers
 *
 *
 */

function findNextSibling(el: Element, selector: string) {
  let sibling = el.nextElementSibling;

  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.nextElementSibling;
  }
}

function findPreviousSibling(el: Element, selector: string) {
  let sibling = el.previousElementSibling;

  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.previousElementSibling;
  }
}

function useAsRef<T>(data: T) {
  const ref = useRef<T>(data);

  useLayoutEffect(() => {
    ref.current = data;
  });

  return ref;
}

function useLazyRef<T>(fn: () => T) {
  const ref = useRef<T>(null);

  if (ref.current === undefined) {
    ref.current = fn();
  }

  return ref as React.MutableRefObject<T>;
}

// ESM is still a nightmare with Next.js so I'm just gonna copy the package code in
// https://github.com/gregberge/react-merge-refs
// Copyright (c) 2020 Greg Bergé
function mergeRefs<T = any>(refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        ; (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

/** Run a selector against the store state. */
function useCmdk<T = any>(selector: (state: State) => T) {
  const store = useStore();
  const cb = () => selector(store.snapshot());
  return useSyncExternalStore(store.subscribe, cb, cb);
}

function useValue(
  id: string,
  ref: React.RefObject<HTMLElement | null>,
  deps: Array<string | React.ReactNode | React.RefObject<HTMLElement | null>>
) {
  const valueRef = useRef<string | undefined>(undefined);
  const context = useCommand();

  useLayoutEffect(() => {
    const value = (() => {
      for (const part of deps) {
        if (typeof part === 'string') {
          return part.trim().toLowerCase();
        }
        // @ts-expect-error -- port from cmdk
        if (typeof part === 'object' && 'current' in part && part.current) {
          return part.current.textContent?.trim().toLowerCase();
        }
      }
    })();
    // @ts-expect-error -- port from cmdk
    context.value(id, value);
    // @ts-expect-error -- port from cmdk
    ref.current?.setAttribute(VALUE_ATTR, value);
    valueRef.current = value;
  });

  return valueRef;
}

/** Imperatively run a function on the next layout effect cycle. */
const useScheduleLayoutEffect = () => {
  const [s, ss] = useState<object>();
  const fns = useLazyRef(() => new Map<string | number, () => void>());

  useLayoutEffect(() => {
    fns.current.forEach((f) => f());
    fns.current = new Map();
  }, [s]);

  return (id: string | number, cb: () => void) => {
    fns.current.set(id, cb);
    ss({});
  };
};

const srOnlyStyles = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0'
} as const;
