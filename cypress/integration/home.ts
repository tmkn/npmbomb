it("works", () => {
    cy.visit("http://localhost:8080");
    cy.wait(2000);
    cy.percySnapshot("home page", { widths: [320, 768, 1200] });
});
