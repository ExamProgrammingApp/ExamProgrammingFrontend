// cypress/e2e/confirmExam.cy.js

describe("ConfirmExam Page", () => {
    beforeEach(() => {
        cy.visit("/auth");
        cy.get('input[placeholder="Email"]').type("vasile.bordei.teacher1@example.com");
        cy.get('input[placeholder="Password"]').type("test123");
        cy.contains("Login").click().wait(3000);
        cy.visit("/confirm_exam");
    });

    it("Displays list of unconfirmed exams", () => {
        cy.contains("No exams found").should("not.exist");
        cy.contains("Confirm Exam").should("be.visible");
    });

    it("Can confirm an exam (assign room, assistant, etc.)", () => {
        cy.contains("No exams found").should("not.exist");
        cy.get("table").within(() => {
            cy.get(':nth-child(1) > .flex > .text-green-600 > svg').click();
        });
        cy.get("select").first().select("Maria Ionescu");
        cy.get('.max-h-52 > :nth-child(1) > .w-full').select("C207 : Capacity-15");
        cy.get('.max-h-52 > :nth-child(2) > .w-full').select("C208 : Capacity-15");
        cy.contains("CONFIRM").click();
    });

    it("Can reject an exam", () => {
        cy.get("table").within(() => {
            cy.get('.text-red-600 > svg > path').click();
        });
        cy.contains("No exams found").should("be.visible");
    });
});