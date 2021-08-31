module.exports = {

    expectAllNotVisible: function(context, selectors) {
        selectors.forEach(selector => {
            context.expect.element(selector).to.not.be.visible;
        });
    },

    expectAllPresent: function(context, selectors) {
        selectors.forEach(selector => {
            context.expect.element(selector).to.be.present;
        });
    },

    expectAllVisible: function(context, selectors) {
        selectors.forEach(selector => {
            context.expect.element(selector).to.be.visible;
        });
    },

    nthOfTypeSelector: function(selector, n) {
        return `${selector}:nth-of-type(${n})`;
    },

}
