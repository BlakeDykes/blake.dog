import type { PathParams, SearchParams } from "./types";

export const applyPathParams = (
  path: string,
  pathParams?: PathParams
) : string => {
  if(!pathParams) return path;

  return Object.entries(pathParams).reduce((result, [key, val]) =>
    result.replace(`:${key}`, encodeURIComponent(String(val))), 
    path
  );
}

export const toSearchString = (params?: SearchParams) : string => {
  if(!params) return "";

  const searchParams = new URLSearchParams();

  for(const [key, value] of Object.entries(params)) { 
    if(value === undefined || value === null) continue;

    searchParams.set(key, String(value));
  }

  const qs = searchParams.toString();

  return qs ? qs : "";
};

export const resolveApiPath = ({
  path,
  pathParams,
  searchParams,
} : {
  path: string;
  pathParams?: PathParams;
  searchParams?: SearchParams;
}) => {
  const resolvedPath = applyPathParams(path, pathParams);
  const resolvedSearch = toSearchString(searchParams);

  return `${resolvedPath}${resolvedSearch}`
};