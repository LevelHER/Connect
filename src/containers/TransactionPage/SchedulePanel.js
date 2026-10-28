import React, { useState } from 'react';
import { PrimaryButton } from '../../components';

const tzOffsetMs = (utcMs, timeZone) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(utcMs));
  const g = t => Number(parts.find(p => p.type === t).value);
  const asUtc = Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'), g('second'));
  return asUtc - utcMs;
};

const zonedToUtcMs = (dateStr, timeStr, timeZone) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm] = timeStr.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm, 0);
  const first = guess - tzOffsetMs(guess, timeZone);
  return guess - tzOffsetMs(first, timeZone);
};
const SchedulePanel = props => {
  const { listing, transaction, onSchedule, inProgress, error } = props;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [localError, setLocalError] = useState(null);

  const variants = listing?.attributes?.publicData?.priceVariants || [];
  const fixedItem = (transaction?.attributes?.lineItems || []).find(
    i => i.code === 'line-item/fixed'
  );
  const paidAmount = fixedItem?.unitPrice?.amount;
  const variant = variants.find(v => v.priceInSubunits === paidAmount) || variants[0];
  const minutes = variant?.bookingLengthInMinutes || 60;

  const today = new Date();
  const pad = n => String(n).padStart(2, '0');
  const minDate = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());

  const handleSubmit = () => {
    setLocalError(null);
    if (!date || !time) {
      setLocalError('Please choose a date and a start time.');
      return;
    }
    const tz = listing?.attributes?.availabilityPlan?.timezone; const start = tz ? new Date(zonedToUtcMs(date, time, tz)) : new Date(date + 'T' + time + ':00');
    if (isNaN(start.getTime()) || start.getTime() < Date.now()) {
      setLocalError('Please choose a date and time in the future.');
      return;
    }
    const end = new Date(start.getTime() + minutes * 60000);
    onSchedule({ bookingStart: start, bookingEnd: end });
  };

  const boxStyle = { border: '1px solid #C4416B', borderRadius: 8, padding: 16, margin: '0 0 16px', background: '#FDF1F5' };
  const inputStyle = { width: '100%', padding: 8, margin: '4px 0 12px', border: '1px solid #ccc', borderRadius: 4 };

  return (
    <div style={boxStyle}>
      <h3 style={{ margin: '0 0 8px' }}>Choose your date</h3>
      <p style={{ margin: '0 0 12px', fontSize: 14 }}>
        Your payment is complete. Pick a date and start time. Your appointment lasts {minutes} minutes. You will not be charged again.
      </p>
      <label>Date</label>
      <input type="date" min={minDate} value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
      <label>Start time</label>
      <input type="time" step="900" value={time} onChange={e => setTime(e.target.value)} style={inputStyle} />
      {localError ? <p style={{ color: '#c0392b', fontSize: 14 }}>{localError}</p> : null}
      {error ? (
        <p style={{ color: '#c0392b', fontSize: 14 }}>
          That time could not be booked. It may not be available. Please try another date or time.
        </p>
      ) : null}
      <PrimaryButton type="button" onClick={handleSubmit} inProgress={inProgress} disabled={inProgress}>
        Confirm date
      </PrimaryButton>
    </div>
  );
};

export default SchedulePanel;