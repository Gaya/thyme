// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { resetFilters, toggleFilter } from '../../actions/reports';

import './ReportFilters.css';

type ReportFiltersType = {
  filters: Array<string>,
  projects: Array<projectTreeWithTimeType>,
  toggleFilter: (project: string | null) => void,
  resetFilters: (projects: Array<string>) => void,
};

class ReportFilters extends Component<ReportFiltersType> {
  constructor() {
    super();

    this.onFilterToggle = this.toggleFilter.bind(this);
  }

  componentDidMount() {
    this.props.resetFilters(this.props.projects.map(project => project.id));
  }

  onFilterToggle: (e: Event) => void;

  toggleFilter(e: Event) {
    if (e.target instanceof HTMLInputElement && typeof e.target.name === 'string') {
      this.props.toggleFilter(e.target.name || null);
    }
  }

  render() {
    const { filters, projects } = this.props;

    return (
      <div className="Report__filters">
        <span className="Report__filters-label">Show:</span>
        {projects.map(project => (
          <label className="Report__filter" key={project.id} htmlFor={project.id}>
            <span className="Report__filter-name">{project.name}</span>
            <input
              checked={filters.indexOf(project.id) > -1}
              onChange={this.onFilterToggle}
              type="checkbox"
              name={project.id}
              id={project.id}
            />
          </label>
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { filters } = state.reports;

  return { filters };
}

function mapDispatchToProps(dispatch) {
  return {
    resetFilters(projects: Array<string>) {
      dispatch(resetFilters(projects));
    },

    toggleFilter(project: string | null) {
      dispatch(toggleFilter(project));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportFilters);
