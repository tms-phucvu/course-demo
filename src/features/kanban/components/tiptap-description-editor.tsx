"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/core/lib/utils";
import { useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Quote,
  List,
  ListOrdered,
  Minus,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Heading2,
  Heading3,
  Pilcrow,
  SquareCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TiptapDescriptionEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** When true, sync value into editor (e.g. when modal opens or form resets). */
  syncContent?: boolean;
}

function ToolbarButton({
  onClick,
  disabled,
  active,
  ariaLabel,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  active?: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type='button'
      variant='ghost'
      size='icon'
      className={cn("h-8 w-8", active && "bg-muted")}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
}

/**
 * Rich text description editor using Tiptap. Outputs HTML string.
 * Use syncContent when parent resets or opens so editor content matches value.
 */
export function TiptapDescriptionEditor({
  value,
  onChange,
  placeholder = "Write a description...",
  disabled = false,
  className,
  syncContent = false,
}: TiptapDescriptionEditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder })],
    content: value || "",
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[120px] w-full resize-y rounded-b-md border-0 bg-transparent px-3 py-2 text-sm outline-none focus:ring-0",
          "prose prose-sm dark:prose-invert max-w-none",
          "[&_ul]:list-disc [&_ol]:list-decimal [&_ul,_ol]:pl-6",
          "[&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:text-xs",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground"
        ),
      },
    },
    onUpdate: ({ editor: e }) => {
      onChangeRef.current(e.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (syncContent && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [syncContent, value, editor]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl ?? "https://");
    if (url == null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div
      className={cn(
        "add-task-tiptap border-input bg-background ring-offset-background rounded-md border text-sm",
        "focus-within:ring-ring focus-within:ring-1 focus-within:ring-offset-2",
        "[&_.ProseMirror]:min-h-[120px] [&_.ProseMirror]:p-3 [&_.ProseMirror]:outline-none",
        className
      )}
    >
      {editor != null && (
        <div className='border-input flex flex-wrap items-center gap-0.5 border-b px-1 py-1'>
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={disabled || !editor.can().chain().focus().undo().run()}
            ariaLabel='Undo'
          >
            <Undo2 className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={disabled || !editor.can().chain().focus().redo().run()}
            ariaLabel='Redo'
          >
            <Redo2 className='h-4 w-4' />
          </ToolbarButton>
          <span className='bg-border mx-1 h-5 w-px' aria-hidden />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={
              disabled || !editor.can().chain().focus().toggleBold().run()
            }
            active={editor.isActive("bold")}
            ariaLabel='Bold'
          >
            <Bold className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={
              disabled || !editor.can().chain().focus().toggleItalic().run()
            }
            active={editor.isActive("italic")}
            ariaLabel='Italic'
          >
            <Italic className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={
              disabled || !editor.can().chain().focus().toggleUnderline().run()
            }
            active={editor.isActive("underline")}
            ariaLabel='Underline'
          >
            <UnderlineIcon className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={
              disabled || !editor.can().chain().focus().toggleStrike().run()
            }
            active={editor.isActive("strike")}
            ariaLabel='Strikethrough'
          >
            <Strikethrough className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={
              disabled || !editor.can().chain().focus().toggleCode().run()
            }
            active={editor.isActive("code")}
            ariaLabel='Inline code'
          >
            <Code className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={setLink}
            disabled={disabled}
            active={editor.isActive("link")}
            ariaLabel='Link'
          >
            <LinkIcon className='h-4 w-4' />
          </ToolbarButton>
          <span className='bg-border mx-1 h-5 w-px' aria-hidden />
          <ToolbarButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            disabled={
              disabled || !editor.can().chain().focus().setParagraph().run()
            }
            active={editor.isActive("paragraph")}
            ariaLabel='Paragraph'
          >
            <Pilcrow className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            disabled={
              disabled ||
              !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            ariaLabel='Heading 2'
          >
            <Heading2 className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            disabled={
              disabled ||
              !editor.can().chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
            ariaLabel='Heading 3'
          >
            <Heading3 className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={
              disabled || !editor.can().chain().focus().toggleBlockquote().run()
            }
            active={editor.isActive("blockquote")}
            ariaLabel='Blockquote'
          >
            <Quote className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={
              disabled || !editor.can().chain().focus().toggleCodeBlock().run()
            }
            active={editor.isActive("codeBlock")}
            ariaLabel='Code block'
          >
            <SquareCode className='h-4 w-4' />
          </ToolbarButton>
          <span className='bg-border mx-1 h-5 w-px' aria-hidden />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={
              disabled || !editor.can().chain().focus().toggleBulletList().run()
            }
            active={editor.isActive("bulletList")}
            ariaLabel='Bullet list'
          >
            <List className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={
              disabled ||
              !editor.can().chain().focus().toggleOrderedList().run()
            }
            active={editor.isActive("orderedList")}
            ariaLabel='Numbered list'
          >
            <ListOrdered className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            disabled={
              disabled ||
              !editor.can().chain().focus().setHorizontalRule().run()
            }
            ariaLabel='Horizontal rule'
          >
            <Minus className='h-4 w-4' />
          </ToolbarButton>
        </div>
      )}
      {editor != null ? (
        <EditorContent editor={editor} />
      ) : (
        <div
          className='text-muted-foreground min-h-[120px] rounded-b-md px-3 py-2 text-sm'
          aria-hidden
        >
          {placeholder}
        </div>
      )}
    </div>
  );
}
