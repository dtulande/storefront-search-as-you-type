/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { FC } from "react";
import {
    getProductImageURL,
    getProductPrice,
    htmlStringDecode,
    isMobile,
    searchUnitId,
    stylingIds,
    getProductBrand
} from "utils";

import { Grid, ProductImage, StyledLink, StyledText, Flex } from "../../styles";
import NoImageSvg from "../assets/NoImage.svg";
import {
    Product,
    ProductSearchResponse,
    RedirectRouteFunc,
} from "../types/interface";

/**
 * This component renders a styled popover populated with results from search
 */
interface PopoverProps {
    active?: boolean;
    response?: ProductSearchResponse;
    formRef: React.MutableRefObject<HTMLFormElement | null>;
    resultsRef: React.MutableRefObject<HTMLDivElement | null>;
    inputRef: React.MutableRefObject<HTMLInputElement | null>;
    pageSize?: number;
    currencySymbol?: string;
    currencyRate?: string;
    minQueryLengthHit?: boolean;
    route?: RedirectRouteFunc;
}

const text = {
    suggestions: "Sugerencias",
    aria: "Search term suggestions",
    all: "Ver todo",
};

const Popover: FC<PopoverProps> = ({
    active,
    response,
    formRef,
    inputRef,
    resultsRef,
    pageSize = 4,
    currencySymbol = "",
    currencyRate = "1",
    minQueryLengthHit,
    route,
}) => {
    const products = response?.data?.productSearch.items ?? [];
    const suggestions = response?.data?.productSearch.suggestions ?? [];

    const containerStyling = `
            --search-popover-right-space: 100px;
            border: 1px solid #d4d4d4;
        `;

    // containerStyling is only for desktop display
    if (resultsRef.current && (active || !isMobile)) {
        resultsRef.current.style.cssText = containerStyling;
    }

    const updateAndSubmit = (phrase?: string) => {
        // on 'View all' click
        const target = inputRef.current;
        const form = formRef.current;

        if (phrase && target) {
            target.value = phrase;
        }

        form?.dispatchEvent(new Event("submit"));
        // setTimeout(0) moves the submit action to the bottom of the event loop
        // ensuring that the tracking event will execute first.
        setTimeout(() => form?.submit(), 0);
    };

    const onSuggestionClick = (suggestion: string): void => {
        window.magentoStorefrontEvents?.publish.searchSuggestionClick(
            searchUnitId,
            suggestion,
        );

        updateAndSubmit(suggestion);
    };

    // the suggestions element is currently not used
    const Suggestions = suggestions.map((suggestion, index) => {
        if (index <= 4) {
            return (
                <StyledText
                    className={stylingIds.suggestion}
                    customFontSize="1.4rem"
                    customLineHeight="2rem"
                    key={suggestion}
                    onClick={() => onSuggestionClick(suggestion)}
                    hoverPointer="pointer"
                    padding="0"
                >
                    {htmlStringDecode(suggestion)}
                </StyledText>
            );
        }
    });

    const calculateWidth = () => {
        if (isMobile) {
            return "100%";
        } else {
            return suggestions.length > 0 ? "min(100vw - var(--search-popover-right-space), 1188px)" : "784px";
        }
    };

    const getHeaderHeight = () => {
        // if we are unable to find a header height, 150 is the average used height
        return resultsRef.current?.getBoundingClientRect().top ?? 150;
    };

    const calculatePopoverHeight = () => {
        return isMobile ? `calc(100vh - ${getHeaderHeight()}px)` : "auto";
    };

    if (products.length <= 0 || !active || !minQueryLengthHit) {
        return <></>;
    }

    return (
        <Flex
            className={stylingIds.popover}
            width={calculateWidth()}
            height={calculatePopoverHeight()}
            backgroundColor="#fff"
            flexDirection={isMobile ? "column" : "row"}
            boxSizing="border-box"
        >
            {/* the suggestions element is currently not used */}
            {suggestions.length > 0 && (
                <Grid
                    className={stylingIds.suggestions}
                    width={isMobile ? "auto" : "min(28vw, 404px)"}
                    gridTemplateRows={
                        isMobile
                            ? `repeat(${suggestions.length + 1}, 3.5rem)` // +1 to account for "suggestions" row
                            : `repeat(${pageSize}, 1fr) minmax(0px, 38px);`
                    }
                    rowGap={"16px"}
                    padding={
                        isMobile ? "16px 32px 0px 32px" : "48px"
                    }
                    margin={isMobile ? "auto 0px" : "unset"}
                    textAlign={isMobile ? "center" : "unset"}
                    boxSizing="border-box"
                    backgroundColor="#f6f6f6"
                >
                    <StyledText
                        customFontWeight={400}
                        className={stylingIds.suggestionsHeader}
                    >
                        {text.suggestions}
                    </StyledText>
                    {Suggestions}
                </Grid>
            )}

            <Flex 
                className={stylingIds.viewAllWrapper}
                gridArea={"heading-previews"}
                flexDirection="column"
                maxWidth={isMobile ? "100%" : "784px"}
            >
                <Flex className="close-button"></Flex>
                <Flex
                    className={stylingIds.viewAllWrapper}
                    justifyContent="space-between"
                >
                    <Flex
                        className="search-text"
                    >
                        Los mejores resultados para “Estee Lau”
                    </Flex>
                    <Grid
                        className={stylingIds.viewAll}
                        gridArea="viewall"
                        alignContent="center"
                        textAlign="center"
                        onClick={() => updateAndSubmit()}
                        hoverFontWeight={600}
                        hoverPointer="pointer"
                    >
                        {text.all}
                    </Grid>
                </Flex>

                <Grid
                    className={stylingIds.products}
                    gridTemplateColumns={"1fr 1fr"}
                    gridTemplateRows={
                        isMobile
                            ? `repeat(${Math.ceil(products.length / 2)}, 1fr)`
                            : "repeat(3, 1fr)"
                    }
                    gap="4px"
                    padding={isMobile ? "0px 16px" : "16px"}
                    paddingBottom="0px"
                    alignSelf="start"
                    overflowY={isMobile ? "scroll" : "auto"}
                    overflowX="hidden"
                >
                    {products.map((product, index) => {
                        //render
                        if (index < pageSize) {
                            return (
                                <ProductItem
                                    key={product.product.sku}
                                    product={product}
                                    updateAndSubmit={updateAndSubmit}
                                    currencySymbol={currencySymbol}
                                    currencyRate={currencyRate}
                                    route={route}
                                />
                            );
                        }
                    })}
                </Grid>
            </Flex>
        </Flex>
    );
};

