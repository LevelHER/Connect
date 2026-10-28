import {
  TX_TRANSITION_ACTOR_CUSTOMER as CUSTOMER,
  TX_TRANSITION_ACTOR_PROVIDER as PROVIDER,
  CONDITIONAL_RESOLVER_WILDCARD,
  ConditionalResolver,
} from '../../transactions/transaction';

/**
 * Get state data against the pay-now, schedule-later process for TransactionPage's UI.
 * After the customer pays, the transaction waits in "paid-unscheduled" until
 * the customer chooses a date.
 */
export const getStateDataForPrepaidProcess = (txInfo, processInfo) => {
  const { transactionRole } = txInfo;
  const _ = CONDITIONAL_RESOLVER_WILDCARD;

  const { processName, processState, states, transitions, actionButtonProps, leaveReviewProps } = processInfo;

  return new ConditionalResolver([processState, transactionRole])
    .cond([states.PAID_UNSCHEDULED, CUSTOMER], () => {
      return { processName, processState, showDetailCardHeadings: true, showSchedulePanel: true };
    })
    .cond([states.PAID_UNSCHEDULED, PROVIDER], () => {
      return { processName, processState, showDetailCardHeadings: true };
    })
    .cond([states.BOOKED, PROVIDER], () => { return { processName, processState, showDetailCardHeadings: true, showActionButtons: true, secondaryButtonProps: actionButtonProps(transitions.CANCEL_BY_PROVIDER, PROVIDER) }; })
    .cond([states.BOOKED, _], () => {
      return { processName, processState, showDetailCardHeadings: true };
    })
    .cond([states.DELIVERED, _], () => {
      return {
        processName,
        processState,
        showDetailCardHeadings: true,
        showReviewAsFirstLink: true,
        showActionButtons: true,
        primaryButtonProps: leaveReviewProps,
      };
    })
    .cond([states.REVIEWED_BY_PROVIDER, CUSTOMER], () => {
      return {
        processName,
        processState,
        showDetailCardHeadings: true,
        showReviewAsSecondLink: true,
        showActionButtons: true,
        primaryButtonProps: leaveReviewProps,
      };
    })
    .cond([states.REVIEWED_BY_CUSTOMER, PROVIDER], () => {
      return {
        processName,
        processState,
        showDetailCardHeadings: true,
        showReviewAsSecondLink: true,
        showActionButtons: true,
        primaryButtonProps: leaveReviewProps,
      };
    })
    .cond([states.REVIEWED, _], () => {
      return { processName, processState, showDetailCardHeadings: true, showReviews: true };
    })
    .default(() => {
      return { processName, processState, showDetailCardHeadings: true };
    })
    .resolve();
};