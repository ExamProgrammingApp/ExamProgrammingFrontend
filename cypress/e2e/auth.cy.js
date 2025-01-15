// cypress/e2e/auth.cy.js

describe("Authentication Flow", () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit("/auth");
    });
  
    it("Logs in successfully with valid credentials", () => {
        cy.get('input[placeholder="Email"]').type("vasile.bordei.teacher1@example.com");
        cy.get('input[placeholder="Password"]').type("test123");
        cy.contains("Login").click();
        cy.url().should("not.include", "/auth");
        cy.window().then((window) => {
            const userType = window.localStorage.getItem("userType");
            expect(userType).to.exist;
        });
    });
  
    it("Shows an error message for invalid credentials", () => {
        cy.get('input[placeholder="Email"]').type("invalid@test.com");
        cy.get('input[placeholder="Password"]').type("wrongpassword");
        cy.contains("Login").click();
        cy.contains("Invalid credentials! Please try again.").should("be.visible");
        cy.url().should("include", "/auth");
    });
  
    it("Allows user to continue without login", () => {
        cy.contains("Continue without login").click();
        cy.url().should("include", "/all_exams");
        cy.window().then((window) => {
            const userType = window.localStorage.getItem("userType");
            expect(userType).to.equal("user");
        });
    });
});