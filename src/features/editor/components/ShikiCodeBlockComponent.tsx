'use client'
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useCallback, useEffect, useRef } from 'react'
import flourite from 'flourite'

interface ShikiCodeBlockAttributes {
    language: string
}

type ShikiCodeBlockProps = NodeViewProps & {
    node: {
        attrs: ShikiCodeBlockAttributes
    }
    updateAttributes: (attrs: Partial<ShikiCodeBlockAttributes>) => void
    extension: {
        options: {
            defaultTheme: string
            defaultLanguage: string
        }
    }
}

export const ShikiCodeBlockComponent = (props: ShikiCodeBlockProps) => {
    const {
        node: { attrs: { language: defaultLanguage } = {} },
        updateAttributes,
    } = props

    const contentRef = useRef<HTMLDivElement>(null)

    const detectLanguage = useCallback(() => {
        if (!contentRef.current) return

        const codeElement = contentRef.current.querySelector('code')
        if (!codeElement || !codeElement.textContent) return

        const code = codeElement.textContent
        if (!code.trim()) return

        try {
            // Use flourite for detection
            const result = flourite(code, { shiki: true })

            // Flourite returns an array of possibilities with confidence levels
            if (
                result &&
                result.language &&
                result.language !== defaultLanguage
            ) {
                updateAttributes({ language: result.language })
            }
        } catch (error) {
            console.error('Error detecting language:', error)
        }
    }, [updateAttributes, defaultLanguage])

    useEffect(() => {
        setTimeout(detectLanguage, 100)

        if (contentRef.current) {
            const observer = new MutationObserver(detectLanguage)

            observer.observe(contentRef.current, {
                childList: true,
                characterData: true,
                subtree: true,
            })

            return () => observer.disconnect()
        }
    }, [detectLanguage])

    return (
        <NodeViewWrapper className="relative ">
            <div ref={contentRef}>
                <pre
                    className={
                        'bg-black rounded-lg text-white font-jetbrains my-6 py-3 px-2'
                    }
                >
                    <NodeViewContent
                        as="code"
                        className={'bg-none text-xs p-0 break-all'}
                    />
                </pre>
            </div>
        </NodeViewWrapper>
    )
}
