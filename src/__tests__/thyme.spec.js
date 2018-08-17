import {
  totalProjectTime, timeElapsed, roundEndTime, roundStartTime, roundTimeUp, roundTimeDown,
  roundTimeAutomatically,
} from '../core/thyme';

describe('Calculate total project time', () => {
  const times = [{
    project: null,
    start: '2018-01-03T10:00:00.000Z',
    end: '2018-01-03T12:00:00.000Z',
  }, {
    project: 'ABCDEF',
    start: '2018-01-03T10:00:00.000Z',
    end: '2018-01-03T12:00:00.000Z',
  }, {
    project: 'ABCDEF',
    start: '2018-01-04T10:00:00.000Z',
    end: '2018-01-04T15:00:00.000Z',
  }, {
    project: 'ABCDEF',
    start: '2018-02-03T10:00:00.000Z',
    end: '2018-02-03T12:00:00.000Z',
  }];

  it('Calculates the sum of durations for a project', () => {
    expect(totalProjectTime({ id: 'ABCDEF' }, times, new Date(2018, 0, 3), new Date(2018, 0, 4)))
      .toBe(7 * 60 * 60);
  });
});

describe('Time differences test', () => {
  // with rounding
  it('should return the correct time differences with rounding', () => {
    expect(timeElapsed('2018-01-03T10:00:00.000Z', '2018-01-03T12:00:00.000Z', false, true))
      .toBe('02:00:00');
    expect(timeElapsed('2018-01-03T10:00:10.000Z', '2018-01-03T12:00:00.000Z', false, true))
      .toBe('02:00:00');
  });

  it('should return the correct time differences without rounding', () => {
    // without rounding
    expect(timeElapsed('2018-01-03T10:00:10.000Z', '2018-01-03T12:00:00.000Z', true, true))
      .toBe('01:59:50');
  });
  it('should return the correct time differences with no seconds', () => {
    // no seconds
    expect(timeElapsed('2018-01-03T10:00:10.000Z', '2018-01-03T12:00:00.000Z', true, false))
      .toBe('01:59');
  });
});

describe('Round end Time tests', () => {
  expect(roundEndTime(27, 8, 30, 25)).toBe('08:30');
  expect(roundEndTime(41, 8, 30, 10)).toBe('09:00');
  expect(roundEndTime(2, 8, 5, 3)).toBe('08:00');
  expect(roundEndTime(3, 8, 5, 2)).toBe('08:05');
  expect(roundEndTime(17, 8, 15, 8)).toBe('08:15');
  expect(roundEndTime(25, 8, 15, 8)).toBe('08:30');
  expect(roundEndTime(43, 8, 10, 4)).toBe('08:40');
  expect(roundEndTime(45, 8, 10, 4)).toBe('08:50');
  expect(roundEndTime(1, 10, 60, 0)).toBe('11:00');
  expect(roundEndTime(1, 8, 60, 0)).toBe('09:00');
});

describe('Returns rounded start time string', () => {
  expect(roundStartTime(2, 10, 5, 2)).toBe('10:00');
  expect(roundStartTime(2, 10, 5, 3)).toBe('10:02');
  expect(roundStartTime(12, 10, 5, 2)).toBe('10:10');
  expect(roundStartTime(24, 8, 60, 0)).toBe('08:00');
  expect(roundStartTime(44, 8, 30, 15)).toBe('08:30');
  expect(roundStartTime(46, 8, 30, 15)).toBe('08:46');
  expect(roundStartTime(28, 8, 60, 31)).toBe('08:00');
  expect(roundStartTime(14, 8, 15, 10)).toBe('08:14');
  expect(roundStartTime(12, 8, 15, 2)).toBe('08:00');
  expect(roundStartTime(50, 8, 15, 9)).toBe('08:45');
  expect(roundStartTime(16, 8, 10, 3)).toBe('08:10');
  expect(roundStartTime(2, 8, 10, 7)).toBe('08:00');
  expect(roundStartTime(12, 8, 10, 9)).toBe('08:12');
});

