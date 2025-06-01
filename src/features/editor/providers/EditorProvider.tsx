'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { Editor } from '@tiptap/core'

const EditorContext = createContext<{
    editor: Editor | null
}>({ editor: null })

interface IEditorProviderProps extends PropsWithChildren {
    editor: Editor
}

export const EditorProvider = ({ editor, children }: IEditorProviderProps) => {
    return (
        <EditorContext.Provider value={{ editor }}>
            {children}
        </EditorContext.Provider>
    )
}

export const useCurrentEditor = () => {
    return useContext(EditorContext)
}
