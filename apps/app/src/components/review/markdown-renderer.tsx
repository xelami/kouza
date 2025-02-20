"use client"

import React from "react"
import dynamic from "next/dynamic"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import { Components } from "react-markdown"

const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
})

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Components = {
    h1: ({ children }) => (
      <h1 className="mt-8 mb-4 text-3xl font-bold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-6 mb-4 text-2xl font-semibold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-4 mb-3 text-xl font-semibold">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-4 mb-2 text-lg font-semibold">{children}</h4>
    ),

    p: ({ children, ...props }) => {
      const hasPreElement = React.Children.toArray(children).some(
        (child) => React.isValidElement(child) && child.type === "pre"
      )

      if (hasPreElement) {
        return <>{children}</>
      }

      return (
        <p className="mb-4 leading-relaxed" {...props}>
          {children}
        </p>
      )
    },
    ul: ({ children }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,

    a: ({ href, children }) => (
      <a
        href={href}
        className="text-primary underline hover:text-primary/80"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,

    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary/20 pl-4 italic my-4">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-8 border-border" />,

    code: ({
      className,
      children,
      inline,
      ...props
    }: React.ComponentPropsWithoutRef<"code"> & { inline?: boolean }) => {
      const match = /language-(\w+)/.exec(className || "")
      const language = match ? match[1] : ""

      return !inline ? (
        <div className="relative my-6 rounded-lg">
          {language && (
            <div className="absolute right-4 top-2 text-xs text-muted-foreground">
              {language}
            </div>
          )}
          <pre className="overflow-x-auto rounded-lg bg-secondary p-4 text-sm">
            <code className={className}>{children}</code>
          </pre>
        </div>
      ) : (
        <code className="rounded bg-secondary px-1.5 py-0.5 text-sm font-mono">
          {children}
        </code>
      )
    },

    table: ({ children }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="border-b">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y">{children}</tbody>,
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="border-b p-4 text-left font-medium">{children}</th>
    ),
    td: ({ children }) => <td className="p-4">{children}</td>,
  }

  return (
    <ReactMarkdown rehypePlugins={[rehypeHighlight]} components={components}>
      {content || ""}
    </ReactMarkdown>
  )
}
