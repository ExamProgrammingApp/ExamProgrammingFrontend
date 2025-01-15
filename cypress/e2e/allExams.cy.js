

describe("AllExams Page", () => {
    it("Allows HEADSTUDENT to view /all_exams after a login", () => {
      cy.visit("/auth");
      cy.get('input[placeholder="Email"]').type("vasile.bordei.headstudent1@example.com");
      cy.get('input[placeholder="Password"]').type("test123");
      cy.contains("Login").click().wait(3000);

      cy.intercept("GET", "**/exams/public").as("getAllExams");

      cy.visit("/all_exams");
      cy.wait("@getAllExams");

      cy.url().should("include", "/all_exams");
      cy.contains("Exams").should("be.visible");
    });
  
    it("Allows USER to view /all_exams via 'Continue without login'", () => {
      cy.visit("/auth");

      cy.intercept("GET", "**/exams/public").as("getAllExams");

      cy.contains("Continue without login").click();
      cy.wait("@getAllExams");

      cy.url().should("include", "/all_exams");
      cy.contains("Filter").should("exist");
    });
  
    it("Blocks TEACHER from /all_exams (if that’s the intended behavior)", () => {
      cy.visit("/auth");
      cy.get('input[placeholder="Email"]').type("vasile.bordei.teacher1@example.com");
      cy.get('input[placeholder="Password"]').type("test123");
      cy.contains("Login").click();

      cy.intercept("GET", "**/exams/public").as("getAllExams");

      cy.visit("/all_exams");

      cy.url().should("not.include", "/all_exams");
      cy.contains("OOOPPPSSS!").should("not.exist");
    });
  });