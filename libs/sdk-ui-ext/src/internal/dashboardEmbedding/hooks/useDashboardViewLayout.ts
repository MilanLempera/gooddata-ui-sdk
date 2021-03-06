// (C) 2020-2021 GoodData Corporation
import {
    IAnalyticalBackend,
    IDashboardLayout,
    layoutWidgets,
    IWidget,
    isInsightWidget,
} from "@gooddata/sdk-backend-spi";
import {
    GoodDataSdkError,
    useBackend,
    useCancelablePromise,
    UseCancelablePromiseCallbacks,
    UseCancelablePromiseState,
    useWorkspace,
} from "@gooddata/sdk-ui";
import { areObjRefsEqual, IInsight, insightVisualizationUrl, ObjRef } from "@gooddata/sdk-model";
import { insightDataLoaderFactory } from "../../../dataLoaders";
import { DashboardViewLayoutWidgetClass } from "../DashboardLayout/interfaces/dashboardLayoutSizing";
import { backendInvariant, workspaceInvariant } from "./utils";

/**
 * @beta
 */
export interface IUseDashboardViewLayoutResult {
    getDashboardViewLayoutWidgetClass: (widget: IWidget) => DashboardViewLayoutWidgetClass;
    getInsightByRef: (insightRef: ObjRef) => IInsight | undefined;
}

/**
 * @beta
 */
export interface IUseDashboardViewLayoutConfig
    extends UseCancelablePromiseCallbacks<IUseDashboardViewLayoutResult, GoodDataSdkError> {
    /**
     * Dashboard layout to transform to view model.
     */
    dashboardLayout: IDashboardLayout | undefined;

    /**
     * Backend to work with.
     *
     * Note: the backend must come either from this property or from BackendContext. If you do not specify
     * backend here, then the hook MUST be called within an existing BackendContext.
     */
    backend?: IAnalyticalBackend;

    /**
     * Workspace where the insight exists.
     *
     * Note: the workspace must come either from this property or from WorkspaceContext. If you do not specify
     * workspace here, then the hook MUST be called within an existing WorkspaceContext.
     */
    workspace?: string;
}

/**
 * Hook allowing to download additional dashboard layout data (visualization classes and insights)
 * @param config - configuration of the hook
 * @beta
 */
export const useDashboardViewLayout = ({
    dashboardLayout,
    backend,
    workspace,
    onCancel,
    onError,
    onLoading,
    onPending,
    onSuccess,
}: IUseDashboardViewLayoutConfig): UseCancelablePromiseState<IUseDashboardViewLayoutResult, any> => {
    const effectiveBackend = useBackend(backend);
    const effectiveWorkspace = useWorkspace(workspace);

    backendInvariant(effectiveBackend, "useDashboardViewLayout");
    workspaceInvariant(effectiveWorkspace, "useDashboardViewLayout");

    const promise = dashboardLayout
        ? async () => {
              const insightRefsToLoad = layoutWidgets(dashboardLayout)
                  .filter(isInsightWidget)
                  .map((w) => w.insight);

              const loader = insightDataLoaderFactory.forWorkspace(effectiveWorkspace);

              const insights = await Promise.all(
                  insightRefsToLoad.map((ref) => loader.getInsight(effectiveBackend, ref)),
              );

              const getInsightByRef = (insightRef: ObjRef): IInsight | undefined => {
                  return insights.find((i) => areObjRefsEqual(i.insight.ref, insightRef));
              };

              const getDashboardViewLayoutWidgetClass = (widget: IWidget): DashboardViewLayoutWidgetClass => {
                  if (widget.type === "kpi") {
                      return "kpi";
                  }
                  const insight = getInsightByRef(widget.insight);
                  return insightVisualizationUrl(insight).split(":")[1] as DashboardViewLayoutWidgetClass;
              };

              return {
                  getDashboardViewLayoutWidgetClass,
                  getInsightByRef,
              };
          }
        : null;

    return useCancelablePromise({ promise, onCancel, onError, onLoading, onPending, onSuccess }, [
        effectiveBackend,
        effectiveWorkspace,
        dashboardLayout,
    ]);
};
