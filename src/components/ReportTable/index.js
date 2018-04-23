// @flow

import React from 'react';
import { Table } from 'semantic-ui-react';

import { formatDuration } from '../../core/thyme';

type ReportTableType = {
  projects: Array<projectTreeWithTimeType>,
};

function ReportTable({ projects }: ReportTableType) {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Project</Table.HeaderCell>
          <Table.HeaderCell width={2}>Total spent</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {projects.map(project => (
          <Table.Row key={project.id}>
            <Table.Cell>{project.nameTree.join(' > ')}</Table.Cell>
            <Table.Cell>{formatDuration(project.time * 60)}</Table.Cell>
          </Table.Row>
        ))}
        <Table.Row>
          <Table.Cell />
          <Table.Cell>
            <strong>{formatDuration(projects.reduce((total, project) => total + (project.time * 60), 0))}</strong>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}

export default ReportTable;
