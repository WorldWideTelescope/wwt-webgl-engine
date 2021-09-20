import {
    EnhancedSectionInstance,
    EnhancedPageObject,
} from "nightwatch";

type Context = EnhancedPageObject | EnhancedSectionInstance;

export function expectAllNotVisible(context: Context, selectors: string[]): void {
    selectors.forEach(selector => {
        context.expect.element(selector).to.not.be.visible;
    });
}

export function expectAllPresent(context: Context, selectors: string[]): void {
    selectors.forEach(selector => {
        context.expect.element(selector).to.be.present;
    });
}

export function expectAllVisible(context: Context, selectors: string[]): void {
    selectors.forEach(selector => {
        context.expect.element(selector).to.be.visible;
    });
}

export function nthOfTypeSelector(selector: string, n: number): string {
    return `${selector}:nth-of-type(${n})`;
}

