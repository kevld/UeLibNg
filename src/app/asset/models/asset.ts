import { ITag } from "src/app/tag/models/tag";
import { AssetType } from "../enums/asset-type.enum";

export interface IAsset {
    id: number;
    name: string;
    description: string;
    url: string;
    minVersion: number;
    maxVersion?: number;
    assetType: AssetType;
    tags: ITag[];
}

export interface IAssetDraft {
    name: string;
    description: string;
    url: string;
    minVersion: number;
    maxVersion?: number;
    assetType: AssetType;
}
