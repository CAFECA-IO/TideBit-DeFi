import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface IMarkdownContentProps {
  content: string;
}

const MarkdownContent: React.FC<IMarkdownContentProps> = ({ content }) => {
  const result = (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children, ...props }: React.ComponentPropsWithoutRef<'h1'>) => (
          <h1
            className="mb-3 mt-5 flex items-center gap-2 pb-2 text-[32px] font-bold text-text-neutral-primary"
            {...props}
          >
            {children}
          </h1>
        ),
        h2: ({ children, ...props }: React.ComponentPropsWithoutRef<'h2'>) => (
          <h2
            className="mb-2 mt-4 flex items-center gap-2 text-[1.2rem] text-text-neutral-primary"
            {...props}
          >
            <span className="inline-block h-[18px] w-1 rounded-sm bg-alert-surface-icon-warn font-bold"></span>
            {children}
          </h2>
        ),
        h3: ({ children, ...props }: React.ComponentPropsWithoutRef<'h3'>) => (
          <h3
            className="mb-1.5 mt-3 text-[1.1rem] font-semibold text-text-neutral-primary"
            {...props}
          >
            {children}
          </h3>
        ),
        h4: ({ children, ...props }: React.ComponentPropsWithoutRef<'h4'>) => (
          <h4
            className="mb-1.5 mt-2 text-[1rem] font-semibold text-text-neutral-primary"
            {...props}
          >
            {children}
          </h4>
        ),
        strong: ({ children, ...props }: React.ComponentPropsWithoutRef<'strong'>) => (
          <strong className="text-text-neutral-primary" {...props}>
            {children}
          </strong>
        ),
        ul: ({ children, ...props }: React.ComponentPropsWithoutRef<'ul'>) => (
          <ul className="list-disc pl-5 text-text-neutral-primary" {...props}>
            {children}
          </ul>
        ),
        ol: ({ children, ...props }: React.ComponentPropsWithoutRef<'ol'>) => (
          <ol className="list-decimal pl-5 text-text-neutral-primary" {...props}>
            {children}
          </ol>
        ),
        li: ({
          children,
          ...props
        }: React.ComponentPropsWithoutRef<'li'> & { ordered?: boolean }) => {
          const { ordered, ...rest } = props;
          if (ordered) {
            return (
              <li className="mb-1.5 pl-1" {...rest}>
                {children}
              </li>
            );
          }
          return (
            <li className="relative mb-1.5 pl-0" {...rest}>
              {/* Info: (20251220 - Luphia) 小圓裝飾點 */}
              {/* <span className="absolute -left-[25px] top-[7px] size-1.5 bg-[#FF9800] rounded-full"></span> */}
              {children}
            </li>
          );
        },
        p: ({ children, ...props }: React.ComponentPropsWithoutRef<'p'>) => (
          <p className="text-[14px] font-normal leading-relaxed" {...props}>
            {children}
          </p>
        ),
        a: ({ children, ...props }: React.ComponentPropsWithoutRef<'a'>) => (
          <a className="text-link-default underline hover:text-link-hover" {...props}>
            {children}
          </a>
        ),
        blockquote: ({ children, ...props }: React.ComponentPropsWithoutRef<'blockquote'>) => (
          <blockquote
            className="my-2.5 rounded border-l-4 border-alert-surface-icon-warn bg-alert-surface-warn px-3.5 py-2.5 italic text-alert-text-on-warn"
            {...props}
          >
            {children}
          </blockquote>
        ),
        table: ({ children, ...props }: React.ComponentPropsWithoutRef<'table'>) => (
          <div className="my-5 overflow-x-auto">
            <table
              className="w-full border-collapse border border-table-outline-default text-sm"
              {...props}
            >
              {children}
            </table>
          </div>
        ),
        thead: ({ children, ...props }: React.ComponentPropsWithoutRef<'thead'>) => (
          <thead className="bg-surface-neutral-container-lv1" {...props}>
            {children}
          </thead>
        ),
        tbody: ({ children, ...props }: React.ComponentPropsWithoutRef<'tbody'>) => (
          <tbody {...props}>{children}</tbody>
        ),
        tr: ({ children, ...props }: React.ComponentPropsWithoutRef<'tr'>) => (
          <tr className="border-b border-table-outline-default" {...props}>
            {children}
          </tr>
        ),
        th: ({ children, ...props }: React.ComponentPropsWithoutRef<'th'>) => (
          <th
            className="border-r border-table-outline-default p-3 text-left font-semibold text-table-text-support"
            {...props}
          >
            {children}
          </th>
        ),
        td: ({ children, ...props }: React.ComponentPropsWithoutRef<'td'>) => (
          <td
            className="border-r border-table-outline-default p-3 text-left text-table-text-primary"
            {...props}
          >
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return result;
};

export { MarkdownContent };
