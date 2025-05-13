/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const searchUnitId = "livesearch-popover";

// Customers will be using these for their custom styling
// do *not* change arbitrarily as it may break their storefronts
const stylingIds = {
    popoverWrapper: "livesearch popover-wrapper",
    popover: "livesearch popover-container",
    product: "livesearch product-result",
    products: "livesearch products-container",
    productName: "livesearch product-name",
    productPrice: "livesearch product-price",
    productBrand: "livesearch brand",
    productImageWrapper: "livesearch product-image-wrapper",
    productNameWrapper: "livesearch product-name-wrapper",
    suggestion: "livesearch suggestion",
    suggestions: "livesearch suggestions-container",
    suggestionsHeader: "livesearch suggestions-header",
    suggestionLinkContainer: "livesearch suggestions-link-container",
    suggestionLinkStrong: "livesearch suggestions-link-strong",
    suggestionLinkInfo: "livesearch suggestions-link-info",
    viewAll: "livesearch view-all",
    viewAllWrapper: "livesearch view-all-wrapper",
    closeButton: "livesearch close-button",
    closeIconContainer: "livesearch close-icon-container",
    searchedTextLabel: "livesearch searched-text",
};
// ---

const activeClass = "active";

export { activeClass, searchUnitId, stylingIds };
