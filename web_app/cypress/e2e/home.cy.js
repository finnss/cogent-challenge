describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
  });

  it('handles file upload', () => {
    cy.visit('/');

    // Actual file upload to server
    cy.get('input[type=file]').selectFile('./cypress/data/dummy_image.png', { force: true });
    cy.wait(500);

    // UI should show a table showing the new job
    cy.get('.JobsTable').should('exist');

    // UI should show the original file name in its second column
    cy.get('td p').should('contain', 'dummy_image.png');

    // Clicking the "view" button should trigger a request for detailed image information
    // and show it in a popup
    cy.get('td button').eq(0).click();
    cy.get('.MuiDialog-container').should('exist');
    cy.get('.MuiDialog-container th span').eq(3).should('contain', 'Full Image URL');
    cy.get('.MuiDialog-container td a').eq(0).should('not.contain', '–');

    // Clicking "Close" should close the modal
    cy.get('.MuiDialog-container button').last().click();
    cy.get('.MuiDialog-container').should('not.exist');

    // Finally we delete the thumbnail
    cy.get('td button').eq(2).click();
    cy.get('.JobsTable').should('not.exist');
  });
});
