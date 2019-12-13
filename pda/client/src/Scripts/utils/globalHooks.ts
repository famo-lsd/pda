import React from 'react';
import globalHook, { Store } from 'use-global-hook';

interface GlobalState {
    androidApp: boolean;
    authUser: any;
    loadPage: boolean;
}

interface GlobalActions {
    setAndroidApp: (value: boolean) => void;
    setAuthUser: (value: any) => void;
    setLoadPage: (value: boolean) => void;
}

const initState: GlobalState = {
    androidApp: false,
    authUser: null,
    loadPage: false
}

const actions = {
    setAndroidApp: (store: Store<GlobalState, GlobalActions>, androidApp: boolean) => {
        store.setState({ ...store.state, androidApp });
    },
    setAuthUser: (store: Store<GlobalState, GlobalActions>, authUser: any) => {
        store.setState({ ...store.state, authUser });
    },
    setLoadPage: (store: Store<GlobalState, GlobalActions>, loadPage: boolean) => {
        store.setState({ ...store.state, loadPage });
    }
}

export const useGlobal = globalHook<GlobalState, GlobalActions>(React, initState, actions);