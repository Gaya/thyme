// @flow

type exportStateType = {
  time: {
    allIds: Array<string>,
    byId: {},
  },
  projects: {
    allIds: Array<string>,
    byId: {},
  },
  reports: {
    allIds: Array<string>,
    byId: {},
  },
};

type exportType = {
  time: Array<timePropertyType>,
  projects: Array<projectType>,
  reports: Array<reportType>,
};

export function stateToExport({ time, projects, reports }: exportStateType): exportType {
  return {
    time: time.allIds.map(id => time.byId[id]),
    projects: projects.allIds.map(id => projects.byId[id]),
    reports: reports.allIds.map(id => reports.byId[id]),
  };
}

type importStateType = {
  time: Array<any>,
  projects: Array<any>,
  reports: Array<any>,
}

function validTimeEntry(entry) {
  return !(typeof entry.id !== 'string' ||
    (entry.project !== null && typeof entry.project !== 'string') ||
    typeof entry.date !== 'string' ||
    typeof entry.start !== 'string' ||
    typeof entry.end !== 'string' ||
    typeof entry.notes !== 'string' ||
    typeof entry.createdAt !== 'string' ||
    typeof entry.updatedAt !== 'string');
}

function validProjectEntry(entry) {
  return !(typeof entry.id !== 'string' ||
    (entry.parent !== null && typeof entry.parent !== 'string') ||
    typeof entry.name !== 'string' ||
    typeof entry.createdAt !== 'string' ||
    typeof entry.updatedAt !== 'string');
}

function validReportEntry(entry) {
  return !(typeof entry.id !== 'string' ||
    typeof entry.name !== 'string' ||
    !Array.isArray(entry.filters) ||
    !entry.filters.every(item => typeof item === 'string' || item === null) ||
    typeof entry.from !== 'string' ||
    typeof entry.to !== 'string' ||
    typeof entry.createdAt !== 'string');
}

export function parseImportData({ time = [], projects = [], reports = [] }: importStateType) {
  return { time, projects, reports };
}

export function validData({ time, projects, reports }: importStateType) {
  return !(!time || !projects || !reports ||
    !Array.isArray(time) || !Array.isArray(projects) || !Array.isArray(reports) ||
    !time.every(validTimeEntry) || !projects.every(validProjectEntry) ||
    !reports.every(validReportEntry));
}
