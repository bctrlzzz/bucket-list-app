import { spacing } from "@/constants/theme";

// cards gap
export const cardGap = spacing.md;

function columnsFor(width: number) {
    if (width >= 1300) return 5;
    if (width >= 1000) return 4;
    if (width >= 700) return 3;
    if (width >= 460) return 2;
    return 1;
}

export function cardWidthFor(containerWidth: number) {
    const columns = columnsFor(containerWidth);
    return Math.floor((containerWidth - cardGap * (columns - 1)) / columns);
}