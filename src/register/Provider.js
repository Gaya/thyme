// @flow

import React, { useState, useEffect } from 'react';
import { createStore } from 'redux';
import type { Dispatch } from 'redux';

import type { ContextType } from './Context';

import Context from './Context';

const defaultState: ContextType = {
  settingsPanels: [],
  components: {},
};

type AddSettingPanel = {
  type: 'ADD_SETTINGS_PANEL';
  item: SettingsPanel;
};

type AddComponent = {
  type: 'ADD_COMPONENT';
  name: string;
  key: string;
  renderProp: (...any) => any;
};

export type UpdateActions = AddSettingPanel | AddComponent;

export const store = createStore<ContextType, UpdateActions, Dispatch<UpdateActions>>(
  (state, action) => {
    if (!state) {
      return defaultState;
    }

    switch (action.type) {
      case 'ADD_SETTINGS_PANEL':
        return {
          ...state,
          settingsPanels: [...state.settingsPanels, action.item],
        };
      case 'ADD_COMPONENT': {
        const { name, key, renderProp } = action;

        return {
          ...state,
          components: {
            ...state.components,
            [name]: [
              ...(state.components[name] || []),
              {
                key,
                render: renderProp,
              },
            ],
          },
        };
      }
      default:
        return state;
    }
  },
  defaultState,
);

function RegisterProvider({ children }: any) {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const updateState = () => setState(store.getState());

    const unsubscribe = store.subscribe(updateState);
    updateState();

    return () => unsubscribe();
  }, []);

  return (
    <Context.Provider value={state}>
      {children}
    </Context.Provider>
  );
}

export default RegisterProvider;