const ProductItem: FC<{
    product: Product;
    updateAndSubmit: (queryPhrase?: string) => void;
    currencySymbol: string;
    currencyRate: string;
    route?: RedirectRouteFunc;
}> = ({ product, updateAndSubmit, currencySymbol, currencyRate, route }) => {
    const onProductClick = () => {
        window.magentoStorefrontEvents?.publish.searchProductClick(
            searchUnitId,
            product.product.sku,
        );

        if (!route && !product.product.canonical_url) {
            // If there's no URL on the product, populate the search bar with name and submit
            updateAndSubmit(product.product.name);
        }
    };

    const productImage = getProductImageURL(product);
    const productUrl = route
        ? route({ sku: product.product.sku })
        : product.product.canonical_url;

    return (
        <StyledLink href={productUrl || ""} rel="noopener noreferrer">
            <Grid
                className={stylingIds.product}
                gridTemplateAreas={
                    isMobile
                        ? '"image" "productName" "price"'
                        : '"image productName" "image price"'
                }
                gridTemplateColumns={isMobile ? "1fr" : "1fr 4fr"}
                gridTemplateRows={
                    isMobile ? "1fr 3.5rem 3.5rem" : "repeat(2, 1fr)"
                }
                columnGap="16px"
                alignSelf="center"
                height={isMobile ? "auto" : "80px"}
                minWidth={isMobile ? "auto" : "192px"}
                hoverColor="#f5f5f5"
                hoverPointer="pointer"
                padding={isMobile ? "16px" : "unset"}
                boxSizing={isMobile ? "border-box" : "inherit"}
                onClick={onProductClick}
            >
                <ProductImage
                    gridArea="image"
                    customWidth="100%"
                    src={productImage || NoImageSvg}
                />
                <Grid
                    gridArea="productName"
                    alignSelf={isMobile ? "center" : "end"}
                >
                    <StyledText
                        customFontWeight={600}
                        className={stylingIds.productName}
                    >
                        {htmlStringDecode(product.product.name)}
                    </StyledText>
                </Grid>
                <Grid gridArea="price" className={stylingIds.productPrice}>
                    {getProductPrice(product, currencySymbol, currencyRate)}
                </Grid>
                <Grid gridArea="brand" className={stylingIds.productBrand}>
                    {getProductBrand(product)}
                </Grid>
            </Grid>
        </StyledLink>
    );
};
export default Popover;
