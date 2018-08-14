// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';

import { alert } from '../../actions/app';
import { truncateTime } from '../../actions/time';
import { truncateProjects } from '../../actions/projects';

type DeleteDataProps = {
  removeTimeData: () => void;
  removeProjectData: () => void;
  showAlert: (message: string) => void;
}

type DeleteDataState = {
  confirmRemoveTimesheet: boolean;
  confirmRemoveProjects: boolean;
}

class DeleteData extends Component<DeleteDataProps, DeleteDataState> {
  state = {
    confirmRemoveTimesheet: false,
    confirmRemoveProjects: false,
  };

  onRemoveTime = () => { this.setState({ confirmRemoveTimesheet: true }); };

  onRemoveProjects = () => { this.setState({ confirmRemoveProjects: true }); };

  onCancelConfirm = () => {
    this.setState({
      confirmRemoveTimesheet: false,
      confirmRemoveProjects: false,
    });
  };

  onConfirmRemoveTime = () => {
    const { removeTimeData, showAlert } = this.props;

    this.onCancelConfirm();
    removeTimeData();
    showAlert('All time data has been removed');
  };

  onConfirmRemoveProjects = () => {
    const { removeProjectData, showAlert } = this.props;

    this.onCancelConfirm();
    removeProjectData();
    showAlert('All project data has been removed');
  };

  render() {
    const {
      confirmRemoveTimesheet,
      confirmRemoveProjects,
    } = this.state;

    return (
      <Fragment>
        <Header as="h3">
          Delete data
        </Header>
        <Button color="red" onClick={this.onRemoveTime}>
          Remove timesheet data
        </Button>
        <Confirm
          open={confirmRemoveTimesheet}
          content="Are you SUPER sure you want to remove all timesheet data?"
          confirmButton="Remove data"
          size="mini"
          onCancel={this.onCancelConfirm}
          onConfirm={this.onConfirmRemoveTime}
        />

        <Button color="red" onClick={this.onRemoveProjects}>
          Remove project data
        </Button>
        <Confirm
          open={confirmRemoveProjects}
          content="Are you SUPER sure you want to remove all projects data?"
          confirmButton="Remove data"
          size="mini"
          onCancel={this.onCancelConfirm}
          onConfirm={this.onConfirmRemoveProjects}
        />
      </Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    removeTimeData() {
      dispatch(truncateTime());
    },

    removeProjectData() {
      dispatch(truncateProjects());
    },

    showAlert(message: string) {
      dispatch(alert(message));
    },
  };
}

export default connect(null, mapDispatchToProps)(DeleteData);
