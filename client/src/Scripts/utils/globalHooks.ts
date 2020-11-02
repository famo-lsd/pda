import globalHook, { Store } from 'use-global-hook';
import React from 'react';

interface GlobalState {
    androidApp: boolean;
    authUser: any;
    loadPage: boolean;
    loadSession: boolean;
}

interface GlobalActions {
    setAndroidApp: (value: boolean) => void;
    setAuthUser: (value: any) => void;
    setLoadPage: (value: boolean) => void;
    setLoadSession: (value: boolean) => void;
}

const initState: GlobalState = {
    androidApp: false,
    authUser: null,
    loadPage: false,
    loadSession: false
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
    },
    setLoadSession: (store: Store<GlobalState, GlobalActions>, loadSession: boolean) => {
        store.setState({ ...store.state, loadSession });
    }
}

export const useGlobal = globalHook<GlobalState, GlobalActions>(React, initState, actions);