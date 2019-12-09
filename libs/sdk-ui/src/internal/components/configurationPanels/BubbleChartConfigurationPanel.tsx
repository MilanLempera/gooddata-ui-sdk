// (C) 2019 GoodData Corporation
import * as React from "react";
import get = require("lodash/get");
import { FormattedMessage } from "react-intl";
import Bubble from "@gooddata/goodstrap/lib/Bubble/Bubble";
import BubbleHoverTrigger from "@gooddata/goodstrap/lib/Bubble/BubbleHoverTrigger";
import * as classNames from "classnames";
import NameSubsection from "../configurationControls/axis/NameSubsection";
import { countItemsOnAxes } from "../pluggableVisualizations/baseChart/insightIntrospection";

import ConfigurationPanelContent from "./ConfigurationPanelContent";
import LabelSubsection from "../configurationControls/axis/LabelSubsection";
import ConfigSection from "../configurationControls/ConfigSection";
import DataLabelsControl from "../configurationControls/DataLabelsControl";
import CheckboxControl from "../configurationControls/CheckboxControl";
import MinMaxControl from "../configurationControls//MinMaxControl";
import {
    SHOW_DELAY_DEFAULT,
    HIDE_DELAY_DEFAULT,
    BUBBLE_ARROW_OFFSET_X,
    BUBBLE_ARROW_OFFSET_Y,
} from "../../constants/bubble";
import { bucketsIsEmpty, IInsight, insightBuckets } from "@gooddata/sdk-model";
import * as BucketNames from "../../../base/constants/bucketNames";

export default class BubbleChartConfigurationPanel extends ConfigurationPanelContent {
    protected renderConfigurationPanel() {
        const { xAxisVisible, yAxisVisible, gridEnabled } = this.getControlProperties();

        const { propertiesMeta, properties, pushData, type, insight } = this.props;
        const controls = properties && properties.controls;
        const controlsDisabled = this.isControlDisabled();
        const { xaxis: itemsOnXAxis, yaxis: itemsOnYAxis } = countItemsOnAxes(type, controls, insight);
        const xAxisNameSectionDisabled = controlsDisabled || itemsOnXAxis !== 1;
        const yAxisNameSectionDisabled = controlsDisabled || itemsOnYAxis !== 1;

        return (
            <BubbleHoverTrigger showDelay={SHOW_DELAY_DEFAULT} hideDelay={HIDE_DELAY_DEFAULT}>
                <div>
                    {this.renderColorSection()}
                    <ConfigSection
                        id="xaxis_section"
                        title="properties.xaxis.title"
                        valuePath="xaxis.visible"
                        canBeToggled={true}
                        toggledOn={xAxisVisible}
                        toggleDisabled={controlsDisabled}
                        propertiesMeta={propertiesMeta}
                        properties={properties}
                        pushData={pushData}
                    >
                        <NameSubsection
                            disabled={xAxisNameSectionDisabled}
                            configPanelDisabled={controlsDisabled}
                            axis={"xaxis"}
                            properties={properties}
                            pushData={pushData}
                        />

                        <LabelSubsection
                            disabled={controlsDisabled}
                            configPanelDisabled={controlsDisabled}
                            axis={"xaxis"}
                            properties={properties}
                            pushData={pushData}
                        />
                        {this.renderMinMax("xaxis")}
                    </ConfigSection>
                    <ConfigSection
                        id="yaxis_section"
                        title="properties.yaxis.title"
                        valuePath="yaxis.visible"
                        canBeToggled={true}
                        toggledOn={yAxisVisible}
                        toggleDisabled={controlsDisabled}
                        propertiesMeta={propertiesMeta}
                        properties={properties}
                        pushData={pushData}
                    >
                        <NameSubsection
                            disabled={yAxisNameSectionDisabled}
                            configPanelDisabled={controlsDisabled}
                            axis={"yaxis"}
                            properties={properties}
                            pushData={pushData}
                        />

                        <LabelSubsection
                            disabled={controlsDisabled}
                            configPanelDisabled={controlsDisabled}
                            axis={"yaxis"}
                            properties={properties}
                            pushData={pushData}
                        />
                        {this.renderMinMax("yaxis")}
                    </ConfigSection>
                    {this.renderLegendSection()}
                    <ConfigSection
                        id="canvas_section"
                        title="properties.canvas.title"
                        propertiesMeta={propertiesMeta}
                        properties={properties}
                        pushData={pushData}
                    >
                        <DataLabelsControl
                            pushData={pushData}
                            properties={properties}
                            isDisabled={this.areDataLabelsDisabled()}
                            defaultValue={false}
                            showDisabledMessage={this.isDataLabelsWarningShown()}
                        />
                        <CheckboxControl
                            valuePath="grid.enabled"
                            labelText="properties.canvas.gridline"
                            properties={properties}
                            checked={gridEnabled}
                            disabled={controlsDisabled}
                            pushData={pushData}
                        />
                    </ConfigSection>
                </div>
                <Bubble
                    className={this.getBubbleClassNames()}
                    arrowOffsets={{ "tc bc": [BUBBLE_ARROW_OFFSET_X, BUBBLE_ARROW_OFFSET_Y] }}
                    alignPoints={[{ align: "tc bc" }]}
                >
                    <FormattedMessage id="properties.config.not_applicable" />
                </Bubble>
            </BubbleHoverTrigger>
        );
    }

    private renderMinMax(basePath: string) {
        const { pushData, properties, propertiesMeta } = this.props;
        return (
            <MinMaxControl
                isDisabled={this.isControlDisabled()}
                basePath={basePath}
                pushData={pushData}
                properties={properties}
                propertiesMeta={propertiesMeta}
            />
        );
    }

    private areDataLabelsDisabled() {
        const isDisabled = super.isControlDisabled();
        return isDisabled || !hasTertiaryMeasures(this.props.insight);
    }

    private isDataLabelsWarningShown() {
        const isDisabled = super.isControlDisabled();
        return !isDisabled && !hasTertiaryMeasures(this.props.insight);
    }

    private getBubbleClassNames() {
        return classNames("bubble-primary", {
            invisible: !this.isControlDisabled(),
        });
    }

    private getControlProperties() {
        const xAxisVisible = get(this.props, "properties.controls.xaxis.visible", true);
        const yAxisVisible = get(this.props, "properties.controls.yaxis.visible", true);
        const gridEnabled = get(this.props, "properties.controls.grid.enabled", true);

        return {
            xAxisVisible,
            gridEnabled,
            yAxisVisible,
        };
    }
}

function hasTertiaryMeasures(insight: IInsight): boolean {
    return !bucketsIsEmpty(insightBuckets(insight, BucketNames.TERTIARY_MEASURES));
}
