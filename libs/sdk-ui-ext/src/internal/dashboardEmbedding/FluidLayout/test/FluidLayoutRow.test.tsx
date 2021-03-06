// (C) 2019-2020 GoodData Corporation
import React from "react";
import { shallow } from "enzyme";
import { FluidLayoutFacade } from "@gooddata/sdk-backend-spi";
import { Row } from "react-grid-system";
import { FluidLayoutRow } from "../FluidLayoutRow";
import { FluidLayoutColumn } from "../FluidLayoutColumn";
import {
    createArrayWithSize,
    fluidLayoutWithOneColumn,
    TextLayoutRowRenderer,
    createFluidLayoutMock,
} from "./fixtures";

const customRowRendererClass = "s-row-renderer";
const customRowRenderer: TextLayoutRowRenderer = ({ children }) => (
    <div className={customRowRendererClass}>{children}</div>
);

const layoutFacade = FluidLayoutFacade.for(fluidLayoutWithOneColumn);

describe("FluidLayoutRow", () => {
    it.each(createArrayWithSize(5).map((_, i) => i))("should render %s columns", (size: number) => {
        const layoutFacade = FluidLayoutFacade.for(createFluidLayoutMock([size]));
        const wrapper = shallow(<FluidLayoutRow row={layoutFacade.rows().row(0)} screen="xl" />);
        expect(wrapper.find(FluidLayoutColumn)).toHaveLength(size);
    });

    it("should use default row renderer, when rowRenderer prop is not provided", () => {
        const wrapper = shallow(<FluidLayoutRow row={layoutFacade.rows().row(0)} screen="xl" />);
        expect(wrapper.find(Row)).toExist();
    });

    it("should use provided row renderer, when rowRenderer prop is provided", () => {
        const wrapper = shallow(
            <FluidLayoutRow row={layoutFacade.rows().row(0)} screen="xl" rowRenderer={customRowRenderer} />,
        );

        expect(wrapper.find(`.${customRowRendererClass}`)).toExist();
    });
});
