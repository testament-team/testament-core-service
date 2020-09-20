export class ExcludeUrlRule {
    url: string;
}

export namespace ExcludeUrlRules {

    export function from(urls: string[]): ExcludeUrlRule[] {
        const rules: ExcludeUrlRule[] = [];
        for(const url of urls) {
            rules.push({
                url: url
            });
        }
        return rules;
    }

}