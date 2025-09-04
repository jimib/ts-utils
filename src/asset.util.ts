const ASSET_ROOT_URL = process.env.NEXT_PUBLIC_ASSET_ROOT_URL || "";
const DEFAULT_PROJECT = process.env.NEXT_PUBLIC_DEFAULT_PROJECT || "";

// NOTE - remove the leading slash
export const getAssetUrl = (
  path: string,
  project: string = DEFAULT_PROJECT
): string => {
  if (!path || !path.startsWith) return "";
  if (!ASSET_ROOT_URL) return path;
  return path.startsWith(ASSET_ROOT_URL)
    ? path
    : `${ASSET_ROOT_URL}/${project}/${path.replace(/^[\/]+/, "")}`;
};
