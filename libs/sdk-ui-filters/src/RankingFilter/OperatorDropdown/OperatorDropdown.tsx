// (C) 2020 GoodData Corporation
import React, { useState } from "react";
import { Button } from "@gooddata/sdk-ui-kit";
import { RankingFilterOperator } from "@gooddata/sdk-model";
import cx from "classnames";
import { IOperatorDropdownItem } from "../types";
import { OperatorDropdownBody } from "./OperatorDropdownBody";
import { WrappedComponentProps, injectIntl } from "react-intl";

const operatorItems = [
    { value: "TOP", translationId: "rankingFilter.top" },
    { value: "BOTTOM", translationId: "rankingFilter.bottom" },
] as IOperatorDropdownItem[];

const getOperatorItemTranslation = (operator: RankingFilterOperator) => {
    return operatorItems.find(({ value }) => value === operator).translationId;
};

interface IOperatorDropdownComponentOwnProps {
    selectedValue: RankingFilterOperator;
    onSelect: (value: RankingFilterOperator) => void;
}

type OperatorDropdownComponentProps = IOperatorDropdownComponentOwnProps & WrappedComponentProps;

const OperatorDropdownComponent: React.FC<OperatorDropdownComponentProps> = ({
    selectedValue,
    onSelect,
    intl,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const onButtonClick = () => {
        setIsOpen(!isOpen);
    };

    const onItemSelect = (value: RankingFilterOperator) => {
        onSelect(value);
        setIsOpen(false);
    };

    const buttonClassNames = cx(
        "gd-button-secondary",
        "gd-button-small",
        "button-dropdown",
        "icon-right",
        {
            "icon-navigateup": isOpen,
            "icon-navigatedown": !isOpen,
        },
        "gd-rf-operator-dropdown-button",
        "s-rf-operator-dropdown-button",
    );

    const title = intl.formatMessage({ id: getOperatorItemTranslation(selectedValue) });

    return (
        <>
            <Button className={buttonClassNames} value={title} onClick={onButtonClick} />
            {isOpen && (
                <OperatorDropdownBody
                    items={operatorItems}
                    selectedValue={selectedValue}
                    onSelect={onItemSelect}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export const OperatorDropdown = injectIntl(OperatorDropdownComponent);
