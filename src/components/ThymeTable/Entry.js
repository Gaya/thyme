// @flow

import React, { Component, Fragment } from 'react';
import format from 'date-fns/format';
import { Table, Confirm, Button, Icon, Popup } from 'semantic-ui-react';
import classnames from 'classnames';

import { saveTemporaryItem, clearTemporaryItem } from '../../core/localStorage';
import { timeElapsed } from '../../core/thyme';
import { valueFromEventTarget } from '../../core/dom';

import DateInput from '../DateInput';
import TimeInput from '../TimeInput';
import ProjectInput from '../ProjectInput';
import NotesInput from '../NotesInput';

import './Entry.css';

function defaultState(props = {}): timePropertyType {
  return {
    date: format(props.date || new Date(), 'YYYY-MM-DD'),
    start: props.start || '00:00',
    end: props.end || '00:00',
    project: props.project || null,
    notes: props.notes || '',
  };
}

type EntryType = {
  entry?: timeType,
  tempEntry?: tempTimePropertyType,
  onAdd?: (entry: timePropertyType) => void,
  onRemove?: (id: string) => void,
  onUpdate?: (entry: timePropertyType) => void,
  onAddNewProject?: (project: string) => string,
};

type EntryStateType = {
  entry: timePropertyType,
  tracking: boolean,
  confirm: boolean,
};

class Entry extends Component<EntryType, EntryStateType> {
  constructor(props: EntryType) {
    super(props);

    this.onDateChange = e => this.onValueChange('date', valueFromEventTarget(e.target));
    this.onStartTimeChange = e => this.onValueChange('start', valueFromEventTarget(e.target));
    this.onEndTimeChange = e => this.onValueChange('end', valueFromEventTarget(e.target));
    this.onProjectChange =
      (e, project) => this.onValueChange('project', project === null ? null : project.value);
    this.onNotesChange = e => this.onValueChange('notes', valueFromEventTarget(e.target));
    this.onAddNewProject = (e, project) => this.addNewProject(project.value);

    this.onAddEntry = this.addEntry.bind(this);
    this.onRemoveEntry = this.removeEntry.bind(this);
    this.onKeyPress = this.keyPress.bind(this);
    this.onOpenConfirm = () => { this.setState({ confirm: true }); };
    this.onCancelConfirm = () => { this.setState({ confirm: false }); };

    this.onStartTimeTracking = this.startTimeTracking.bind(this);
    this.onStopTimeTracking = this.stopTimeTracking.bind(this);

    this.onSetDateInputRef = (input) => { this.dateInput = input; };

    this.state = {
      entry: defaultState(props.entry || props.tempEntry),
      tracking: props.tempEntry ? props.tempEntry.tracking : false,
      confirm: false,
    };
  }

  componentDidMount() {
    this.tickInterval = setInterval(this.tickTimer.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.tickInterval);
  }

  onDateChange: (e: Event) => void;
  onStartTimeChange: (e: Event) => void;
  onEndTimeChange: (e: Event) => void;
  onProjectChange: (e: Event, project: { value: string, label: string }) => void;
  onNotesChange: (e: Event) => void;
  onKeyPress: (e: KeyboardEvent) => void;
  onAddEntry: () => void;
  onRemoveEntry: () => void;
  onSetDateInputRef: (input: HTMLInputElement | null) => void;
  onStartTimeTracking: () => void;
  onStopTimeTracking: () => void;
  onAddNewProject: (e: Event, project: { value: string }) => void;
  onOpenConfirm: () => void;
  onCancelConfirm: () => void;

  onValueChange(key: string, value: string | null) {
    this.updateEntry({
      [key]: value,
    });

    this.setState({
      entry: {
        ...this.state.entry,
        [key]: value,
      },
    });
  }

  dateInput: HTMLInputElement | null;
  tickInterval: IntervalID;

  tickTimer() {
    if (this.state.tracking) {
      const entry = {
        ...this.state.entry,
        end: format(new Date(), 'HH:mm'),
      };

      // update state of component
      this.setState({ entry });

      // save temporary state to localStorage
      saveTemporaryItem({ ...entry, tracking: this.state.tracking });
    }
  }

  startTimeTracking() {
    const startTime = format(new Date(), 'HH:mm');

    this.setState({
      tracking: true,
      entry: {
        ...this.state.entry,
        start: this.state.entry.start === '00:00' ? startTime : this.state.entry.start,
        end: startTime,
      },
    });
  }

