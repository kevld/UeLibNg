export interface IRankedAsset {
    id?: number
    assetId: number;
    assetName: string;
    rank: number;
}

export interface IPostRankedAsset {
    assetId: number;
    projectId: number;
    rank: number;
}