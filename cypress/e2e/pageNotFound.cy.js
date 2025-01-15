// cypress/e2e/pageNotFound.cy.js

describe("PageNotFound", () => {
    it("Shows 404 page and a Go Back button for invalid routes", () => {
      cy.visit("/auth");
      cy.get('input[placeholder="Email"]').type("vasile.bordei.student1@example.com");
      cy.get('input[placeholder="Password"]').type("test123");
      cy.contains("Login").click().wait(2000);
      cy.visit("/this_route_does_not_exist");
      cy.contains("OOOPPPSSS!").should("be.visible");
      cy.contains("Go Back").click();
      cy.url().should("include", "/exams");
    });
  });