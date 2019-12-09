import React from 'react';
import globalHook, { Store } from 'use-global-hook';

interface GlobalState {
    authUser: any;
    loadPage: boolean;
}

interface GlobalActions {
    setAuthUser: (value: any) => void;
    setLoadPage: (value: boolean) => void;
}

const initState: GlobalState = {
    authUser: null,
    loadPage: true
}

const actions = {
    setAuthUser: (store: Store<GlobalState, GlobalActions>, authUser: any) => {
        store.setState({ ...store.state, authUser });
    },
    setLoadPage: (store: Store<GlobalState, GlobalActions>, loadPage: boolean) => {
        store.setState({ ...store.state, loadPage });
    }
}

export const useGlobal = globalHook<GlobalState, GlobalActions>(React, initState, actions);