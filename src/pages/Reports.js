// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Container, Menu } from 'semantic-ui-react';

import { sortedProjects } from '../core/projects';
import { totalProjectTime, projectTimeEntries } from '../core/thyme';

import ReportTable from '../components/ReportTable';
import ReportFilters from '../components/ReportFilters';
import ReportRange from '../components/ReportRange';
import ReportCharts from '../components/ReportCharts';
import ReportDetailed from '../components/ReportDetailed';
import SavedReports from '../components/SavedReports';

type ReportsType = {
  allProjects: Array<projectTreeWithTimeType>,
  projects: Array<projectTreeWithTimeType>,
};

function Reports({ allProjects, projects }: ReportsType) {
  return (
    <Container>
      <Menu style={{ border: 0, boxShadow: 'none' }}>
        <Menu.Header as="h1" style={{ margin: 0 }}>Reports</Menu.Header>
        <Menu.Menu position="right">
          <ReportRange />
        </Menu.Menu>
      </Menu>
      <ReportFilters projects={allProjects} />
      <ReportCharts projects={projects} />
      <ReportTable projects={projects} />
      <ReportDetailed projects={projects} />
      <SavedReports />
    </Container>
  );
}

function mapStateToProps(state) {
  const { projects, time, reports } = state;
  const { filters, from, to } = reports;

  const mappedTime = time.allIds.map(id => time.byId[id]);

  const allProjects = [
    { id: null, name: 'No project', nameTree: ['No project'] },
    ...sortedProjects(projects.allIds.map(id => projects.byId[id])),
  ].map(project => ({
    ...project,
    time: totalProjectTime(project, mappedTime, from, to) / 60,
    entries: projectTimeEntries(project, mappedTime, from, to),
  }));

  return {
    allProjects,
    projects: allProjects.filter(project => filters.indexOf(project.id) > -1),
  };
}

export default connect(mapStateToProps)(Reports);