describe('Rounding up tests', () => {
  it('should round up 10s correctly', () => {
    expect(
      roundTimeUp(2, 8, 10),
    ).toBe('08:10');
    expect(
      roundTimeUp(11, 8, 10),
    ).toBe('08:20');
    expect(
      roundTimeUp(29, 8, 10),
    ).toBe('08:30');
    expect(
      roundTimeUp(52, 8, 10),
    ).toBe('09:00');
  });
  it('should round up 30s correctly', () => {
    expect(
      roundTimeUp(0, 8, 30),
    ).toBe('08:00');
    expect(
      roundTimeUp(2, 8, 30),
    ).toBe('08:30');
    expect(
      roundTimeUp(11, 8, 30),
    ).toBe('08:30');
    expect(
      roundTimeUp(29, 8, 30),
    ).toBe('08:30');
    expect(
      roundTimeUp(52, 8, 30),
    ).toBe('09:00');
    expect(
      roundTimeUp(30, 8, 30),
    ).toBe('08:30');
  });
  it('should round up 60s correctly', () => {
    expect(
      roundTimeUp(2, 8, 60),
    ).toBe('09:00');
    expect(
      roundTimeUp(11, 10, 60),
    ).toBe('11:00');
    expect(
      roundTimeUp(29, 6, 60),
    ).toBe('07:00');
    expect(
      roundTimeUp(59, 8, 60),
    ).toBe('09:00');
  });
});

describe('Rounding down tests', () => {
  it('should round down the 10s correctly', () => {
    expect(
      roundTimeDown(12, 8, 10),
    ).toBe('08:10');
    expect(
      roundTimeDown(9, 8, 10),
    ).toBe('08:00');
    expect(
      roundTimeDown(35, 8, 10),
    ).toBe('08:30');
    expect(
      roundTimeDown(49, 8, 10),
    ).toBe('08:40');
  });
  it('should round down the 30s correctly', () => {
    expect(
      roundTimeDown(12, 8, 30),
    ).toBe('08:00');
    expect(
      roundTimeDown(9, 8, 30),
    ).toBe('08:00');
    expect(
      roundTimeDown(29, 8, 30),
    ).toBe('08:00');
    expect(
      roundTimeDown(35, 8, 30),
    ).toBe('08:30');
    expect(
      roundTimeDown(49, 8, 30),
    ).toBe('08:30');
    expect(
      roundTimeDown(0, 9, 30),
    ).toBe('09:00');
  });
  it('should round down 60s correctly', () => {
    expect(
      roundTimeDown(12, 8, 60),
    ).toBe('08:00');
    expect(
      roundTimeDown(0, 8, 60),
    ).toBe('08:00');
    expect(
      roundTimeDown(35, 9, 60),
    ).toBe('09:00');
    expect(
      roundTimeDown(49, 8, 60),
    ).toBe('08:00');
  });
});

describe('Rounding automatically tests', () => {
  it('should do a calculated round for the 10s rounding', () => {
    expect(
      roundTimeAutomatically(12, 8, 10),
    ).toBe('08:10');
    expect(
      roundTimeAutomatically(9, 8, 10),
    ).toBe('08:10');
    expect(
      roundTimeAutomatically(35, 8, 10),
    ).toBe('08:40');
    expect(
      roundTimeAutomatically(46, 8, 10),
    ).toBe('08:50');
  });
  it('should do a calculated round for the 30s rounding', () => {
    expect(
      roundTimeAutomatically(12, 8, 30),
    ).toBe('08:00');
    expect(
      roundTimeAutomatically(9, 8, 30),
    ).toBe('08:00');
    expect(
      roundTimeAutomatically(15, 8, 30),
    ).toBe('08:30');
    expect(
      roundTimeAutomatically(29, 8, 30),
    ).toBe('08:30');
    expect(
      roundTimeAutomatically(35, 8, 30),
    ).toBe('08:30');
    expect(
      roundTimeAutomatically(49, 8, 30),
    ).toBe('09:00');
    expect(
      roundTimeAutomatically(0, 9, 30),
    ).toBe('09:00');
    expect(
      roundTimeAutomatically(45, 9, 30),
    ).toBe('10:00');
    expect(
      roundTimeAutomatically(55, 9, 30),
    ).toBe('10:00');
  });
  it('should do a calculated round for the 60s rounding', () => {
    expect(
      roundTimeAutomatically(29, 8, 60),
    ).toBe('08:00');
    expect(
      roundTimeAutomatically(30, 8, 60),
    ).toBe('09:00');
    expect(
      roundTimeAutomatically(0, 8, 60),
    ).toBe('08:00');
    expect(
      roundTimeAutomatically(35, 9, 60),
    ).toBe('10:00');
    expect(
      roundTimeAutomatically(49, 8, 60),
    ).toBe('09:00');
  });
});
