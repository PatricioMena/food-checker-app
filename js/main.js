document.querySelector('button').addEventListener('click', getFetch);

function getFetch() {
  // const scannedBarcode = document.querySelector('input').value;
  const scannedBarcode = document.getElementById('barcode').value;
  console.log(scannedBarcode);
  const url = `https://world.openfoodfacts.org/api/v0/product/${scannedBarcode}.json`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      if (data.status === 1) {
        const productObj = new ProductInfo(data.product);

        console.log(productObj);
        productObj.showInfo();
        productObj.showMacros();
        productObj.showIngredients();
        productObj.showAllergens();
      } else if (data.status === 0) {
        document.getElementById('product-name-quantity').innerText = 'Product not found';
      }
    });
}

class ProductInfo {
  constructor(productData) {
    // productData = data.product
    this.name = productData.product_name;
    this.quantity = productData.quantity;
    this.image = productData.image_url;
    this.ingredients = productData.ingredients;
    this.nutriments = productData.nutriments;
    this.allergens = productData.allergens_hierarchy;
  }

  showInfo() {
    document.getElementById('product-name-quantity').innerText = `${this.name} ${this.quantity}`;
    // document.getElementById('product-quantity').innerText = this.quantity;
    document.getElementById('product-img').src = this.image;
  }

  showMacros() {
    let macrosTable = document.getElementById('macros-table');

    // Clear row if there's one already:
    for (let i = 1; i < macrosTable.rows.length; ) {
      macrosTable.deleteRow(i);
    }

    let newRow = macrosTable.insertRow();

    let newCarbsCell = newRow.insertCell(0);
    let newFatsCell = newRow.insertCell(1);
    let newProteinsCell = newRow.insertCell(-1);

    let newCarbsText = document.createTextNode(
      `${this.nutriments.carbohydrates_100g} ${this.nutriments.carbohydrates_unit}`
    );
    let newFatsText = document.createTextNode(
      `${this.nutriments.fat_100g} ${this.nutriments.fat_unit}`
    );
    let newProteinsText = document.createTextNode(
      `${this.nutriments.proteins_100g} ${this.nutriments.proteins_unit}`
    );
    // console.log(newCarbsText);
    // console.log(newProteinsText);

    newCarbsCell.appendChild(newCarbsText);
    newFatsCell.appendChild(newFatsText);
    newProteinsCell.appendChild(newProteinsText);
  }

  showIngredients() {
    let ingredientsTable = document.getElementById('ingredient-table');

    // Clear table if there's one already
    for (let i = 1; i < ingredientsTable.rows.length; ) {
      ingredientsTable.deleteRow(i);
    }

    for (let key in this.ingredients) {
      let newIRow = ingredientsTable.insertRow(-1);

      let newICell = newIRow.insertCell(0);
      let newPCell = newIRow.insertCell(1);

      let newIText = document.createTextNode(this.ingredients[key].text);
      let newPText = document.createTextNode(this.ingredients[key].percent_estimate.toFixed(2));

      newICell.appendChild(newIText);
      newPCell.appendChild(newPText);
    }
  }

  showAllergens() {
    // I want to display if the product has allergens
    let allergensTable = document.getElementById('allergens-table');
    // First I need to check and delete the rows if there's one alredy:
    for (let i = 1; i < allergensTable.rows.length; ) {
      allergensTable.deleteRow(i);
    }

    // From the allergens array I want to grab every value and delete the first four characters ("en:")
    let allergens = this.allergens.map((el) => el.slice(3));

    for (let i = 0; i < allergens.length; i++) {
      // For every item in allergens Array I want to create a new row,
      let newAllergensRow = allergensTable.insertRow();
      // Insert a cell in the row
      let newAllergensCell = newAllergensRow.insertCell();
      // Create Text Node
      let newAllergensText = document.createTextNode(allergens[i]);
      // Populate text node into cell
      newAllergensCell.appendChild(newAllergensText);
    }
  }
}

// Barcodes to test
// 3168930009191
// 7622210449283
