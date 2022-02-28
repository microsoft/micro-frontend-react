export function shouldUseAnchorTag(
    to: string,
    forceRefresh: boolean | undefined
): boolean {
    const lowerCasedTo = to.toLowerCase();

    if (forceRefresh) return true;
    if (lowerCasedTo.startsWith('http')) return true;
    if (lowerCasedTo.startsWith('mailto')) return true;
    if (lowerCasedTo.startsWith('tel')) return true;
    if (lowerCasedTo.startsWith('\\')) return true;

    return false;
}
