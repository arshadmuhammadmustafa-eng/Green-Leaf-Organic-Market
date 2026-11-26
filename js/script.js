// Green Leaf Organic Market - order form validation
// Runs when the order form is submitted. Checks name, email, product,
// quantity and delivery date, and writes a message into the page for each problem.

(function () {
  "use strict";

  var form = document.getElementById("order-form");
  if (!form) { return; } // this script is loaded on the Order page only

  var summary = document.getElementById("form-summary");

  function showError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var box = document.getElementById(fieldId + "-error");
    box.textContent = message;
    field.classList.add("invalid");
    field.setAttribute("aria-invalid", "true");
  }

  function clearError(fieldId) {
    var field = document.getElementById(fieldId);
    var box = document.getElementById(fieldId + "-error");
    box.textContent = "";
    field.classList.remove("invalid");
    field.removeAttribute("aria-invalid");
  }

  function validateForm() {
    var errors = [];
    var ids = ["name", "email", "product", "quantity", "date"];
    ids.forEach(clearError);

    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var product = document.getElementById("product").value;
    var quantityText = document.getElementById("quantity").value.trim();
    var date = document.getElementById("date").value;

    // 1. Name: required, at least 2 characters
    if (name === "") {
      showError("name", "Please enter your full name.");
      errors.push("name");
    } else if (name.length < 2) {
      showError("name", "Your name must have at least 2 characters.");
      errors.push("name");
    }

    // 2. Email: required, simple format check
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
      showError("email", "Please enter your email address.");
      errors.push("email");
    } else if (!emailPattern.test(email)) {
      showError("email", "Please enter a valid email, for example mariam@example.com.");
      errors.push("email");
    }

    // 3. Product: must choose one
    if (product === "") {
      showError("product", "Please choose a product from the list.");
      errors.push("product");
    }

    // 4. Quantity: whole number from 1 to 50
    var quantity = Number(quantityText);
    if (quantityText === "") {
      showError("quantity", "Please enter how many kilograms you want.");
      errors.push("quantity");
    } else if (isNaN(quantity) || quantity % 1 !== 0) {
      showError("quantity", "Quantity must be a whole number, such as 2.");
      errors.push("quantity");
    } else if (quantity < 1 || quantity > 50) {
      showError("quantity", "Quantity must be between 1 and 50 kg.");
      errors.push("quantity");
    }

    // 5. Delivery date: required and not in the past
    if (date === "") {
      showError("date", "Please choose a delivery date.");
      errors.push("date");
    } else {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var chosen = new Date(date + "T00:00:00");
      if (chosen < today) {
        showError("date", "The delivery date cannot be in the past.");
        errors.push("date");
      }
    }

    return errors;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page reloading so we can show our messages
    var errors = validateForm();

    if (errors.length > 0) {
      summary.className = "form-summary problem";
      summary.textContent = "Your order was not sent. Please fix " + errors.length +
        (errors.length === 1 ? " problem" : " problems") + " shown above.";
      document.getElementById(errors[0]).focus(); // move keyboard users to the first problem
    } else {
      var name = document.getElementById("name").value.trim();
      summary.className = "form-summary success";
      summary.textContent = "Thank you, " + name + "! Your order has been received. " +
        "We will email you to confirm.";
      form.reset();
    }
  });

  // Clear a field's message as soon as the customer starts correcting it
  ["name", "email", "product", "quantity", "date"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () { clearError(id); });
  });
})();
