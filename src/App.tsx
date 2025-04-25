import { FC, useState } from 'react';
import cronstrue from 'cronstrue';
import C2Q from 'cron-to-quartz';

type Periodicity = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
type DailyOption = 'EVERY_X' | 'WEEKDAY';
type MonthlyOption = 'DAY_OF_MONTH' | 'WEEKDAY';
type SectionOption = 'FIRST' | 'LAST';
type YearlyOption = 'DAY_OF_YEAR' | 'WEEKDAY';
type Selection = { label: string, value: number };

const daysOfWeek: Selection[] = [
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
    { label: 'Sunday', value: 0 }
];

const App: FC = () => {
    const [periodicity, setPeriodicity] = useState<Periodicity>('DAILY');
    const [cronExpression, setcronExpression] = useState<string>('');
    const [cronHumanFriendly, setCronHumanFriendly] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    // TIME configuration states
    const [hour, setHour] = useState<number>(18);
    const [minute, setMinute] = useState<number>(0);
    const [selectedDays, setSelectedDays] = useState<number[]>([1]);

    // DAILY configuration states
    const [dailyOption, setDailyOption] = useState<DailyOption>('EVERY_X');
    const [dailyInterval, setDailyInterval] = useState<number>(1);

    // WEEKLY configuration states
    const [weeklyInterval, setWeeklyInterval] = useState<number>(1);

    // MONTHLY configuration states
    const [monthlyOption, setMonthlyOption] = useState<MonthlyOption>('DAY_OF_MONTH');
    const [monthlyDay, setMonthlyDay] = useState<number>(1);
    const [monthlyIntervalDay, setMonthlyIntervalDay] = useState<number>(1);
    const [monthlyWeekdayChoice, setMonthlyWeekdayChoice] = useState<SectionOption>('FIRST');
    const [monthlyIntervalWeekday, setMonthlyIntervalWeekday] = useState<number>(1);

    // YEARLY configuration states
    const [yearlyOption, setYearlyOption] = useState<YearlyOption>('DAY_OF_YEAR');
    const [yearlyDay, setYearlyDay] = useState<number>(15);
    const [yearlyMonth, setYearlyMonth] = useState<number>(2);
    const [yearlyWeekdayChoice, setYearlyWeekdayChoice] = useState<SectionOption>('FIRST');
    const [yearlyWeekdayMonth, setYearlyWeekdayMonth] = useState<number>(2);

    const toggleDay = (day: number): void => {
        if (selectedDays.includes(day)) setSelectedDays(selectedDays.filter(d => d !== day));
        else setSelectedDays([...selectedDays, day]);
    };

    const handleSave = (): void => {
        let cron: string = '';
        setErrorMessage('');

        try {
            if (periodicity === 'DAILY') {
                if (dailyOption === 'EVERY_X') {
                    cron = `${minute} ${hour} */${dailyInterval} * *`;
                } else if (dailyOption === 'WEEKDAY') {
                    cron = `${minute} ${hour} * * 1-5`;
                }
            } else if (periodicity === 'WEEKLY') {
                const days = selectedDays.length
                    ? selectedDays.sort((a, b) => a - b).map(day => `${day}#${weeklyInterval}`).join(',')
                    : '';
                cron = `${minute} ${hour} * * ${days}`;
            } else if (periodicity === 'MONTHLY') {
                if (monthlyOption === 'DAY_OF_MONTH') {
                    cron = `${minute} ${hour} ${monthlyDay} */${monthlyIntervalDay} *`;
                } else if (monthlyOption === 'WEEKDAY') {
                    const monthlyWeekday = monthlyWeekdayChoice === 'FIRST' ? '1' : 'L';
                    cron = `${minute} ${hour} ${monthlyWeekday}W */${monthlyIntervalWeekday} *`;
                }
            } else if (periodicity === 'YEARLY') {
                if (yearlyOption === 'DAY_OF_YEAR') {
                    cron = `${minute} ${hour} ${yearlyDay} ${yearlyMonth} *`;
                } else if (yearlyOption === 'WEEKDAY') {
                    const monthlyWeekday = monthlyWeekdayChoice === 'FIRST' ? '1' : 'L';
                    cron = `${minute} ${hour} ${monthlyWeekday}W ${yearlyWeekdayMonth} *`;
                }
            }

            C2Q.getQuartz(cron);
            setcronExpression(cron);
            setCronHumanFriendly(cronstrue.toString(cron, { verbose: true }));
        } catch (error) {
            setErrorMessage('Invalid CRON expression: ' + (error as string));
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#2c3e50' }}>Cron Scheduler</h1>
            <div style={{ marginBottom: '20px' }}>
                <h3>Periodicity</h3>
                <label style={{ marginRight: '10px' }}>
                    <input
                        type="radio"
                        name="periodicity"
                        value="DAILY"
                        checked={periodicity === 'DAILY'}
                        onChange={() => setPeriodicity('DAILY')}
                    />
                    Daily
                </label>
                <label style={{ marginRight: '10px' }}>
                    <input
                        type="radio"
                        name="periodicity"
                        value="WEEKLY"
                        checked={periodicity === 'WEEKLY'}
                        onChange={() => setPeriodicity('WEEKLY')}
                    />
                    Weekly
                </label>
                <label style={{ marginRight: '10px' }}>
                    <input
                        type="radio"
                        name="periodicity"
                        value="MONTHLY"
                        checked={periodicity === 'MONTHLY'}
                        onChange={() => setPeriodicity('MONTHLY')}
                    />
                    Monthly
                </label>
                <label>
                    <input
                        type="radio"
                        name="periodicity"
                        value="YEARLY"
                        checked={periodicity === 'YEARLY'}
                        onChange={() => setPeriodicity('YEARLY')}
                    />
                    Yearly
                </label>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                {periodicity === 'DAILY' && (
                    <div>
                        <h2 style={{ color: '#16a085' }}>Daily Scheduler</h2>
                        <div>
                            <label style={{ marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    name="dailyOption"
                                    value="EVERY_X"
                                    checked={dailyOption === 'EVERY_X'}
                                    onChange={() => setDailyOption('EVERY_X')}
                                />
                                Every x day(s)
                            </label>
                            {dailyOption === 'EVERY_X' && (
                                <input
                                    type="number"
                                    value={dailyInterval}
                                    min="1"
                                    onChange={(e) => setDailyInterval(Number(e.target.value))}
                                    style={{ width: '50px', marginLeft: '10px' }}
                                />
                            )}
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="dailyOption"
                                    value="WEEKDAY"
                                    checked={dailyOption === 'WEEKDAY'}
                                    onChange={() => setDailyOption('WEEKDAY')}
                                />
                                Every Weekday
                            </label>
                        </div>
                    </div>
                )}

                {periodicity === 'WEEKLY' && (
                    <div>
                        <h2 style={{ color: '#16a085' }}>Weekly Scheduler</h2>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ marginRight: '10px' }}>
                                Every
                                <input
                                    type="number"
                                    value={weeklyInterval}
                                    min="1"
                                    onChange={(e) => setWeeklyInterval(Number(e.target.value))}
                                    style={{ marginLeft: '10px', marginRight: '10px', width: '50px' }}
                                />
                                week(s) on:
                            </label>
                        </div>
                        <div>
                            {daysOfWeek.map(day => (
                                <label key={day.value} style={{ marginRight: '10px' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedDays.includes(day.value)}
                                        onChange={() => toggleDay(day.value)}
                                    />
                                    {day.label}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {periodicity === 'MONTHLY' && (
                    <div>
                        <h2 style={{ color: '#16a085' }}>Monthly Scheduler</h2>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="monthlyOption"
                                    value="DAY_OF_MONTH"
                                    checked={monthlyOption === 'DAY_OF_MONTH'}
                                    onChange={() => setMonthlyOption('DAY_OF_MONTH')}
                                />
                                Day&nbsp;
                                <input
                                    type="number"
                                    value={monthlyDay}
                                    min="1"
                                    max="31"
                                    onChange={(e) => setMonthlyDay(Number(e.target.value))}
                                    style={{ marginLeft: '5px', width: '50px' }}
                                />
                                &nbsp;of every&nbsp;
                                <input
                                    type="number"
                                    value={monthlyIntervalDay}
                                    min="1"
                                    onChange={(e) => setMonthlyIntervalDay(Number(e.target.value))}
                                    style={{ marginLeft: '5px', width: '50px' }}
                                />
                                &nbsp;month(s)
                            </label>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <label>
                                <input
                                    type="radio"
                                    name="monthlyOption"
                                    value="WEEKDAY"
                                    checked={monthlyOption === 'WEEKDAY'}
                                    onChange={() => setMonthlyOption('WEEKDAY')}
                                />
                                The&nbsp;
                                <label style={{ marginLeft: '5px' }}>
                                    <input
                                        type="radio"
                                        name="monthlyWeekdayChoice"
                                        value="FIRST"
                                        checked={monthlyWeekdayChoice === 'FIRST'}
                                        onChange={() => setMonthlyWeekdayChoice('FIRST')}
                                    />
                                    First
                                </label>
                                <label style={{ marginLeft: '10px' }}>
                                    <input
                                        type="radio"
                                        name="monthlyWeekdayChoice"
                                        value="LAST"
                                        checked={monthlyWeekdayChoice === 'LAST'}
                                        onChange={() => setMonthlyWeekdayChoice('LAST')}
                                    />
                                    Last
                                </label>
                                &nbsp;Weekday of every&nbsp;
                                <input
                                    type="number"
                                    value={monthlyIntervalWeekday}
                                    min="1"
                                    onChange={(e) => setMonthlyIntervalWeekday(Number(e.target.value))}
                                    style={{ marginLeft: '5px', width: '50px' }}
                                />
                                &nbsp;month(s)
                            </label>
                        </div>
                    </div>
                )}

                {periodicity === 'YEARLY' && (
                    <div>
                        <h2 style={{ color: '#16a085' }}>Yearly Scheduler</h2>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="yearlyOption"
                                    value="DAY_OF_YEAR"
                                    checked={yearlyOption === 'DAY_OF_YEAR'}
                                    onChange={() => setYearlyOption('DAY_OF_YEAR')}
                                />
                                On&nbsp;
                                <input
                                    type="number"
                                    value={yearlyDay}
                                    min="1"
                                    max="31"
                                    onChange={(e) => setYearlyDay(Number(e.target.value))}
                                    style={{ marginLeft: '5px', width: '50px' }}
                                />
                                &nbsp;of&nbsp;
                                <input
                                    type="number"
                                    value={yearlyMonth}
                                    min="1"
                                    max="12"
                                    onChange={(e) => setYearlyMonth(Number(e.target.value))}
                                    style={{ marginLeft: '5px', width: '50px' }}
                                />
                                &nbsp;month
                            </label>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <label>
                                <input
                                    type="radio"
                                    name="yearlyOption"
                                    value="WEEKDAY"
                                    checked={yearlyOption === 'WEEKDAY'}
                                    onChange={() => setYearlyOption('WEEKDAY')}
                                />
                                The&nbsp;
                                <label style={{ marginLeft: '5px' }}>
                                    <input
                                        type="radio"
                                        name="yearlyWeekdayChoice"
                                        value="FIRST"
                                        checked={yearlyWeekdayChoice === 'FIRST'}
                                        onChange={() => setYearlyWeekdayChoice('FIRST')}
                                    />
                                    First
                                </label>
                                <label style={{ marginLeft: '10px' }}>
                                    <input
                                        type="radio"
                                        name="yearlyWeekdayChoice"
                                        value="LAST"
                                        checked={yearlyWeekdayChoice === 'LAST'}
                                        onChange={() => setYearlyWeekdayChoice('LAST')}
                                    />
                                    Last
                                </label>
                                &nbsp;Weekday of&nbsp;
                                <input
                                    type="number"
                                    value={yearlyWeekdayMonth}
                                    min="1"
                                    max="12"
                                    onChange={(e) => setYearlyWeekdayMonth(Number(e.target.value))}
                                    style={{ marginLeft: '5px', width: '50px' }}
                                />
                                &nbsp;month
                            </label>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '20px' }}>
                    <h2 style={{ color: '#2980b9' }}>Time Configuration</h2>
                    <label style={{ marginRight: '20px' }}>
                        Hour:
                        <input
                            type="number"
                            value={hour}
                            min="0"
                            max="23"
                            onChange={(e) => setHour(Number(e.target.value))}
                            style={{ marginLeft: '10px', width: '50px' }}
                        />
                    </label>
                    <label>
                        Minute:
                        <input
                            type="number"
                            value={minute}
                            min="0"
                            max="59"
                            onChange={(e) => setMinute(Number(e.target.value))}
                            style={{ marginLeft: '10px', width: '50px' }}
                        />
                    </label>
                </div>
            </div>

            <button onClick={handleSave} style={{
                marginTop: '30px',
                padding: '10px 20px',
                backgroundColor: '#27ae60',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            }}>
                Save
            </button>

            <div style={{ marginTop: '20px' }}>
                <h2 style={{ color: '#8e44ad' }}>Cron Expression</h2>
                {errorMessage ? (
                    <p style={{ color: '#e74c3c' }}>{errorMessage}</p>
                ) : (
                    <p>{cronExpression}</p>
                )}
            </div>
            <div style={{ marginTop: '20px' }}>
                <h2 style={{ color: '#d35400' }}>Cron Meaning</h2>
                <p>{cronHumanFriendly}</p>
            </div>
        </div>
    );
};

export default App;
