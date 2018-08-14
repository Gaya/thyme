// @flow

import { createSelector } from 'reselect';

import { sortProjects } from '../core/projects';

export const getAllProjects = (state: storeShape): projectType[] => state.projects.allIds
  .map(id => state.projects.byId[id])
  .filter(project => !project.removed);

export const sortedProjects = createSelector(
  getAllProjects,
  sortProjects,
);
