"use client"

import React, { useState, useRef } from "react"
import MarkdownRenderer from "./markdown-renderer"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@kouza/ui/components/tooltip"
import { Button } from "@kouza/ui/components/button"

interface SelectableMarkdownProps {
  content: string
  onCreateContext: (context: string) => void
  onGenerateNote: (note: string) => void
}

export default function SelectableMarkdown({
  content,
  onCreateContext,
  onGenerateNote,
}: SelectableMarkdownProps) {
  const [selectedText, setSelectedText] = useState<string>("")
  const [toolbarPosition, setToolbarPosition] = useState<{
    top: number
    left: number
  } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseUp = (e: React.MouseEvent) => {
    const selection = window.getSelection()
    const text = selection?.toString().trim() || ""

    if (text) {
      setToolbarPosition({
        top: e.pageY - 40,
        left: e.pageX,
      })
      setSelectedText(text)
    } else {
      setToolbarPosition(null)
      setSelectedText("")
    }
  }

  const SelectionToolbar = () => {
    if (!toolbarPosition || !selectedText) return null

    return (
      <div
        className="fixed z-[100] bg-background border rounded shadow-lg flex gap-2 p-2"
        style={{
          top: `${toolbarPosition.top}px`,
          left: `${toolbarPosition.left}px`,
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  onGenerateNote(selectedText)
                  setToolbarPosition(null)
                  setSelectedText("")
                  window.getSelection()?.removeAllRanges()
                }}
              >
                Generate Note
              </Button>
            </TooltipTrigger>
            <TooltipContent className="z-[110]">
              <p>Create a note from selected text</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  onCreateContext(selectedText)
                  setToolbarPosition(null)
                  setSelectedText("")
                  window.getSelection()?.removeAllRanges()
                }}
              >
                Create Context
              </Button>
            </TooltipTrigger>
            <TooltipContent className="z-[110]">
              <p>Use selected text as context for AI</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onMouseUp={handleMouseUp}
      className="relative select-text cursor-text"
    >
      <div className="prose max-w-3xl xl:max-w-none dark:prose-invert">
        <MarkdownRenderer content={content} />
      </div>
      <SelectionToolbar />
    </div>
  )
}
