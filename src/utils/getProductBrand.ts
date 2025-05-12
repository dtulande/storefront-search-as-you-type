import { Product } from "../types/interface";

const getProductBrand = (
    product: Product,
): string => {
    return product.productView.attributes.find(attr => attr.name === 'ulta_marca')?.value || '';
};

export { getProductBrand };
