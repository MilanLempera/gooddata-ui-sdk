// (C) 2007-2019 GoodData Corporation

import { ReferenceLdm, ReferenceLdmExt } from "@gooddata/reference-workspace";
import { measureLocalId } from "@gooddata/sdk-model";
import { ColumnChart, IColumnChartProps } from "@gooddata/sdk-ui";
import { scenariosFor } from "../../../src";
import { axisNameCustomization } from "../_infra/axisNameCustomization";
import {
    ColumnChartWithArithmeticMeasuresAndViewBy,
    ColumnChartWithTwoMeasuresAndTwoViewBy,
    ColumnChartWithTwoMeasuresAndViewBy,
} from "./base";

const singleAxisNameConfig = scenariosFor<IColumnChartProps>("ColumnChart", ColumnChart)
    .withVisualTestConfig({
        groupUnder: "single axis name customization",
        screenshotSize: { width: 800, height: 600 },
    })
    .withDefaultTags("vis-config-only", "mock-no-scenario-meta")
    .addScenarios("single axis", ColumnChartWithTwoMeasuresAndViewBy, axisNameCustomization);

const dualAxisNameConfig = scenariosFor<IColumnChartProps>("ColumnChart", ColumnChart)
    .withVisualTestConfig({
        groupUnder: "dual axis name customization",
        screenshotSize: { width: 800, height: 600 },
    })
    .withDefaultTags("vis-config-only", "mock-no-scenario-meta")
    .addScenarios(
        "",
        {
            ...ColumnChartWithArithmeticMeasuresAndViewBy,
            config: {
                secondary_yaxis: {
                    measures: [measureLocalId(ReferenceLdmExt.CalculatedWonLostRatio)],
                },
            },
        },
        axisNameCustomization,
    );

const axisConfig = scenariosFor<IColumnChartProps>("ColumnChart", ColumnChart)
    .withVisualTestConfig({ screenshotSize: { width: 800, height: 600 } })
    .withDefaultTags("vis-config-only", "mock-no-scenario-meta")
    .addScenario("Y axis min/max configuration", {
        ...ColumnChartWithTwoMeasuresAndViewBy,
        config: {
            yaxis: {
                min: "5000000",
                max: "25000000",
            },
        },
    })
    .addScenario("Y axis on right", {
        ...ColumnChartWithTwoMeasuresAndViewBy,
        config: {
            secondary_yaxis: {
                measures: [measureLocalId(ReferenceLdm.Amount), measureLocalId(ReferenceLdm.Won)],
            },
        },
    })
    .addScenario("dual axis with one right measure and three left", {
        ...ColumnChartWithArithmeticMeasuresAndViewBy,
        config: {
            secondary_yaxis: {
                measures: [measureLocalId(ReferenceLdmExt.CalculatedWonLostRatio)],
            },
        },
    })
    .addScenario("dual axis when two viewBy attributes", {
        ...ColumnChartWithTwoMeasuresAndTwoViewBy,
        config: {
            secondary_yaxis: {
                measures: [measureLocalId(ReferenceLdm.Won)],
            },
        },
    })
    .addScenario("X axis rotation", {
        ...ColumnChartWithTwoMeasuresAndTwoViewBy,
        config: {
            xaxis: {
                rotation: "45",
            },
        },
    })
    .addScenario("X axis invisible", {
        ...ColumnChartWithTwoMeasuresAndTwoViewBy,
        config: {
            xaxis: {
                visible: false,
            },
        },
    })
    .addScenario("Y axis on right with two viewBy attributes", {
        ...ColumnChartWithTwoMeasuresAndTwoViewBy,
        config: {
            secondary_yaxis: {
                measures: [measureLocalId(ReferenceLdm.Amount), measureLocalId(ReferenceLdm.Won)],
            },
        },
    });

export default [axisConfig, singleAxisNameConfig, dualAxisNameConfig];
