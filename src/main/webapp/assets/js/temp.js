/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


let timer;
// Search bar
function searchFoodByKeyword() {
  const searchInput = document.getElementById("search-bar");
  const searchResultsList = document.getElementById("search-results-list");

  // Clear previous search results and display loading message
  searchResultsList.innerHTML = "Đang tìm món...";

  if (searchInput.value.trim() === "") {
    searchResultsList.classList.remove("d-flex");
    searchResultsList.classList.add("d-none");
    return; 
  }

  document.getElementsByTagName("body")[0].onclick = (e) => {
    if (e.target != searchResultsList && e.target != searchInput) {
      searchResultsList.innerHTML = "";
      searchResultsList.classList.remove("d-flex");
      searchResultsList.classList.add("d-none");
    }
  };

  // Clear previous timer if it exists
  clearTimeout(timer);
  // Starts a timer to get the search results
  // This timer should be cancelled when the input value changes (user types into the search bar)
  timer = setTimeout(() => {
    // Fetch search results based on the input
    fetch(`http://localhost:8001/search_food_by_name/${searchInput.value}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          // Clear loading message
          searchResultsList.innerHTML = "";
          data.forEach((item) => {
            // Create a card
            const card = document.createElement("div");
            card.classList.add("card", "shadow");

            // Create a row for card content
            const row = document.createElement("div");
            {
              row.classList.add("row", "g-0");
              card.appendChild(row);
            }

            // Create a column for the card body
            const bodyCol = document.createElement("div");
            {
              bodyCol.classList.add("col-sm-10");

              // Create a card body
              const cardBody = document.createElement("div");
              {
                cardBody.classList.add("card-body");

                // Create card title
                const cardTitle = document.createElement("h5");
                {
                  cardTitle.classList.add("card-title");
                  cardTitle.textContent = item.food_name;

                  // If the food is unavailable/out of stock, add a "Tạm hết" badge
                  if (!item.food_status) {
                    // Create card badge
                    const outOfStockBadge = document.createElement("span");
                    outOfStockBadge.classList.add(
                      "badge",
                      "bg-danger",
                      "text-white",
                      "ms-2",
                      "px-2",
                      "py-2",
                      "fs-0"
                    );
                    outOfStockBadge.textContent = "Tạm hết";
                    cardTitle.append(outOfStockBadge);
                  }

                  cardBody.appendChild(cardTitle);
                }

                // Create container for rating and price
                const ratingPriceContainer = document.createElement("div");
                {
                  ratingPriceContainer.classList.add(
                    "d-flex",
                    "flex-row",
                    "flex-wrap",
                    "justify-content-between",
                    "align-items-center"
                  );

                  // Create container for price
                  const priceContainer = document.createElement("p");
                  {
                    priceContainer.classList.add("card-text", "mb-0");

                    // Create price span
                    const priceText = document.createElement("span");
                    priceText.classList.add(
                      "fs-1",
                      "text-secondary",
                      "fw-bold"
                    );

                    const price =
                      item.discount_percent > 0
                        ? item.food_price -
                          (item.food_price * item.discount_percent) / 100
                        : item.food_price;
                    // Calculate the discounted price
                    priceText.textContent = `${price.toLocaleString(pageLocale)} đ`;
                    priceContainer.appendChild(priceText);
                    ratingPriceContainer.appendChild(priceContainer);

                    // If the food has a discount
                    if (item.discount_percent > 0) {
                      // Create card text for the original price, based on the given HTML markup
                      const originalPriceText = document.createElement("span");
                      originalPriceText.classList.add("ms-2", "text-600");
                      originalPriceText.innerHTML = `<s>${(item.food_price).toLocaleString(pageLocale)} đ</s>`;
                      priceContainer.append(originalPriceText);

                      // Create card badge for the discount
                      const discountBadge = document.createElement("span");
                      discountBadge.classList.add(
                        "badge",
                        "bg-success",
                        "text-white",
                        "ms-2",
                        "px-2",
                        "py-2",
                        "fs-0"
                      );
                      discountBadge.textContent = `Giảm ${item.discount_percent}%`;
                      priceContainer.append(discountBadge);
                    }
                  }

                  // Create card text for the rating
                  const ratingText = document.createElement("div");
                  {
                    ratingText.classList.add("card-text", "text-primary");
                    for (let index = 0; index < 5; index++) {
                      if (index < item.food_rate) {
                        ratingText.innerHTML +=
                          '<i class="ph-fill ph-star"></i>';
                      } else {
                        ratingText.innerHTML +=
                          '<i class="ph-bold ph-star"></i>';
                      }
                    }
                    ratingPriceContainer.appendChild(ratingText);
                  }

                  cardBody.appendChild(ratingPriceContainer);
                }

                bodyCol.appendChild(cardBody);
              }

              row.appendChild(bodyCol);
            }

            // Add á stretched link to the card
            // Find the corresponding stretched link
            const foodID = item.food_id;
            const stretchedLink = document.querySelector(
              ".stretched-link[data-food-id='" + foodID + "']"
            );

            if (stretchedLink) {
              // Duplicate the stretched link
              const duplicatedLink = stretchedLink.cloneNode(true);
              // Add the new link to the card
              card.appendChild(duplicatedLink);
            } else {
              console.log("No .stretched-link element found.");
            }

            searchResultsList.appendChild(card);

            // Create a column for the image
            // This column's height should be equal to the card body's height
            // To do that, we have to create the card body first, then calculate the img height
            // based on the card body height, which can only be done after the card body is added
            // and rendered
            const imageCol = document.createElement("div");
            {
              imageCol.classList.add("col-sm-2");
              imageCol.classList.add("d-flex");
              imageCol.classList.add("justify-content-center");
              imageCol.classList.add("align-items-center");

              // Create an image for the card
              const img = document.createElement("img");
              {
                img.src = item.food_url;
                img.alt = item.food_name;
                img.classList.add(
                  "d-none",
                  "d-sm-block",
                  "img-fluid",
                  "w-100",
                  "rounded-start",
                  "object-fit-cover",
                  "food-thumbnail"
                );
                img.style.objectPosition = "center";
                // Calculate the image height based on the card body height
                const contentHeight = bodyCol.offsetHeight > 0 ? `${bodyCol.offsetHeight}px` : "5.7rem";
                img.style.height = contentHeight;
                imageCol.appendChild(img);
              }

              row.prepend(imageCol);
            }
          });
          searchResultsList.classList.remove("d-none");
          searchResultsList.classList.add("d-flex");
        } else {
          searchResultsList.innerHTML = "Không tìm thấy món";
        }
      })
      .catch((error) => console.error(error));
  }, 300);
}


