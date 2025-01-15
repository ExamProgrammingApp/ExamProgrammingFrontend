// cypress/e2e/editExams.cy.js

describe("EditExams (Modify Exam) Page", () => {
    beforeEach(() => {
      cy.visit("/auth");
      cy.get('input[placeholder="Email"]').type("vasile.bordei.headstudent1@example.com");
      cy.get('input[placeholder="Password"]').type("test123");
      cy.contains("Login").click().wait(3000);
      cy.visit("/modify_exam");
    });
  
    it("Displays a list of rejected exams", () => {
      cy.contains("Modify an unconfirmed exam").should("be.visible");
    });
  
    it("Selects an exam from the table to edit", () => {
      cy.contains("No exams found").should("not.exist");
      cy.get("table tbody tr").first().click();
    });
  
    it("Edits date/time and saves changes", () => {
        cy.contains("No exams found").should("not.exist");
      cy.get("table tbody tr").first().click();
        cy.get('.w-52').select("14:00");
      cy.contains("Confirm").click();
      cy.contains("Exam updated successfully").should("exist");
    });
  });