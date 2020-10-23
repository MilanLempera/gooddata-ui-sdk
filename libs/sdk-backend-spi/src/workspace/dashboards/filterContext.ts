// (C) 2019-2020 GoodData Corporation
import { ObjRef, isObjRef } from "@gooddata/sdk-model";
import isEmpty from "lodash/isEmpty";
import { IDashboardObjectIdentity } from "./common";
import { DateFilterGranularity, DateString } from "../dateFilterConfigs/types";

/**
 * Date filter type - relative
 * @alpha
 */
export type RelativeType = "relative";

/**
 * Date filter type - absolute
 * @alpha
 */
export type AbsoluteType = "absolute";

/**
 * Date filter type - relative or absolute
 * @alpha
 */
export type DateFilterType = RelativeType | AbsoluteType;

/**
 * Parent filter of an attribute filter of the filter context
 * @alpha
 */
export interface IDashboardAttributeFilterParent {
    /**
     * Local identifier of the parent filter
     */
    filterLocalIdentifier: string;
    /**
     * Specification of the connection point(s) between the parent and child filter in the data model
     */
    over: {
        attributes: ObjRef[];
    };
}

/**
 * Attribute filter of the filter context
 * @alpha
 */
export interface IDashboardAttributeFilter {
    attributeFilter: {
        /**
         * Display form object ref
         */
        displayForm: ObjRef;

        /**
         * Is negative filter?
         */
        negativeSelection: boolean;

        /**
         * Selected attribute elements object refs
         */
        attributeElements: ObjRef[];

        /**
         * Identifier of the filter which is valid in the scope of the filter context
         */
        localIdentifier?: string;

        /**
         * Parent filters that are limiting elements available in this filter
         */
        filterElementsBy?: IDashboardAttributeFilterParent[];
    };
}

/**
 * Type-guard testing whether the provided object is an instance of {@link IDashboardAttributeFilter}.
 * @alpha
 */
export function isDashboardAttributeFilter(obj: unknown): obj is IDashboardAttributeFilter {
    return !isEmpty(obj) && !!(obj as IDashboardAttributeFilter).attributeFilter;
}

/**
 * Date filter of the filter context
 * @alpha
 */
export interface IDashboardDateFilter {
    dateFilter: {
        /**
         * Date filter type - relative or absolute
         */
        type: DateFilterType;

        /**
         * Date filter granularity
         */
        granularity: DateFilterGranularity;

        /**
         * Filter - from
         */
        from?: DateString | number;

        /**
         * Filter - to
         */
        to?: DateString | number;

        /**
         * DateDataSet object ref
         */
        dataSet?: ObjRef;

        /**
         * Date attribute object ref
         */
        attribute?: ObjRef;
    };
}

/**
 * Type-guard testing whether the provided object is an instance of {@link IDashboardDateFilter}.
 * @alpha
 */
export function isDashboardDateFilter(obj: unknown): obj is IDashboardDateFilter {
    return !isEmpty(obj) && !!(obj as IDashboardDateFilter).dateFilter;
}

/**
 * Supported filter context items
 * @alpha
 */
export type FilterContextItem = IDashboardAttributeFilter | IDashboardDateFilter;

/**
 * Common filter context properties
 *
 * @alpha
 */
export interface IFilterContextBase {
    /**
     * Filter context title
     */
    readonly title: string;

    /**
     * Filter context description
     */
    readonly description: string;

    /**
     * Attribute or date filters
     */
    readonly filters: FilterContextItem[];
}

/**
 * Filter context definition represents modifier or created filter context
 *
 * @alpha
 */
export interface IFilterContextDefinition extends IFilterContextBase, Partial<IDashboardObjectIdentity> {}

/**
 * Type-guard testing whether the provided object is an instance of {@link IFilterContextDefinition}.
 * @alpha
 */
export function isFilterContextDefinition(obj: unknown): obj is IFilterContextDefinition {
    // Currently, we have no better way to distinguish between IFilterContext and ITempFilterContext
    return hasFilterContextBaseProps(obj) && !isObjRef((obj as any).ref);
}

