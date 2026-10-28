import React from 'react';
import classNames from 'classnames';

import { FormattedMessage } from '../../../util/reactIntl';
import { H6 } from '../../../components';

import css from './TransactionPanel.module.css';

// Functional component as a helper to build OrderBreakdown
const BreakdownMaybe = props => {
  const {
    className,
    rootClassName,
    orderBreakdown,
    processName,
    priceVariantName,
    scheduleLater,
  } = props;
  const classes = classNames(rootClassName || css.breakdownMaybe, className);

  return orderBreakdown ? (
    <div className={classes}>
      {priceVariantName ? (
        <div className={css.bookingPriceVariant}>
          <p>{priceVariantName}</p>
        </div>
      ) : null}

      {scheduleLater && processName !== 'levelher-prepaid' ? (
        <div
          style={{
            background: '#fff4e5',
            border: '1px solid #f5c26b',
            borderRadius: 6,
            padding: '8px 12px',
            marginBottom: 12,
            fontSize: 14,
            lineHeight: '20px',
          }}
        >
          <strong>Date to be confirmed.</strong> This booking is paid. The date below is
          tentative. Please agree the final date and time in the messages.
        </div>
      ) : null}

      <H6 as="h3" className={css.orderBreakdownTitle}>
        <FormattedMessage id={`TransactionPanel.${processName}.orderBreakdownTitle`} />
      </H6>
      <hr className={css.totalDivider} />
      {orderBreakdown}
    </div>
  ) : null;
};

export default BreakdownMaybe;