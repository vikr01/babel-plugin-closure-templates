import { workspaces } from "../package.json";
import {
  type PackageName,
  type PackagePath,
  convertWorkspaceGlobToProjects,
  getPackageName,
  hasPackageJSON,
} from "./package-filterers";

type PackageMap = Record<PackageName, PackagePath>;

const packages = workspaces.map(convertWorkspaceGlobToProjects).flat();

export const packagesWithPackageJson = packages.filter(hasPackageJSON);

export const packageNamesMap: PackageMap = Object.fromEntries(
  packagesWithPackageJson.map((packagePath) => [
    getPackageName(packagePath),
    packagePath,
  ]),
);
