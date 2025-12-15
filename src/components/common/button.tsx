import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/common';

const buttonVariants = cva(
  'group inline-flex items-center justify-center whitespace-nowrap transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-button-brand-filled-primary-default text-button-brand-filled-on-primary-default hover:bg-button-brand-filled-primary-hover active:bg-button-brand-filled-primary-active active:text-button-brand-filled-on-primary-active disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-button-state-filled-disable disabled:text-button-state-filled-on-disable',
        secondary:
          'bg-button-brand-filled-secondary-default text-button-brand-filled-on-secondary-default hover:bg-button-brand-filled-secondary-hover active:bg-button-brand-filled-secondary-active active:text-button-brand-filled-on-secondary-active disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-button-state-filled-disable disabled:text-button-state-filled-on-disable',
        neutral:
          'bg-button-neutral-filled-neutral-default text-button-neutral-filled-on-neutral-default hover:bg-button-neutral-filled-neutral-hover active:bg-button-neutral-filled-neutral-active active:text-button-neutral-filled-on-neutral-active disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-button-state-filled-disable disabled:text-button-state-filled-on-disable',
        outline:
          'border border-button-brand-outline-on-primary-default bg-transparent text-button-brand-outline-on-primary-default hover:bg-button-brand-outline-primary-hover-surface active:border-button-brand-outline-primary-active-outline active:bg-button-brand-outline-primary-active-surface active:text-button-brand-outline-primary-active-outline disabled:border-button-state-outline-disable disabled:text-button-state-outline-on-disable',
        borderless:
          'bg-transparent text-button-brand-outline-on-primary-default hover:text-button-brand-outline-on-primary-hover active:text-button-brand-outline-primary-active-outline disabled:text-button-state-outline-on-disable',
      },
      size: {
        xs: 'gap-spacing-lv-0 px-spacing-lv-4 py-spacing-lv-2 text-xs font-extrabold',
        default: 'gap-spacing-lv-2 px-spacing-lv-6 py-spacing-lv-3 text-base font-semibold',
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

// Info: (20240319 - Shirley) 使用 forwardRef 將引用傳遞給 DOM 元素
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
