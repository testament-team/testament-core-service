export class ExcludeHeaderRule {
    url?: string;
    name: string;
}

export namespace ExcludeHeaderRules {

    export function from(names: string[]): ExcludeHeaderRule[] {
        const rules: ExcludeHeaderRule[] = [];
        for(const name of names) {
            rules.push({
                name: name
            });
        }
        return rules;
    }

}