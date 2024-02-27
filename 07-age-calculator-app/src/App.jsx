import { useRef, useState } from 'react';
import arrowIcon from './assets/images/icon-arrow.svg';
import { intervalToDuration } from 'date-fns';

const App = () => {
  const [formData, setFormData] = useState({
    day: '',
    month: '',
    year: '',
  });

  const [duration, setDuration] = useState({
    years: null,
    months: null,
    days: null,
  });

  const [formError, setFormError] = useState({
    day: null,
    month: null,
    year: null,
  });

  const lastRef = useRef();

  const handleChange = (e) => {
    const { value, name } = e.target;
    const parsedValue = parseInt(value);

    if (value.length > 0 && !parsedValue) return;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isValidDate = (date) => {
    const errors = {
      day: null,
      month: null,
      year: null,
    };

    const { day, month, year } = date;

    let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
      daysInMonth[1] = 29;
    }

    if (!day || !month || !year) {
      errors.day = 'All fields are required';
      errors.month = 'All fields are required';
      errors.year = 'All fields are required';
    }

    if (!year) {
      errors.year = 'This field is required';
    }
    if (year > new Date().getFullYear()) {
      errors.year = 'Year must be in past';
    }

    if (!month) {
      errors.month = 'This field is required';
    } else if (month < 1 || month > 12) {
      errors.month = 'Must be a valid month';
    }

    if (!day) {
      errors.day = 'This field is required';
    } else if (day < 1 || day > daysInMonth[month - 1]) {
      errors.day = 'Must be a valid date';
    }

    setFormError(errors);

    return Object.values(errors).every((val) => val === null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const valid = isValidDate(formData);

    if (!valid) {
      return;
    }

    const { day, month, year } = formData;

    const start = new Date(year, month, day, 0, 0, 0);
    const end = new Date();

    const duration = intervalToDuration({
      start,
      end,
    });

    setDuration(duration);
    setFormData({
      day: '',
      month: '',
      year: '',
    });

    lastRef?.current?.blur();
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <div className="form--container">
          <div className="form--item">
            <label className={`${formError.day && 'error'}`} htmlFor="day">
              Day
            </label>
            <input
              className={`${formError.day && 'error'}`}
              type="text"
              name="day"
              id="day"
              placeholder="DD"
              inputMode="numeric"
              value={formData.day}
              onChange={handleChange}
            />
            <p className="input--error">{formError.day}</p>
          </div>
          <div className="form--item">
            <label className={`${formError.month && 'error'}`} htmlFor="month">
              Month
            </label>
            <input
              className={`${formError.month && 'error'}`}
              type="text"
              name="month"
              id="month"
              placeholder="MM"
              inputMode="numeric"
              value={formData.month}
              onChange={handleChange}
            />
            <p className="input--error">{formError.month}</p>
          </div>
          <div className="form--item">
            <label className={`${formError.year && 'error'}`} htmlFor="year">
              Year
            </label>
            <input
              ref={lastRef}
              className={`${formError.year && 'error'}`}
              type="text"
              name="year"
              id="year"
              placeholder="YYYY"
              inputMode="numeric"
              value={formData.year}
              onChange={handleChange}
            />
            <p className="input--error error">{formError.year}</p>
          </div>
        </div>
        <div className="middle--item">
          <hr />
          <button className="img--container">
            <img src={arrowIcon} alt="icon down" />
          </button>
          <hr />
        </div>
      </form>

      <div className="res--div">
        <p>
          <span className="res--value">{duration.years ?? '--'}</span> years
        </p>
        <p>
          <span className="res--value">{duration.months ?? '--'}</span> months
        </p>
        <p>
          <span className="res--value">{duration.days ?? '--'}</span> days
        </p>
      </div>
    </main>
  );
};
export default App;
