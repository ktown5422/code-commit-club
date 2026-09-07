const COMMIT_PROMPTS = [
    "Refactor one thing you touched this week.",
    "Add a test for the last bug you fixed.",
    "Rename the worst-named variable you can find.",
    "Delete a chunk of dead code — removals count too.",
    "Update your README with something you learned this week.",
    "Extract one duplicated snippet into a helper.",
    "Fix a TODO that is older than a month.",
    "Add error handling to a call that fails silently.",
    "Write a docstring for your hairiest function.",
    "Tighten the types in one file.",
    "Ship the smallest feature on your list.",
    "Improve one error message a user might actually see.",
    "Add an edge-case test to your most-used function.",
    "Break one big function into two small ones.",
    "Upgrade one outdated dependency.",
    "Make one slow thing measurably faster.",
    "Add logging where you last had to guess what happened.",
    "Close the smallest open issue on your tracker.",
    "Simplify one conditional you have to squint at.",
    "Automate one thing you did manually this week.",
    "Delete a file you no longer need.",
]

export function getDailyCommitPrompt(date = new Date()) {
    const startOfYear = new Date(date.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000)

    return COMMIT_PROMPTS[dayOfYear % COMMIT_PROMPTS.length]
}
