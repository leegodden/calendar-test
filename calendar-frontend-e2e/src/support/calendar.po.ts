export const getAddEventButton = () =>
  cy.get('button[data-testid="add-event-btn"');
export const findEvent = (eventTitle: string) =>
  cy.get('.rbc-event').contains(eventTitle).closest('.rbc-event');
