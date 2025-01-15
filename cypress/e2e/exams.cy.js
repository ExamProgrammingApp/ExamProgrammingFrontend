// cypress/e2e/exams.cy.js

describe("Exams Page", () => {
    it("Allows student to view the /exams page and fetch exam data", () => {
      cy.intercept("GET", "**/exams").as("getExams");
      cy.visit("/auth");
      cy.get('input[placeholder="Email"]').type("vasile.bordei.student1@example.com");
      cy.get('input[placeholder="Password"]').type("test123");
      cy.contains("Login").click().wait(2000);
      cy.visit("/exams");
      cy.url().should("include", "/exams");
      cy.wait("@getExams");
      cy.contains("No exams scheduled").should("not.exist");
    });
  
    it("Allows teacher to see their own exams", () => {
      cy.intercept("GET", "**/exams").as("getExams");
      cy.visit("/auth");
      cy.get('input[placeholder="Email"]').type("vasile.bordei.teacher1@example.com");
      cy.get('input[placeholder="Password"]').type("test123");
      cy.contains("Login").click().wait(2000);
      cy.visit("/exams");
      cy.url().should("include", "/exams");
      cy.wait("@getExams");
    });
  
    it("Blocks USER from the /exams page", () => {
      cy.visit("/auth");
      cy.contains("Continue without login").click();
      cy.visit("/exams");
      cy.contains("OOOPPPSSS!").should("exist");
    });
  });