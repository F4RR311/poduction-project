type Mods = Record<string, boolean | string>

export function classNames(cls: string, mods: Mods = {}, additional: string[] = []) {
    return [
        cls,
        ...additional.filter(Boolean),
        Object.entries(mods)
            .filter(([cls, value]) => Boolean(value))
            .map(([className]) => className),
    ]
        .join(' ');
}

classNames('remove-btn', { hovered: true, selectable: true, red: true }, ['pdg']);