/**
 * Filter context consists of configured attribute and date filters
 * (which could be applied to the dashboard, widget alert, or scheduled email)
 *
 * @alpha
 */
export interface IFilterContext extends IFilterContextBase, IDashboardObjectIdentity {}

/**
 * Type-guard testing whether the provided object is an instance of {@link IFilterContext}.
 * @alpha
 */
export function isFilterContext(obj: unknown): obj is IFilterContext {
    // Currently, we have no better way to distinguish between IFilterContext and ITempFilterContext
    return hasFilterContextBaseProps(obj) && isObjRef((obj as any).ref);
}

/**
 * Temporary filter context serves to override original dashboard filter context during the dashboard export
 *
 * @alpha
 */
export interface ITempFilterContext {
    /**
     * Filter context created time
     * YYYY-MM-DD HH:mm:ss
     */
    readonly created: string;

    /**
     * Attribute or date filters
     */
    readonly filters: FilterContextItem[];

    /**
     * Temp filter context ref
     */
    readonly ref: ObjRef;

    /**
     * Temp filter context uri
     */
    readonly uri: string;
}

/**
 * Type-guard testing whether the provided object is an instance of {@link ITempFilterContext}.
 * @alpha
 */
export function isTempFilterContext(obj: unknown): obj is ITempFilterContext {
    // Currently, we have no better way to distinguish between IFilterContext and ITempFilterContext
    return (
        hasFilterContextBaseProps(obj) &&
        isObjRef((obj as any).ref) &&
        !(obj as IFilterContext).identifier &&
        !(obj as IFilterContext).title
    );
}

/**
 * Reference to a particular dashboard date filter
 * This is commonly used to define filters to ignore
 * for the particular dashboard widget
 *
 * @alpha
 */
export interface IDashboardDateFilterReference {
    /**
     * Dashboard filter reference type
     */
    type: "dateFilterReference";

    /**
     * DataSet reference of the target date filter
     */
    dataSet: ObjRef;
}

/**
 * Type-guard testing whether the provided object is an instance of {@link IDashboardDateFilterReference}.
 * @alpha
 */
export function isDashboardDateFilterReference(obj: unknown): obj is IDashboardDateFilterReference {
    return !isEmpty(obj) && (obj as IDashboardDateFilterReference).type === "dateFilterReference";
}

/**
 * Reference to a particular dashboard attribute filter
 * This is commonly used to define filters to ignore
 * for the particular dashboard widget
 *
 * @alpha
 */
export interface IDashboardAttributeFilterReference {
    /**
     * Dashboard filter reference type
     */
    type: "attributeFilterReference";

    /**
     * Attribute display form reference of the target attribute filter
     */
    displayForm: ObjRef;
}

/**
 * Type-guard testing whether the provided object is an instance of {@link IDashboardAttributeFilterReference}.
 * @alpha
 */
export function isDashboardAttributeFilterReference(obj: unknown): obj is IDashboardAttributeFilterReference {
    return !isEmpty(obj) && (obj as IDashboardAttributeFilterReference).type === "attributeFilterReference";
}

/**
 * Reference to a particular dashboard filter
 * This is commonly used to define filters to ignore
 * for the particular dashboard widget
 *
 * @alpha
 */
export type IDashboardFilterReference = IDashboardDateFilterReference | IDashboardAttributeFilterReference;

/**
 * Gets reference to object being used for filtering. For attribute filters, this will be reference to the display
 * form. For date filters this will be reference to the data set.
 *
 * @alpha
 */
export function dashboardFilterReferenceObjRef(ref: IDashboardFilterReference): ObjRef {
    return isDashboardAttributeFilterReference(ref) ? ref.displayForm : ref.dataSet;
}

/**
 * @internal
 */
function hasFilterContextBaseProps(obj: unknown): boolean {
    return !isEmpty(obj) && !!(obj as IFilterContextBase).filters;
}
