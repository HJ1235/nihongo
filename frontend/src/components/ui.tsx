import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return <button className={cx('ui-button', `ui-button-${variant}`, className)} {...props} />;
}

type ButtonLinkProps = LinkProps & {
  variant?: Variant;
};

export function ButtonLink({ className, variant = 'primary', ...props }: ButtonLinkProps) {
  return <Link className={cx('ui-button', `ui-button-${variant}`, className)} {...props} />;
}

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <article className={cx('ui-card', className)} {...props} />;
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx('ui-badge', className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx('ui-input', className)} {...props} />;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="summary">{description}</p>}
      </div>
      {action && <div className="header-actions">{action}</div>}
    </section>
  );
}