  stopTimeTracking() {
    this.setState({
      tracking: false,
    });

    // stop tracking in localStorage
    saveTemporaryItem({ ...this.state.entry, tracking: false });
  }

  addNewProject(project: string) {
    const { onAddNewProject } = this.props;

    const newProject = project.trim();

    if (newProject === '') {
      return;
    }

    if (onAddNewProject) {
      this.setState({
        entry: {
          ...this.state.entry,
          project: onAddNewProject(project),
        },
      });
    }
  }

  addEntry() {
    const { onAdd } = this.props;

    if (typeof onAdd === 'function') {
      onAdd({
        ...this.state.entry,
      });

      // put focus back on date input
      if (this.dateInput) {
        this.dateInput.focus();
      }

      // reset item
      this.setState({
        tracking: false,
        entry: defaultState(),
      });

      // clear item from localStorage
      clearTemporaryItem();
    }
  }

  updateEntry(newState: any) {
    const { entry, onUpdate } = this.props;

    if (typeof onUpdate === 'function' && entry && entry.id) {
      onUpdate({
        id: entry.id,
        ...this.state.entry,
        ...newState,
      });
    }
  }

  keyPress(e: KeyboardEvent) {
    // check if return is pressed
    if (e.charCode && e.charCode === 13 && !this.props.entry) {
      this.addEntry();
    }
  }

  removeEntry() {
    const { entry, onRemove } = this.props;

    if (
      entry && entry.id &&
      typeof onRemove === 'function'
    ) {
      onRemove(entry.id);
    }
  }

  render() {
    const { entry } = this.props;
    const { tracking, confirm } = this.state;
    const {
      date,
      start,
      end,
      project,
      notes,
    } = this.state.entry;

    const hasId = Boolean(entry && !!entry.id);

    return (
      <Table.Row className={classnames({ 'TableRow--tracking': tracking })}>
        <Table.Cell width={1}>
          <DateInput
            setRef={this.onSetDateInputRef}
            onKeyPress={this.onKeyPress}
            onChange={this.onDateChange}
            value={date}
          />
        </Table.Cell>
        <Table.Cell width={1}>
          <TimeInput onKeyPress={this.onKeyPress} onChange={this.onStartTimeChange} value={start} />
        </Table.Cell>
        <Table.Cell width={1}>
          <TimeInput onKeyPress={this.onKeyPress} onChange={this.onEndTimeChange} value={end} />
        </Table.Cell>
        <Table.Cell width={1}>
          {timeElapsed(start, end)}
        </Table.Cell>
        <Table.Cell width={3}>
          <ProjectInput
            value={project}
            onAddItem={this.onAddNewProject}
            handleChange={this.onProjectChange}
          />
        </Table.Cell>
        <Table.Cell>
          <NotesInput onKeyPress={this.onKeyPress} onChange={this.onNotesChange} value={notes} />
        </Table.Cell>
        <Table.Cell textAlign="right" style={{ width: 1, whiteSpace: 'nowrap' }}>
          <Button.Group size="small">
            {!hasId && (
              <Fragment>
                <Popup
                  inverted
                  trigger={(
                    <Button
                      icon
                      color="blue"
                      onClick={tracking ? this.onStopTimeTracking : this.onStartTimeTracking}
                    >
                      <Icon name={tracking ? 'pause' : 'play'} />
                    </Button>
                  )}
                  content={tracking ? 'Stop tracking time' : 'Start time tracking'}
                />
                <Popup
                  inverted
                  trigger={(
                    <Button icon onClick={this.onAddEntry}>
                      <Icon name="add" />
                    </Button>
                  )}
                  content="Add this entry"
                />
              </Fragment>
            )}
            {hasId && (
              <Fragment>
                <Popup
                  inverted
                  trigger={(
                    <Button icon onClick={this.onOpenConfirm}>
                      <Icon name="remove" />
                    </Button>
                  )}
                  content="Remove this entry"
                />

                <Confirm
                  open={confirm}
                  content="Are you sure you want to remove this entry?"
                  confirmButton="Remove entry"
                  size="mini"
                  onCancel={this.onCancelConfirm}
                  onConfirm={this.onRemoveEntry}
                />
              </Fragment>
            )}
          </Button.Group>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default Entry;
