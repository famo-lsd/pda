import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { Link, Redirect, Route, Switch, withRouter } from 'react-router-dom';

interface ShipmentGate {
    ID: number;
    Label: string;
}

interface Bin {
    ID: number;
    Code: string;
    Label: string;
    MaxVolume: number;
    TotalBoxes: number;
    TotalVolume: number;
}

interface BinOrder {
    CustomerName: string;
    OrderCode: string;
    OrderCountryCode: string;
    OrderExpectedShipmentDate: Date;
    OrderBoxes: number;
    Bin: Bin;
    BinOrderBoxes: number;
    ShipmentGate: ShipmentGate;
}

function TV(props: any) {
    const { location } = props,
        query = queryString.parse(location.search),
        binCodeQS = query.binCode;

    return (
        <h1>TV</h1>
    );
}

export default withRouter(TV);