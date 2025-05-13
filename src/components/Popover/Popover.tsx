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
    searched: 'Los mejores resultados para “{text}”',
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

    // containerStyling is only for desktop display
    if (resultsRef.current && (active || !isMobile)) {
        const rect = resultsRef.current.getBoundingClientRect();
        const rightSpace = window.innerWidth - rect.right;

        const containerStyling = `
            --search-popover-right-space: ${rightSpace}px;
        `;

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
                <Flex
                    className={stylingIds.suggestionLinkContainer}
                    alignItems="center"
                    columnGap={"8px"}
                    key={suggestion}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12.612" height="12.612" viewBox="0 0 12.612 12.612">
                        <g id="Search--Streamline-Streamline--3.0" transform="translate(-0.024 -0.024)">
                            <path id="Trazado_53689" data-name="Trazado 53689" d="M.767,6.957A4.72,4.72,0,1,0,3.265.766a4.72,4.72,0,0,0-2.5,6.191" transform="translate(0)" fill="none" stroke="#6e6e6e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.7"/>
                            <path id="Trazado_53690" data-name="Trazado 53690" d="M8.448,8.448l4,4" transform="translate(-0.06 -0.06)" fill="none" stroke="#6e6e6e" strokeLinejoin="round" strokeWidth="0.7"/>
                        </g>
                    </svg>
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
                </Flex>
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
                            ? `repeat(${suggestions.length + 1}, 3.8rem)` // +1 to account for "suggestions" row
                            : `repeat(${pageSize}, 1fr) minmax(0px, 38px);`
                    }
                    rowGap={"16px"}
                    padding={
                        isMobile ? "24px 16px" : "48px"
                    }
                    boxSizing="border-box"
                    backgroundColor="#f6f6f6"
                    flexGrow={1}
                >
                    <StyledText
                        className={stylingIds.suggestionsHeader}
                    >
                        {text.suggestions}
                    </StyledText>
                    {Suggestions}
                </Grid>
            )}

            <Flex 
                className={stylingIds.viewAllWrapper}
                flexDirection="column"
                maxWidth={isMobile ? "100%" : "784px"}
                padding={isMobile ? "10px" : "48px 48px 44px"}
                flexGrow={1}
            >
                <Flex 
                className={stylingIds.closeButton}
                alignSelf="flex-end"
                width={isMobile ? "0" : "100%"}
                height={isMobile ? "0" : "auto"}
                position="relative"
                visibility={isMobile ? "hidden" : "visible"}
                >
                    <Flex
                        className={stylingIds.closeIconContainer}
                        width={"23px"}
                        height={"23px"}
                        position={"absolute"}
                        top={"-30px"}
                        right={"-30px"}
                        cursor="pointer"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" version="1.1" viewBox="0 0 847 1058.75">
                            <g><polygon className="fil0" points="54,88 390,423 54,759 88,792 423,457 759,792 792,759 457,423 792,88 759,54 423,390 88,54 "/></g>
                        </svg>
                    </Flex>
                </Flex>
                <Flex
                    className={stylingIds.viewAllWrapper}
                    justifyContent="space-between"
                >
                    <Flex
                        className={stylingIds.searchedTextLabel}
                    >
                        {text.searched.replace(
                                '{text}',
                                `${inputRef.current?.value}`
                            )
                        }
                    </Flex>
                    <Grid
                        className={stylingIds.viewAll}
                        alignContent="center"
                        textAlign="center"
                        onClick={() => updateAndSubmit()}
                        hoverPointer="pointer"
                    >
                        {text.all}
                    </Grid>
                </Flex>

                <Grid
                    className={stylingIds.products}
                    gridTemplateColumns={
                        isMobile
                            ? `repeat(${Math.ceil(products.length / 2)}, 1fr)`
                            : "repeat(4, 1fr)"
                    }
                    gap="8px"
                    flexGrow={"1"}
                    alignSelf="start"
                    overflowY={isMobile ? "scroll" : "auto"}
                    overflowX="hidden"
                    marginTop={"16px"}
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
            <Flex
                className={stylingIds.product}
                maxWidth={"166px"}
                hoverPointer="pointer"
                onClick={onProductClick}
                flexDirection="column"
            >
                <div className={stylingIds.productImageWrapper}>
                    <ProductImage width={112} height={112}
                        customWidth="100%"
                        src={productImage || NoImageSvg}
                    />
                </div>
                <Grid 
                    className={stylingIds.productBrand}
                    margin={"8px 0 2px"}
                    >
                    {getProductBrand(product)}
                </Grid>
                <Grid
                    className={stylingIds.productNameWrapper}
                >
                    <StyledText
                        className={stylingIds.productName}
                    >
                        {htmlStringDecode(product.product.name)}
                    </StyledText>
                </Grid>
            </Flex>
        </StyledLink>
    );
};
export default Popover;
