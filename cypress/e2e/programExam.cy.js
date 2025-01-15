// cypress/e2e/programExam.cy.js

describe("ProgramExam Page", () => {
    beforeEach(() => {
        cy.visit("/auth");
        cy.get('input[placeholder="Email"]').type("vasile.bordei.headstudent1@example.com");
        cy.get('input[placeholder="Password"]').type("test123");
        cy.contains("Login").click().wait(3000);
        cy.visit("/program_exam");
    });
  
    it("Displays form to schedule a new exam", () => {
        cy.contains("Schedule an exam").should("be.visible");
        cy.get("select[name='teacher']").should("exist");
        cy.get("input[name='students']").should("exist");
    });
  
    it("Schedules an exam successfully", () => {
        cy.get("select[name='teacher']").wait(1000).select("Andrei Popescu");
        cy.get('select[name="subject"]').select("Computer Science");
        cy.get("input[name='students']").type("30");
        cy.get("input[name='duration']").type("120");
        cy.get('[aria-rowindex="5"] > :nth-child(5) > .MuiButtonBase-root').click();
        cy.get("input[type='time']").clear().type("10:00");
        cy.contains("Add Exam").click();
        cy.contains("Exam was successfully added").should("exist");
    });
  
    it("Handles validation errors", () => {
        cy.contains("Add Exam").click();
        cy.contains("All fields are required").should("exist");
    });
});