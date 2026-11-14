import React from 'react';

export default function Pop({
  children,
  delay = 0,
  className = '',
  as: Component = 'div',
  ...props
}) {
  const style = delay > 0 ? { animationDelay: `${delay}ms` } : undefined;

  return (
    <Component className={`pop-in ${className}`} style={style} {...props}>
      {children}
    </Component>
  );
}

