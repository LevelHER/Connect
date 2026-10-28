/**
 * Transaction process graph for pay-now, schedule-later bookings:
 *   - levelher-prepaid
 *
 * The customer pays first (no date needed). After payment the transaction waits
 * in "paid-unscheduled" until the customer picks a date (schedule transition).
 */

export const transitions = {
  REQUEST_PAYMENT: 'transition/request-payment', INQUIRE: 'transition/inquire-unused',
  EXPIRE_PAYMENT: 'transition/expire-payment',
  CONFIRM_PAYMENT: 'transition/confirm-payment',
  SCHEDULE: 'transition/schedule',
  CANCEL_UNSCHEDULED: 'transition/cancel-unscheduled',
  CANCEL: 'transition/cancel', CANCEL_BY_PROVIDER: 'transition/cancel-by-provider',
  COMPLETE: 'transition/complete',
  REVIEW_1_BY_PROVIDER: 'transition/review-1-by-provider',
  REVIEW_2_BY_PROVIDER: 'transition/review-2-by-provider',
  REVIEW_1_BY_CUSTOMER: 'transition/review-1-by-customer',
  REVIEW_2_BY_CUSTOMER: 'transition/review-2-by-customer',
  EXPIRE_CUSTOMER_REVIEW_PERIOD: 'transition/expire-customer-review-period',
  EXPIRE_PROVIDER_REVIEW_PERIOD: 'transition/expire-provider-review-period',
  EXPIRE_REVIEW_PERIOD: 'transition/expire-review-period',
};

export const states = {
  INITIAL: 'initial',
  PENDING_PAYMENT: 'pending-payment',
  PAYMENT_EXPIRED: 'payment-expired',
  PAID_UNSCHEDULED: 'paid-unscheduled',
  BOOKED: 'booked',
  CANCELED: 'canceled',
  DELIVERED: 'delivered',
  REVIEWED: 'reviewed',
  REVIEWED_BY_CUSTOMER: 'reviewed-by-customer',
  REVIEWED_BY_PROVIDER: 'reviewed-by-provider',
};

export const graph = {
  id: 'levelher-prepaid/release-1',
  initial: states.INITIAL,
  states: {
    [states.INITIAL]: {
      on: {
        [transitions.REQUEST_PAYMENT]: states.PENDING_PAYMENT,
      },
    },
    [states.PENDING_PAYMENT]: {
      on: {
        [transitions.EXPIRE_PAYMENT]: states.PAYMENT_EXPIRED,
        [transitions.CONFIRM_PAYMENT]: states.PAID_UNSCHEDULED,
      },
    },
    [states.PAYMENT_EXPIRED]: {},
    [states.PAID_UNSCHEDULED]: {
      on: {
        [transitions.SCHEDULE]: states.BOOKED,
        [transitions.CANCEL_UNSCHEDULED]: states.CANCELED,
      },
    },
    [states.BOOKED]: {
      on: {
        [transitions.CANCEL]: states.CANCELED, [transitions.CANCEL_BY_PROVIDER]: states.CANCELED,
        [transitions.COMPLETE]: states.DELIVERED,
      },
    },
    [states.CANCELED]: {},
    [states.DELIVERED]: {
      on: {
        [transitions.EXPIRE_REVIEW_PERIOD]: states.REVIEWED,
        [transitions.REVIEW_1_BY_CUSTOMER]: states.REVIEWED_BY_CUSTOMER,
        [transitions.REVIEW_1_BY_PROVIDER]: states.REVIEWED_BY_PROVIDER,
      },
    },
    [states.REVIEWED_BY_CUSTOMER]: {
      on: {
        [transitions.REVIEW_2_BY_PROVIDER]: states.REVIEWED,
        [transitions.EXPIRE_PROVIDER_REVIEW_PERIOD]: states.REVIEWED,
      },
    },
    [states.REVIEWED_BY_PROVIDER]: {
      on: {
        [transitions.REVIEW_2_BY_CUSTOMER]: states.REVIEWED,
        [transitions.EXPIRE_CUSTOMER_REVIEW_PERIOD]: states.REVIEWED,
      },
    },
    [states.REVIEWED]: { type: 'final' },
  },
};

export const isRelevantPastTransition = transition => {
  return [
    transitions.CONFIRM_PAYMENT,
    transitions.SCHEDULE, transitions.CANCEL_BY_PROVIDER,
    transitions.CANCEL_UNSCHEDULED,
    transitions.CANCEL,
    transitions.COMPLETE,
    transitions.REVIEW_1_BY_CUSTOMER,
    transitions.REVIEW_1_BY_PROVIDER,
    transitions.REVIEW_2_BY_CUSTOMER,
    transitions.REVIEW_2_BY_PROVIDER,
  ].includes(transition);
};

export const isCustomerReview = transition => {
  return [transitions.REVIEW_1_BY_CUSTOMER, transitions.REVIEW_2_BY_CUSTOMER].includes(transition);
};

export const isProviderReview = transition => {
  return [transitions.REVIEW_1_BY_PROVIDER, transitions.REVIEW_2_BY_PROVIDER].includes(transition);
};

export const isPrivileged = transition => {
  return [transitions.REQUEST_PAYMENT].includes(transition);
};

export const isCompleted = transition => {
  const txCompletedTransitions = [
    transitions.COMPLETE,
    transitions.REVIEW_1_BY_CUSTOMER,
    transitions.REVIEW_1_BY_PROVIDER,
    transitions.REVIEW_2_BY_CUSTOMER,
    transitions.REVIEW_2_BY_PROVIDER,
    transitions.EXPIRE_REVIEW_PERIOD,
    transitions.EXPIRE_CUSTOMER_REVIEW_PERIOD,
    transitions.EXPIRE_PROVIDER_REVIEW_PERIOD,
  ];
  return txCompletedTransitions.includes(transition);
};

export const isRefunded = transition => {
  const txRefundedTransitions = [
    transitions.EXPIRE_PAYMENT, transitions.CANCEL_BY_PROVIDER,
    transitions.CANCEL,
    transitions.CANCEL_UNSCHEDULED,
  ];
  return txRefundedTransitions.includes(transition);
};

export const statesNeedingProviderAttention = [];