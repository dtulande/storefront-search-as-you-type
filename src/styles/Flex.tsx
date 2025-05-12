import styled, { CSSObject, CSSProperties } from "styled-components";

interface FlexProps extends CSSProperties {
    children?: unknown;
    hoverColor?: CSSProperties["backgroundColor"];
    hoverFontWeight?: CSSProperties["fontWeight"];
    hoverPointer?: CSSProperties["cursor"];
}

const Flex = styled.div`
    ${(props: FlexProps) => {
        delete props.children;

        return props as CSSObject;
    }}

    display: flex;
    &:hover {
        background-color: ${(props: FlexProps) => props.hoverColor};
        cursor: ${(props: FlexProps) => props.hoverPointer};
        font-weight: ${(props: FlexProps) => props.hoverFontWeight};
    }
`;

export { Flex };
