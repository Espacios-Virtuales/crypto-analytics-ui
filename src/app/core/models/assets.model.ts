export interface Asset {
    symbol: string;   // "BTC"
    name?: string;    // opcional
    enabled?: boolean;
}
export interface AssetsResponse {
    assets: Asset[]; // si tu backend retorna lista directa lo ajustamos
}