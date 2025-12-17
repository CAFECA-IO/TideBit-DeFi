import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/common';

// Info: (20251216 - Julian) Disabled styles
const fillColorDisabledStyles =
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-button-state-filled-disable disabled:text-button-state-filled-on-disable';
const outlineDisabledStyles =
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-button-state-outline-disable disabled:text-button-state-outline-on-disable';
const textDisabledStyles =
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-button-state-outline-on-disable';

const buttonVariants = cva(
  'group inline-flex items-center justify-center whitespace-nowrap transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        // Info: (20251216 - Julian) ======= Fill colors =======
        default: `bg-button-brand-filled-primary-default text-button-brand-filled-on-primary-default enabled:hover:bg-button-brand-filled-primary-hover enabled:active:bg-button-brand-filled-primary-active enabled:active:text-button-brand-filled-on-primary-active ${fillColorDisabledStyles}`,
        secondary: `bg-button-brand-filled-secondary-default text-button-brand-filled-on-secondary-default enabled:hover:bg-button-brand-filled-secondary-hover enabled:active:bg-button-brand-filled-secondary-active enabled:active:text-button-brand-filled-on-secondary-active ${fillColorDisabledStyles}`,
        neutral: `bg-button-neutral-filled-neutral-default text-button-neutral-filled-on-neutral-default enabled:hover:bg-button-neutral-filled-neutral-hover enabled:active:bg-button-neutral-filled-neutral-active enabled:active:text-button-neutral-filled-on-neutral-active ${fillColorDisabledStyles}`,
        info: `bg-button-state-filled-info-default text-button-state-filled-on-info-default enabled:hover:bg-button-state-filled-info-hover enabled:hover:text-button-state-filled-on-info-hover enabled:active:bg-button-state-filled-info-active enabled:active:text-button-state-filled-on-info-active ${fillColorDisabledStyles}`,
        // Info: (20251216 - Julian) ======= Outline =======
        outline: `border border-button-brand-outline-on-primary-default bg-transparent text-button-brand-outline-on-primary-default enabled:hover:border-button-brand-outline-primary-hover-outline enabled:hover:bg-button-brand-outline-primary-hover-surface enabled:hover:text-button-brand-outline-on-primary-hover enabled:active:border-button-brand-outline-primary-active-outline enabled:active:bg-button-brand-outline-primary-active-surface enabled:active:text-button-brand-outline-primary-active-outline ${outlineDisabledStyles}`,
        infoOutline: `border border-button-state-outline-info-default bg-transparent text-button-state-outline-on-info-default enabled:hover:border-button-state-outline-info-hover-outline enabled:hover:bg-button-state-outline-info-hover-surface enabled:hover:text-button-state-outline-on-info-hover enabled:active:border-button-state-outline-info-active-outline enabled:active:bg-button-state-outline-info-active-surface enabled:active:text-button-state-outline-info-active-outline ${outlineDisabledStyles}`,
        errorOutline: `border border-button-state-filled-error-default bg-transparent text-button-state-outline-on-error-default enabled:hover:border-button-state-outline-error-hover-outline enabled:hover:bg-button-state-outline-error-hover-surface enabled:hover:text-button-state-outline-on-error-hover enabled:active:border-button-state-outline-error-active-outline enabled:active:bg-button-state-outline-error-active-surface enabled:active:text-button-state-outline-error-active-outline ${outlineDisabledStyles}`,
        // Info: (20251216 - Julian) ======= Text only =======
        borderless: `bg-transparent text-button-brand-outline-on-primary-default enabled:hover:text-button-brand-outline-on-primary-hover enabled:active:text-button-brand-outline-primary-active-outline ${textDisabledStyles}`,
      },
      size: {
        xs: 'gap-spacing-lv-0 px-spacing-lv-4 py-spacing-lv-2 text-xs font-extrabold',
        default: 'gap-spacing-lv-2 px-spacing-lv-6 py-spacing-lv-3 text-base font-semibold',
        square: 'flex size-36px items-center justify-center p-spacing-lv-0',
        rectangle:
          'flex h-36px items-center justify-center px-spacing-lv-4 py-spacing-lv-0 font-black',
      },
      rounded: {
        rounded: 'rounded-radius-rounded',
        'non-rounded': 'rounded-radius-s',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'non-rounded',
    },
  }
);

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const Comp = 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
