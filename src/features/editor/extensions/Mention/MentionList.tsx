import { MentionNodeAttrs } from '@tiptap/extension-mention'

import { SuggestionProps } from '@tiptap/suggestion'
import {
    forwardRef,
    KeyboardEvent,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react'
import { MentionItem } from '.'

interface IProps extends SuggestionProps<string, MentionNodeAttrs> {
    loading?: boolean
    error?: boolean
}

// Styled MentionList component with modern UI design
export const MentionList = forwardRef(
    ({ loading, error, ...props }: IProps, ref) => {
        const [selectedIndex, setSelectedIndex] = useState(0)

        const items =
            (props.editor.storage.mention.items as MentionItem[]) || props.items

        const selectItem = (index: number) => {
            const item = items[index]

            if (item) {
                props.command({ id: item.id })
            }
        }

        const upHandler = () => {
            setSelectedIndex(
                (selectedIndex + props.items.length - 1) % props.items.length,
            )
        }

        const downHandler = () => {
            setSelectedIndex((selectedIndex + 1) % props.items.length)
        }

        const enterHandler = () => {
            selectItem(selectedIndex)
        }

        useEffect(() => setSelectedIndex(0), [props.items])

        useImperativeHandle(ref, () => ({
            onKeyDown: ({ event }: { event: KeyboardEvent }) => {
                if (event.key === 'ArrowUp') {
                    upHandler()
                    return true
                }

                if (event.key === 'ArrowDown') {
                    downHandler()
                    return true
                }

                if (event.key === 'Enter') {
                    enterHandler()
                    return true
                }

                return false
            },
        }))

        return (
            <div className="border border-neutral-600 shadow-xl bg-neutral-800 shadow-black/20 flex flex-col rounded-lg overflow-hidden max-h-80 min-w-64 backdrop-blur-sm">
                {loading && (
                    <div className="flex items-center justify-center py-4 px-3 text-neutral-400 text-sm">
                        <div className="animate-spin w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full mr-2"></div>
                        Loading...
                    </div>
                )}
                {!loading && !error && items.length ? (
                    <div className="py-1">
                        {items.map((item, index) => (
                            <button
                                className={`
                                    w-full text-left px-3 py-2 text-sm transition-all duration-150 ease-out
                                    ${
                                        index === selectedIndex
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-neutral-200 hover:bg-neutral-700 hover:text-white'
                                    }
                                    focus:outline-none focus:bg-blue-600 focus:text-white
                                    active:bg-blue-700
                                `.trim()}
                                key={index}
                                onClick={() => selectItem(index)}
                            >
                                <div className="flex items-center">
                                    <div
                                        className={`
                                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3
                                        ${
                                            index === selectedIndex
                                                ? 'bg-white/20 text-white'
                                                : 'bg-neutral-600 text-neutral-300'
                                        }
                                    `.trim()}
                                    >
                                        {item.label.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium">
                                        {item.label}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    !loading && (
                        <div className="flex items-center justify-center py-6 px-3 text-neutral-500 text-sm">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            No results found
                        </div>
                    )
                )}
            </div>
        )
    },
)
MentionList.displayName = 'MentionList'
