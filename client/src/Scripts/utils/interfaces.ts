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
    Code: string;
    CustomerName: string;
    Country: Country;
    ExpectedShipmentDate: Date;
    BoxesQuantity: number;
    Bin: Bin;
    BinBoxesQuantity: number;
    AllBinBoxesQuantity: number;
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

export interface MessageType {
    ID: number;
    Label: string;
}

export interface Message {
    ID: number;
    Type: MessageType;
    Text: string;
}

export interface Pagination<T> {
    Data: Array<T>;
    CurrentPage: number;
    PagesNumber: number;
}

export interface Pallet {
    ID: number;
}

export interface PalletBox extends Box {
    IsNew: boolean;
}

export interface SalesOrder {
    Code: string;
    CustomerName: string;
    ExpectedShipmentDate: Date;
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

export interface TransferOrder{
    Code: string;
    From: string;
    To: string;
    Car: string;
}

export interface NavisionOrder{
    Code: string;
    CustomerCode: string;
    CustomerName: string;
    ExpectedShipmentDate: Date;
}

export interface TVToBoxOrder{
    Order: NavisionOrder;
    Country: Country;
    BoxesQuantity: number;
    AllBinBoxesQuantity: number;
}