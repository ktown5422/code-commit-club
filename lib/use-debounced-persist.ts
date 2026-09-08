"use client"

import { useEffect, useRef } from "react"

/**
 * Saves `value` once it has stopped changing for `delay` ms.
 *
 * The stepper controls fire on every click, so writing on each one would send a
 * request per keypress. The first render is skipped so that simply loading the
 * dashboard does not immediately write back the values it just read.
 */
export function useDebouncedPersist<T>(
    value: T,
    persist: (value: T) => Promise<unknown>,
    delay = 600
) {
    const persistRef = useRef(persist)
    const isFirstRender = useRef(true)

    useEffect(() => {
        persistRef.current = persist
    })

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        const timer = setTimeout(() => {
            persistRef.current(value).catch((error) => {
                console.error("Failed to save dashboard change", error)
            })
        }, delay)

        return () => clearTimeout(timer)
    }, [value, delay])
}
