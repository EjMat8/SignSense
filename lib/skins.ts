/**
 * Level-unlock skins for mascot + app theme. Unlocked when user reaches the skin's level.
 */

export type Skin = {
  id: string;
  level: number;
  name: string;
  primary: string;
  primaryDark: string; // stroke / shadow
  primaryLight: string; // mascot belly
  primaryForeground: string;
};

export const SKINS: Skin[] = [
  {
    id: "default",
    level: 1,
    name: "Classic Green",
    primary: "#58CC02",
    primaryDark: "#45A501",
    primaryLight: "#7CE830",
    primaryForeground: "#FFFFFF",
  },
  {
    id: "level-2",
    level: 2,
    name: "Bubblegum Pink",
    primary: "#EC4899",
    primaryDark: "#DB2777",
    primaryLight: "#F472B6",
    primaryForeground: "#FFFFFF",
  },
  {
    id: "level-3",
    level: 3,
    name: "Sunny Orange",
    primary: "#FF9600",
    primaryDark: "#CC7800",
    primaryLight: "#FFB84D",
    primaryForeground: "#FFFFFF",
  },
  {
    id: "level-5",
    level: 5,
    name: "Ocean Blue",
    primary: "#1CB0F6",
    primaryDark: "#1595CC",
    primaryLight: "#5FC7FA",
    primaryForeground: "#FFFFFF",
  },
  {
    id: "level-8",
    level: 8,
    name: "Royal Purple",
    primary: "#CE82FF",
    primaryDark: "#A366CC",
    primaryLight: "#E0B3FF",
    primaryForeground: "#FFFFFF",
  },
  {
    id: "level-10",
    level: 10,
    name: "Cherry Red",
    primary: "#FF4B4B",
    primaryDark: "#CC3C3C",
    primaryLight: "#FF7A7A",
    primaryForeground: "#FFFFFF",
  },
  {
    id: "level-15",
    level: 15,
    name: "Mint",
    primary: "#10B981",
    primaryDark: "#0D9468",
    primaryLight: "#34D399",
    primaryForeground: "#FFFFFF",
  },
  {
    id: "level-20",
    level: 20,
    name: "Rose",
    primary: "#F43F5E",
    primaryDark: "#C3324B",
    primaryLight: "#F87191",
    primaryForeground: "#FFFFFF",
  },
  {
    id: "level-25",
    level: 25,
    name: "Amber",
    primary: "#F59E0B",
    primaryDark: "#C47E09",
    primaryLight: "#FBBF24",
    primaryForeground: "#FFFFFF",
  },
  {
    id: "level-30",
    level: 30,
    name: "Teal",
    primary: "#14B8A6",
    primaryDark: "#109385",
    primaryLight: "#2DD4BF",
    primaryForeground: "#FFFFFF",
  },
  {
    id: "level-40",
    level: 40,
    name: "Indigo",
    primary: "#6366F1",
    primaryDark: "#4F52C1",
    primaryLight: "#818CF8",
    primaryForeground: "#FFFFFF",
  },
  {
    id: "level-50",
    level: 50,
    name: "Lime",
    primary: "#84CC16",
    primaryDark: "#6AA312",
    primaryLight: "#A3E635",
    primaryForeground: "#FFFFFF",
  },
  {
    id: "level-75",
    level: 75,
    name: "Coral",
    primary: "#FB7185",
    primaryDark: "#C95A6A",
    primaryLight: "#FDA4AF",
    primaryForeground: "#FFFFFF",
  },
  {
    id: "level-100",
    level: 100,
    name: "Gold",
    primary: "#EAB308",
    primaryDark: "#BB8F06",
    primaryLight: "#FACC15",
    primaryForeground: "#1A1A2E",
  },
];

const skinById = new Map(SKINS.map((s) => [s.id, s]));

export function getSkinById(id: string): Skin | undefined {
  return skinById.get(id);
}

export function getUnlockedSkinIds(userLevel: number): string[] {
  return SKINS.filter((s) => userLevel >= s.level).map((s) => s.id);
}

export function isSkinUnlocked(skinId: string, userLevel: number): boolean {
  const skin = skinById.get(skinId);
  return skin ? userLevel >= skin.level : false;
}

/** CSS variable overrides for this skin (for theme provider). */
export function getSkinTheme(skin: Skin): Record<string, string> {
  return {
    "--primary": skin.primary,
    "--primary-foreground": skin.primaryForeground,
    "--primary-dark": skin.primaryDark,
    "--primary-light": skin.primaryLight,
    "--ring": skin.primary,
    "--chart-1": skin.primary,
    "--sidebar-primary": skin.primary,
    "--sidebar-primary-foreground": skin.primaryForeground,
    "--sidebar-ring": skin.primary,
    "--success": skin.primary,
    "--success-foreground": skin.primaryForeground,
  };
}
