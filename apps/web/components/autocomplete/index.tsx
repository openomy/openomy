'use client';

import {
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from '@openomy/ui/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type KeyboardEvent,
} from 'react';
import { Skeleton } from '@openomy/ui/components/ui/skeleton';
import { CheckIcon, XIcon } from 'lucide-react';
import { Button } from '@openomy/ui/components/ui/button';
import { cn } from '@/lib/utils';

export type Option = Record<'value' | 'label', string> & Record<string, string>;

type AutoCompleteProps = {
  options: Option[];
  emptyMessage: string;
  value?: Option;
  onValueChange?: (value: Option | undefined) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onSearchValueChange?: (val: string) => void;
  className?: string;
};

export const AutoComplete = ({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading = false,
  onSearchValueChange,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | undefined>(value);
  const [inputValue, setInputValue] = useState<string>(value?.label || '');

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === 'Enter' && input.value !== '') {
        const optionToSelect = options.find(
          (option) => option.label === input.value,
        );
        if (optionToSelect) {
          setSelected(optionToSelect);
          onValueChange?.(optionToSelect);
        }
      }

      if (event.key === 'Escape') {
        input.blur();
      }
    },
    [isOpen, options, onValueChange],
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    setInputValue(selected?.label || '');
  }, [selected]);

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label);

      setSelected(selectedOption);
      onValueChange?.(selectedOption);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange],
  );

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setInputValue('');
    setSelected(undefined);
    onValueChange?.(undefined);
  };

  useEffect(() => {
    onSearchValueChange?.(inputValue);
  }, [inputValue, onSearchValueChange]);

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div
        className={cn(
          "flex items-center justify-between border border-input rounded-md [&_[data-slot='command-input-wrapper']]:border-b-0 [&_[data-slot='command-input-wrapper']]:flex-1",
        )}
      >
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={isLoading ? undefined : setInputValue}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="text-sm flex-1"
        />
        {inputValue && (
          <Button
            className="w-6 h-6 mr-2 rounded-full cursor-pointer"
            variant="ghost"
            onClick={handleClear}
          >
            <XIcon />
          </Button>
        )}
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            'animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl outline-none',
            'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 origin-(--radix-popover-content-transform-origin) rounded-md border p-2 shadow-md outline-hidden',
            isOpen ? 'block' : 'hidden',
          )}
        >
          <CommandList className="">
            {isLoading ? (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            ) : null}
            {options.length > 0 && !isLoading ? (
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selected?.value === option.value;
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(option)}
                      className={cn(
                        'flex w-full items-center gap-2',
                        !isSelected ? 'pl-8' : null,
                      )}
                    >
                      {isSelected ? <CheckIcon className="w-4" /> : null}
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}
            {!isLoading ? (
              <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                {emptyMessage}
              </CommandPrimitive.Empty>
            ) : null}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
