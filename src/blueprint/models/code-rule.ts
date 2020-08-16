import { ScriptType } from "../blueprint";
import { Selector } from "./selector";

export enum CodeRuleType {
    INSERT = "insert",
    DELETE = "delete",
    SUBSTITUTE = "substitute"
}

export class CodeRuleInsert {
    prefix?: string;
    suffix?: string;
    selector: Selector;
}

export class CodeRuleDelete {
    keepFirst?: boolean;
    selector: Selector;
}

export class CodeRuleSubstitute {
    replace: string;
    with: string;
    selector: Selector;
}

export class CodeRule {
    name: string;
    description?: string;
    scriptType?: ScriptType;
    type: CodeRuleType;
    insert?: CodeRuleInsert;
    delete?: CodeRuleDelete;
    substitute?: CodeRuleSubstitute;
    environmentId?: string;
}