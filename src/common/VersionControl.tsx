import { clamp } from "./Util"
import { useState } from "react"
import { produce } from "immer"

type VCS<T> = {
    state: T,
    history: T[],
    index: number,
    mutate: (update: (draft: T) => void) => void,
    commit: (update: (draft: T) => void) => void,
    undo: () => void,
    redo: () => void
}

function useVersionControl<T>(initialState: T, maxHistory = 50): VCS<T> {
    // Current state, view of one element in history + any non recorded mutations.
    const [state, setState] = useState<T>(initialState)
    // Array of recorded states.
    const [history, setHistory] = useState<T[]>([initialState])
    // Points to the current state.
    const [index, setIndex] = useState<number>(0)

    // Make a change to the current state that will NOT be recorded in history.
    function mutate(update: (draft: T) => void) {
        setState(produce(state, update))
    }

    // Make a change to the current state that will be recorded in history.
    function commit(update: (draft: T) => void) {
        const newState = produce(state, update)
        setHistory(produce(history, (draftHistory: T[]) => {
            const newHistory = draftHistory.slice(index)
            newHistory.unshift(newState)
            return newHistory
        }))
        setState(newState)
        setIndex(0)
    }

    function undo() {
        const prev = clamp(index + 1, [0, maxHistory])
        setIndex(prev)
        setState(history[prev])
    }

    function redo() {
        const next = clamp(index - 1, [0, maxHistory])
        setIndex(next)
        setState(history[next])
    }

    return { state, history, index, mutate, commit, undo, redo }
}

export type { VCS }
export { useVersionControl }