"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Link as LinkIcon,
    Image as ImageIcon
} from 'lucide-react'

interface RichTextEditorProps {
    content: string
    onChange: (html: string) => void
    placeholder?: string
    minimal?: boolean
}

export default function RichTextEditor({
    content,
    onChange,
    placeholder = "Mulakan menulis...",
    minimal = false
}: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false, // Fix SSR hydration mismatch
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Image.configure({
                inline: true,
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-cyan-400 hover:text-cyan-300 underline',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none min-h-[200px] px-4 py-3 focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) {
        return null
    }

    const addImage = async () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (!file) return

            try {
                const formData = new FormData()
                formData.append('file', file)

                // Show uploading toast
                const toast = (await import('react-hot-toast')).default
                const toastId = toast.loading('📤 Uploading image...')

                const res = await fetch('/api/media/upload', {
                    method: 'POST',
                    body: formData,
                })

                const data = await res.json()

                if (data.success) {
                    // Insert image into editor
                    editor.chain().focus().setImage({ src: data.data.url }).run()
                    toast.success('✅ Image inserted!', { id: toastId })
                } else {
                    throw new Error(data.error)
                }
            } catch (error) {
                const toast = (await import('react-hot-toast')).default
                const message = error instanceof Error ? error.message : 'Upload failed'
                toast.error(`❌ ${message}`)
            }
        }

        input.click()
    }

    const addLink = () => {
        const url = window.prompt('Masukkan URL link:')
        if (url) {
            editor.chain().focus().setLink({ href: url }).run()
        }
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            {/* Toolbar */}
            {!minimal && (
                <div className="border-b border-white/10 p-2 flex flex-wrap gap-1 bg-white/5">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('bold') ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'
                            }`}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('italic') ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'
                            }`}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="w-4 h-4" />
                    </button>

                    <div className="w-px bg-white/10 mx-1" />

                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'
                            }`}
                        title="Heading 1"
                    >
                        <Heading1 className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'
                            }`}
                        title="Heading 2"
                    >
                        <Heading2 className="w-4 h-4" />
                    </button>

                    <div className="w-px bg-white/10 mx-1" />

                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('bulletList') ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'
                            }`}
                        title="Bullet List"
                    >
                        <List className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('orderedList') ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'
                            }`}
                        title="Numbered List"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </button>

                    <div className="w-px bg-white/10 mx-1" />

                    <button
                        onClick={addLink}
                        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('link') ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'
                            }`}
                        title="Add Link"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </button>

                    <button
                        onClick={addImage}
                        className="p-2 rounded hover:bg-white/10 transition-colors text-gray-300"
                        title="Add Image"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Editor Content */}
            <EditorContent editor={editor} className="text-white" />
        </div>
    )
}
