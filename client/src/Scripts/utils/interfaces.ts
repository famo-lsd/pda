export interface Bin {
    ID: number;
    Code: string;
    Label: string;
    MaxVolume: number;
    TotalBoxes: number;
    TotalVolume: number;
}

export interface BinBox extends Box {
    ID: number;
    Bin: Bin;
    Volume: number;
    IsPrinted: boolean;
}

export interface BinOrder {
    CustomerName: string;
    OrderCode: string;
    OrderCountry: Country;
    OrderExpectedShipmentDate: Date;
    OrderBoxes: number;
    Bin: Bin;
    BinOrderBoxes: number;
    AllBinOrderBoxes: number;
    ShipmentGate: ShipmentGate;
}

export interface Box {
    Code: string;
    ProductCode: string;
    OrderCode: string;
    CustomerCode: string;
    CustomerName: string;
    ExpectedShipmentDate: Date;
}

export interface Country {
    Code: string;
    Label: string;
}

export interface ItemJournal {
    Code: string;
    Name: string;
}

export interface ItemJournalLine {
    Code: string;
    ProductCode: string;
    ProductVariantCode: string;
    ProductDescription: string;
    LocationCode: string;
}

export interface Pallet {
    ID: number;
}

export interface PalletBox extends Box {
    IsNew: boolean;
}

export interface Shipment {
    Code: string;
    Description: string;
    Gate: ShipmentGate;
    PickedBoxes: number;
    TotalBoxes: number;
}

export interface ShipmentGate {
    ID: number;
    Label: string;
}

export interface ShipmentProduct {
    ProductCode: string;
    ProductDescription: string;
    ProductVolume: number;
    OrderCode: string;
    OrderLine: number;
    PendingBoxes: number;
    TotalBoxes: number;
    ShipmentStatus: number;
}

export interface ShipmentProductComponent {
    ProductCode: string;
    ProductDescription: string;
    ComponentCode: string;
    ComponentDescription: string;
    Bin: Bin;
    BoxCode: string;
    BoxPrinted: boolean;
}