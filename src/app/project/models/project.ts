import { IRankedAsset } from "./ranked-asset";

export interface IProject {
    id: number;
    name: string;
    description: string;
    assets: IRankedAsset[];
}
